import { Camera, Video, MapPin, Calendar, CloudUpload } from 'lucide-react';
import { useState } from 'react';

export default function Upload() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadType, setUploadType] = useState('image');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Upload Visual Data</h1>
          <p className="text-slate-600 mt-2">
            Submit photos or videos from drones, CCTV cameras, or mobile devices for AI analysis
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setUploadType('image')}
            className={`p-6 rounded-2xl border transition-all bg-gradient-to-br from-blue-100 to-cyan-100 border border-slate-300 hover:from-blue-200 hover:to-cyan-200 ${
              uploadType === 'image'
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <Camera className={`w-8 h-8 mb-3 ${uploadType === 'image' ? 'text-blue-600' : 'text-slate-400'}`} />
            <h3 className="text-lg font-bold text-slate-900 mb-1">Image Upload</h3>
            <p className="text-sm text-slate-600">Upload photos from drones, cameras, or smartphones</p>
          </button>

          <button
            onClick={() => setUploadType('video')}
            className={`p-6 rounded-2xl border transition-all bg-gradient-to-br from-blue-100 to-cyan-100 border border-slate-300 hover:from-blue-200 hover:to-cyan-200 ${
              uploadType === 'video'
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <Video className={`w-8 h-8 mb-3 ${uploadType === 'video' ? 'text-blue-600' : 'text-slate-400'}`} />
            <h3 className="text-lg font-bold text-slate-900 mb-1">Video Upload</h3>
            <p className="text-sm text-slate-600">Upload video streams or CCTV footage for analysis</p>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div
            className={`p-12 border-4 border-dashed transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-300 bg-slate-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
          >
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-2xl">
                  <CloudUpload className="w-12 h-12 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Drop {uploadType === 'image' ? 'images' : 'videos'} here or click to browse
                </h3>
                <p className="text-slate-600">
                  Supports {uploadType === 'image' ? 'JPG, PNG, HEIC' : 'MP4, MOV, AVI'} files up to 100MB
                </p>
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                Select Files
              </button>
            </div>
          </div>

          <div className="p-8 bg-white">
            <h4 className="font-bold text-slate-900 mb-4">Additional Information</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter GPS coordinates or location name"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Capture Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Source Type
                </label>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Drone</option>
                  <option>CCTV Camera</option>
                  <option>Mobile Phone</option>
                  <option>Satellite Imagery</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Add any additional context or observations..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Your data will be processed using AI to detect pollution and update river health scores
              </p>
              <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                Start Analysis
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h4 className="font-bold text-slate-900 mb-3">What happens next?</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h5 className="font-semibold text-slate-900 mb-1">AI Analysis</h5>
                <p className="text-sm text-slate-600">Computer vision detects pollutants and analyzes water quality</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h5 className="font-semibold text-slate-900 mb-1">Health Score</h5>
                <p className="text-sm text-slate-600">System calculates updated river health metrics</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h5 className="font-semibold text-slate-900 mb-1">Map Update</h5>
                <p className="text-sm text-slate-600">Geographic data is added to pollution heatmaps</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
