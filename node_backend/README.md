# Deployment Information

Change the Backend URL in GameEnv.  For a secure `https` connection use `wss` instead of ws
pages/assets/js/multiplayer/GameEnv.js

```nodejs
static socket = io(`ws://${window.location.host.split(":")[0]}:3000`); 
```

Use the Dockerfile and docker-compose in node_backend to adjust the actual output port in the docker-compose
In NGINX make sure to forward web socket traffic, here is an NGINX file from another project using socket.io.

```nginx
server {
    server_name platformer_ws.opencodingsociety.com;
    location / {
         proxy_pass http://localhost:300;

        # this magic is needed for WebSocket
        proxy_http_version  1.1;
        proxy_set_header    Upgrade $http_upgrade;
        proxy_set_header    Connection $connection_upgrade;
        proxy_set_header    Host $http_host;
        proxy_set_header    X-Real-IP $remote_addr;
    }
}
```
