const http = require("http");
const https = require("https");

const PORT = Number(process.env.PORT || 8787);
const TARGET_ORIGIN = process.env.FLASK_TARGET || "https://flask.opencodingsociety.com";
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "";
const STRIP_SECURE_COOKIE = process.env.STRIP_SECURE_COOKIE === "true";

const target = new URL(TARGET_ORIGIN);
const transport = target.protocol === "https:" ? https : http;

function getCorsOrigin(req) {
  if (ALLOWED_ORIGIN) return ALLOWED_ORIGIN;
  const requestOrigin = req.headers.origin;
  return requestOrigin || "*";
}

function setCorsHeaders(req, res) {
  const origin = getCorsOrigin(req);
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"] || "Content-Type, Authorization, X-Origin"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD");
}

function rewriteSetCookieHeaders(setCookieHeaders) {
  if (!Array.isArray(setCookieHeaders)) return setCookieHeaders;

  return setCookieHeaders.map((cookie) => {
    let rewritten = cookie.replace(/;\s*Domain=[^;]*/i, "");
    if (STRIP_SECURE_COOKIE) {
      rewritten = rewritten.replace(/;\s*Secure/gi, "");
    }
    return rewritten;
  });
}

function proxyRequest(req, res) {
  const upstreamHeaders = { ...req.headers };
  delete upstreamHeaders.host;

  // Avoid forwarding browser CORS preflight headers upstream.
  delete upstreamHeaders["access-control-request-method"];
  delete upstreamHeaders["access-control-request-headers"];

  const upstreamReq = transport.request(
    {
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port || (target.protocol === "https:" ? 443 : 80),
      method: req.method,
      path: req.url,
      headers: upstreamHeaders,
    },
    (upstreamRes) => {
      const upstreamResponseHeaders = { ...upstreamRes.headers };

      // CORS headers must match the proxy origin, not the upstream value.
      delete upstreamResponseHeaders["access-control-allow-origin"];
      delete upstreamResponseHeaders["access-control-allow-credentials"];
      delete upstreamResponseHeaders["access-control-allow-methods"];
      delete upstreamResponseHeaders["access-control-allow-headers"];

      if (upstreamResponseHeaders["set-cookie"]) {
        upstreamResponseHeaders["set-cookie"] = rewriteSetCookieHeaders(
          upstreamResponseHeaders["set-cookie"]
        );
      }

      res.writeHead(upstreamRes.statusCode || 502, upstreamResponseHeaders);
      setCorsHeaders(req, res);
      upstreamRes.pipe(res);
    }
  );

  upstreamReq.on("error", (err) => {
    setCorsHeaders(req, res);
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Proxy upstream error", detail: err.message }));
  });

  req.pipe(upstreamReq);
}

http
  .createServer((req, res) => {
    setCorsHeaders(req, res);

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    proxyRequest(req, res);
  })
  .listen(PORT, () => {
    console.log(`Flask proxy listening on port ${PORT}`);
    console.log(`Forwarding requests to ${TARGET_ORIGIN}`);
  });
