# Flask Proxy (CORS/BFF)

This proxy lets your frontend call Flask through a backend you control, so browser CORS does not block requests.

## Run locally

```bash
cd node_backend
npm install
PORT=8787 FLASK_TARGET=https://flask.opencodingsociety.com npm run start:flask-proxy
```

## Environment variables

- `PORT` (default: `8787`)
- `FLASK_TARGET` (default: `https://flask.opencodingsociety.com`)
- `ALLOWED_ORIGIN` (optional, default echoes request origin)
- `STRIP_SECURE_COOKIE` (optional, default `false`)

## Frontend usage

Set your frontend `pythonURI` to this proxy URL (for example `https://your-proxy.example.com`).

Quick runtime override in browser console:

```js
localStorage.setItem("pythonURI", "https://your-proxy.example.com");
location.reload();
```

## Notes

- Keep proxy on HTTPS in production so secure cookies are accepted.
- This proxy is Flask-focused and does not change Spring behavior.
