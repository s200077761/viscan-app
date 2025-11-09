// local-fs-server.js
// Simple MCP local filesystem tool server (Node.js, minimal)
import { readFile, writeFile } from "fs/promises";
import http from "http";

// NOTE: This is a tiny illustrative server — replace with your ModelContextProtocol SDK server in production.
const PORT = process.env.MCP_LOCAL_PORT || 8070;

const sendJson = (res, obj, code = 200) => {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/read") {
      let body = "";
      for await (const chunk of req) body += chunk;
      const { path: p } = JSON.parse(body);
      const content = await readFile(p, "utf8");
      return sendJson(res, { content });
    }
    if (req.method === "POST" && req.url === "/write") {
      let body = "";
      for await (const chunk of req) body += chunk;
      const { path: p, content } = JSON.parse(body);
      await writeFile(p, content, "utf8");
      return sendJson(res, { success: true });
    }
    sendJson(res, { error: "unsupported" }, 404);
  } catch (err) {
    sendJson(res, { error: err.message }, 500);
  }
});

server.listen(PORT, () => {
  console.log(`local-fs server listening on port ${PORT}`);
});
