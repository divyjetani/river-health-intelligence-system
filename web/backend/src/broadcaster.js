// Simple SSE broadcaster
const clients = new Set();

function addClient(res) {
  clients.add(res);
}
function removeClient(res) {
  clients.delete(res);
}

function broadcastEvent(eventName, data) {
  const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of clients) {
    try {
      res.write(payload);
    } catch (err) {
      // ignore, remove later
    }
  }
}

module.exports = { addClient, removeClient, broadcastEvent };
