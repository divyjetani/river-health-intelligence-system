import React, { useRef, useState, useEffect } from "react";
import { CloudUpload } from "lucide-react";

// Upload component: trimmed for production usage — only fields used by models kept
export default function Upload() {
  const [waterFile, setWaterFile] = useState(null);
  const [trashFile, setTrashFile] = useState(null);
  const [waterPreview, setWaterPreview] = useState(null);
  const [trashPreview, setTrashPreview] = useState(null);

  // numeric inputs used by data model
  const [rainfall, setRainfall] = useState("");
  const [discharge, setDischarge] = useState("");
  const [waterLevel, setWaterLevel] = useState("");
  const [month, setMonth] = useState("");

  // model outputs
  const [colorResult, setColorResult] = useState(null);
  const [trashResult, setTrashResult] = useState(null);
  const [dataResult, setDataResult] = useState(null);
  const [healthResult, setHealthResult] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const trashImgRef = useRef(null);
  const trashCanvasRef = useRef(null);

  useEffect(() => {
    // cleanup object URLs on unmount or change
    return () => {
      if (waterPreview) URL.revokeObjectURL(waterPreview);
      if (trashPreview) URL.revokeObjectURL(trashPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // show preview when a file is chosen
  const onWaterFileChange = (file) => {
    setColorResult(null);
    setWaterFile(file);
    if (file) setWaterPreview(URL.createObjectURL(file));
    else setWaterPreview(null);
  };

  const onTrashFileChange = (file) => {
    setTrashResult(null);
    setTrashFile(file);
    if (file) setTrashPreview(URL.createObjectURL(file));
    else setTrashPreview(null);
  };

  // helper to parse JSON safely and prefer friendly errors
  async function safeJson(res) {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return await res.json();
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error(text || "Non-JSON response");
    }
  }

  // Call water color model
  const callWater = async () => {
    if (!waterFile) return alert("Please select a water image first");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", waterFile);
      const res = await fetch("/api/predict/color", {
        method: "POST",
        body: fd,
      });
      if (!res.ok)
        throw new Error(await res.text().catch(() => res.statusText));
      const json = await safeJson(res);
      setColorResult(json);
      return json;
    } catch (e) {
      alert("Water analysis failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Call trash detection model
  const callTrash = async () => {
    if (!trashFile) return alert("Please select a trash image first");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", trashFile);
      const res = await fetch("/api/predict/trash", {
        method: "POST",
        body: fd,
      });
      if (!res.ok)
        throw new Error(await res.text().catch(() => res.statusText));
      const json = await safeJson(res);
      setTrashResult(json);
      // draw boxes when image is loaded
      setTimeout(() => {
        drawBoxes();
      }, 50);
      return json;
    } catch (e) {
      alert("Trash detection failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // call numeric model
  const callData = async () => {
    setLoading(true);
    try {
      const payload = {
        rainfall: parseFloat(rainfall || 0),
        discharge: parseFloat(discharge || 0),
        water_level: parseFloat(waterLevel || 0),
        month: parseInt(month || 0),
      };
      const res = await fetch("/api/predict/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok)
        throw new Error(await res.text().catch(() => res.statusText));
      const json = await safeJson(res);
      setDataResult(json);
      return json;
    } catch (e) {
      alert("Data model failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // call aggregated health endpoint (will reuse existing component outputs if available)
  const callHealth = async () => {
    setLoading(true);
    try {
      // Ensure we have latest model outputs: call underlying endpoints if missing
      const color = colorResult ?? (waterFile ? await callWater() : null);
      const trash = trashResult ?? (trashFile ? await callTrash() : null);
      const data =
        dataResult ??
        (rainfall || discharge || waterLevel ? await callData() : null);

      const payload = { color, trash, data };
      const res = await fetch("/api/predict/health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok)
        throw new Error(await res.text().catch(() => res.statusText));
      const json = await safeJson(res);
      setHealthResult(json);
      return json;
    } catch (e) {
      alert("Health computation failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Draw bounding boxes on the canvas overlay for trash detections
  const drawBoxes = () => {
    const img = trashImgRef.current;
    const canvas = trashCanvasRef.current;
    const det = trashResult?.detections || [];
    if (!img || !canvas) return;

    // set canvas size to displayed image size
    const w = img.clientWidth;
    const h = img.clientHeight;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);

    // image natural size -> scaling factor
    const nx = img.naturalWidth || w;
    const ny = img.naturalHeight || h;
    const scaleX = w / nx;
    const scaleY = h / ny;

    ctx.lineWidth = Math.max(2, Math.round(Math.min(w, h) * 0.004));
    ctx.font = `${Math.max(
      12,
      Math.round(Math.min(w, h) * 0.028)
    )}px sans-serif`;

    det.forEach((d, idx) => {
      const [x1, y1, x2, y2] = d.bbox;
      const x = x1 * scaleX;
      const y = y1 * scaleY;
      const width = (x2 - x1) * scaleX;
      const height = (y2 - y1) * scaleY;

      // color per class — simple hash
      const hue = ((d.class || idx) * 47) % 360;
      ctx.strokeStyle = `hsl(${hue} 80% 45%)`;
      ctx.fillStyle = `hsla(${hue} 80% 45% / 0.12)`;
      ctx.fillRect(x, y, width, height);
      ctx.strokeRect(x, y, width, height);

      // label
      const label = `${d.name || "trash"} ${(d.conf * 100).toFixed(0)}%`;
      const textW = ctx.measureText(label).width + 8;
      const textH = parseInt(ctx.font, 10) + 6;
      ctx.fillStyle = `hsl(${hue} 80% 45% / 0.9)`;
      ctx.fillRect(x, Math.max(0, y - textH), textW, textH);
      ctx.fillStyle = "#fff";
      ctx.fillText(label, x + 4, Math.max(0, y - 4));
    });
  };

  // re-draw boxes when image size or detections change
  useEffect(() => {
    drawBoxes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trashPreview, trashResult]);

  // reset helper
  const clearAll = () => {
    setWaterFile(null);
    setWaterPreview(null);
    setColorResult(null);
    setTrashFile(null);
    setTrashPreview(null);
    setTrashResult(null);
    setDataResult(null);
    setHealthResult(null);
    setRainfall("");
    setDischarge("");
    setWaterLevel("");
    setMonth("");
    if (trashCanvasRef.current)
      trashCanvasRef.current
        .getContext("2d")
        ?.clearRect(
          0,
          0,
          trashCanvasRef.current.width,
          trashCanvasRef.current.height
        );
  };

  // small UI helpers
  const topContributor = (health) => {
    if (!health || !health.component_scores) return null;
    const comps = health.component_scores;
    const k = Object.keys(comps).reduce((a, b) =>
      comps[a] > comps[b] ? a : b
    );
    return k;
  };

  return (
    <div className="min-h-screen py-8 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          {/* Upload header */}
          <div className="p-6 flex items-center gap-4 border-b border-gray-300">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
              <CloudUpload className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Upload & Analyze</h2>
              <p className="text-sm text-slate-500">
                Only the inputs required by the models are kept. Upload images
                and run analyses.
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={clearAll}
                className="px-3 py-1 rounded-md border text-sm"
              >
                Reset
              </button>
              <button
                disabled={loading}
                className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm"
              >
                {loading ? "Working..." : "Ready"}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Water image */}
            <div className="bg-slate-50 p-4 rounded-lg border  border-gray-300">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Water Image (color)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onWaterFileChange(e.target.files?.[0] || null)}
                className="mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={callWater}
                  disabled={!waterFile || loading}
                  className="px-3 py-2 rounded-md bg-green-600 text-white"
                >
                  {loading ? "Analyzing..." : "Analyze Water"}
                </button>
                <button
                  onClick={() => {
                    setColorResult(null);
                    setWaterFile(null);
                    setWaterPreview(null);
                  }}
                  className="px-3 py-2 rounded-md border"
                >
                  Clear
                </button>
              </div>
              {waterPreview && (
                <div className="mt-3">
                  <img
                    src={waterPreview}
                    alt="water preview"
                    className="w-full rounded-md border"
                  />
                </div>
              )}
            </div>

            {/* Water result */}
            <div className="bg-white p-4 rounded-lg border border-gray-300">
              <h4 className="font-semibold">Water Color Result</h4>
              {colorResult ? (
                <div className="mt-2">
                  <div className="text-sm">
                    Type:{" "}
                    <span className="font-medium">
                      {colorResult.discoloration_class}
                    </span>
                  </div>
                  {colorResult.turbidity !== null && (
                    <div className="text-sm">
                      Turbidity:{" "}
                      <span className="font-medium">
                        {Number(colorResult.turbidity).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="mt-2 text-xs text-slate-500">
                    Class probabilities:
                  </div>
                  <ul className="mt-1 text-sm space-y-1">
                    {Object.entries(colorResult.discoloration_probs || {}).map(
                      ([k, v]) => (
                        <li key={k} className="flex justify-between">
                          <span>{k}</span>
                          <span>{(v * 100).toFixed(1)}%</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              ) : (
                <div className="mt-2 text-sm text-slate-500">
                  No water analysis yet.
                </div>
              )}
            </div>

            {/* Trash image */}
            <div className="bg-slate-50 p-4 rounded-lg border border-gray-300">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Trash Image (detection)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onTrashFileChange(e.target.files?.[0] || null)}
                className="mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={callTrash}
                  disabled={!trashFile || loading}
                  className="px-3 py-2 rounded-md bg-amber-600 text-white"
                >
                  {loading ? "Detecting..." : "Detect Trash"}
                </button>
                <button
                  onClick={() => {
                    setTrashResult(null);
                    setTrashFile(null);
                    setTrashPreview(null);
                    if (trashCanvasRef.current)
                      trashCanvasRef.current
                        .getContext("2d")
                        ?.clearRect(
                          0,
                          0,
                          trashCanvasRef.current.width,
                          trashCanvasRef.current.height
                        );
                  }}
                  className="px-3 py-2 rounded-md border"
                >
                  Clear
                </button>
              </div>

              {trashPreview && (
                <div className="mt-3 relative">
                  <img
                    ref={trashImgRef}
                    src={trashPreview}
                    alt="trash preview"
                    className="w-full rounded-md border"
                    onLoad={drawBoxes}
                  />
                  <canvas
                    ref={trashCanvasRef}
                    className="absolute inset-0 pointer-events-none rounded-md"
                    style={{ top: 0, left: 0 }}
                  />
                </div>
              )}
            </div>

            {/* Trash result */}
            <div className="bg-white p-4 rounded-lg border border-gray-300">
              <h4 className="font-semibold">Trash Detection Result</h4>
              {trashResult ? (
                <div className="mt-2">
                  <div className="text-sm">
                    Detections:{" "}
                    <span className="font-medium">
                      {trashResult.num_detections}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm">
                    {(trashResult.detections || []).map((d, i) => (
                      <li key={i} className="flex justify-between items-center">
                        <div>
                          <strong>{d.name}</strong>{" "}
                          <span className="text-xs text-slate-500">
                            ({(d.conf * 100).toFixed(0)}%)
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">
                          bbox: [{d.bbox.map((v) => Math.round(v)).join(", ")}]
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 text-xs text-slate-500">
                    Boxes are visualized on the image preview.
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-sm text-slate-500">
                  No trash detection yet.
                </div>
              )}
            </div>

            {/* Numeric inputs */}
            <div className="bg-slate-50 p-4 rounded-lg border border-gray-300">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Environmental Data (for numeric model)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Rainfall (mm)"
                  value={rainfall}
                  onChange={(e) => setRainfall(e.target.value)}
                  className="px-3 py-2 rounded-md border  border-gray-300"
                />
                <input
                  type="number"
                  placeholder="Discharge (m³/s)"
                  value={discharge}
                  onChange={(e) => setDischarge(e.target.value)}
                  className="px-3 py-2 rounded-md border border-gray-300"
                />
                <input
                  type="number"
                  placeholder="Water level (m)"
                  value={waterLevel}
                  onChange={(e) => setWaterLevel(e.target.value)}
                  className="px-3 py-2 rounded-md border border-gray-300"
                />
                <input
                  type="number"
                  placeholder="Month (1-12)"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="px-3 py-2 rounded-md border border-gray-300"
                />
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={callData}
                  disabled={loading}
                  className="px-3 py-2 rounded-md bg-blue-600 text-white"
                >
                  {loading ? "Sending..." : "Send Data"}
                </button>
                <button
                  onClick={() => {
                    setDataResult(null);
                    setRainfall("");
                    setDischarge("");
                    setWaterLevel("");
                    setMonth("");
                  }}
                  className="px-3 py-2 rounded-md border"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Data result */}
            <div className="bg-white p-4 rounded-lg border border-gray-300">
              <h4 className="font-semibold">Environmental Data Result</h4>
              {dataResult ? (
                <div className="mt-2">
                  <div className="text-sm">
                    Pollution score:{" "}
                    <span className="font-medium">
                      {dataResult.pollution_score}
                    </span>
                  </div>
                  <div className="text-sm">
                    Level:{" "}
                    <span className="font-medium">
                      {dataResult.pollution_level}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-sm text-slate-500">
                  No data model result yet.
                </div>
              )}
            </div>

            {/* Combined health */}
            <div className="bg-slate-50 p-4 rounded-lg border border-gray-300">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Combined Health
              </label>
              <div className="flex gap-2">
                <button
                  onClick={callHealth}
                  disabled={loading}
                  className="px-3 py-2 rounded-md bg-emerald-600 text-white"
                >
                  Compute Health
                </button>
                <button
                  onClick={() => setHealthResult(null)}
                  className="px-3 py-2 rounded-md border"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Health result */}
            <div className="bg-white p-4 rounded-lg border border-gray-300">
              <h4 className="font-semibold">Combined Health Result</h4>
              {healthResult ? (
                <div className="mt-2">
                  <div className="flex items-center gap-4">
                    <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-red-500 h-4"
                        style={{ width: `${healthResult.health_score}%` }}
                      />
                    </div>
                    <div className="text-sm font-bold">
                      {healthResult.health_score}
                    </div>
                  </div>

                  <div className="mt-3 text-sm">
                    <div>
                      Top contributor:{" "}
                      <strong>{topContributor(healthResult) || "N/A"}</strong>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-slate-500">
                    Component breakdown:
                  </div>
                  <ul className="mt-1 text-sm space-y-1">
                    {Object.entries(healthResult.component_scores || {}).map(
                      ([k, v]) => (
                        <li key={k} className="flex justify-between">
                          <span>{k}</span>
                          <span>{v}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              ) : (
                <div className="mt-2 text-sm text-slate-500">
                  No combined health result yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
