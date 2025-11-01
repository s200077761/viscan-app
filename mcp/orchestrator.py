# orchestrator.py
# Simple orchestrator that aggregates results from other MCP services (skeleton)
import json
from http.server import BaseHTTPRequestHandler, HTTPServer

HOST = "0.0.0.0"
PORT = 8082

class Handler(BaseHTTPRequestHandler):
    def _send_json(self, obj, code=200):
        payload = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_POST(self):
        if self.path == "/combine":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)
            data = json.loads(body.decode("utf-8"))
            # data expected: {"iris": {...}, "face": {...}, "palm": {...}}
            summary = {
                "diagnostic_summary": "Integrated multi-source analysis (skeleton)",
                "sources": data
            }
            return self._send_json(summary)
        self._send_json({"error": "not found"}, 404)

if __name__ == "__main__":
    server = HTTPServer((HOST, PORT), Handler)
    print(f"orchestrator listening on {HOST}:{PORT}")
    server.serve_forever()
