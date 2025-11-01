# viscan_ai_server.py
# Minimal Python MCP-style server skeleton for image analysis (OpenCV)
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import cv2

HOST = "0.0.0.0"
PORT = 8081

class Handler(BaseHTTPRequestHandler):
    def _send_json(self, obj, code=200):
        payload = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_POST(self):
        if self.path == "/analyze":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)
            data = json.loads(body.decode("utf-8"))
            image_path = data.get("image_path")
            try:
                img = cv2.imread(image_path)
                if img is None:
                    return self._send_json({"error": "image not found"}, 400)
                h, w, c = img.shape
                return self._send_json({"status": "ok", "shape": [h, w, c]})
            except Exception as e:
                return self._send_json({"error": str(e)}, 500)
        self._send_json({"error": "not found"}, 404)

if __name__ == "__main__":
    server = HTTPServer((HOST, PORT), Handler)
    print(f"viscan-ai server listening on {HOST}:{PORT}")
    server.serve_forever()
