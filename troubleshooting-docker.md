# Troubleshooting docker compose and Docker

The container update process can hit problems. When the CLIENT_VERSION and API_VERSION env variables are changed and applied, a `docker compose up -d` will pull any new images from Azure `epraseregistry.azurecr.io` via the internet. This access is enabled by a web proxy provided by SCC. The OS is Centos9 running Docker version 

## Proxy settings

There is a code snippet in `root\.docker\config.json` that specifies the proxy used and also an Enviroment variable set in `/etc/systemd/system/docker.service.d/http-proxy.conf`. These need to match the web proxy IP, or it won't be possible to pull new docker images to update the application. (This file also contains the auth key for `epraseregistry.azurecr.io`).

![config.json](/readme-images/config.json.png)

![http-proxy.conf](/readme-images/docker-http-proxy.png)

This was a helpful link. 

[https://stackoverflow.com/questions/58841014/set-proxy-on-docker](https://stackoverflow.com/questions/58841014/set-proxy-on-docker)

## Problems with pulling new Docker images

Docker by default pulls multiple image layers as the same time. This can cause the download to hang and fail. Docker has been set to pull one layer at a time by using a command `--max-concurrent-downloads 1` set in `/etc/docker/daemon.json`.


```bash
{
	"max-concurrent-downloads": 1
}
```

If this needs to be changed you will need to restart the docker service

```bash
service docker restart
 ```


## Helpful Docker commands

There are commands you can run to see the status of the Docker daemon :

```bash
systemctl show docker
 ```

 ```bash
systemctl status docker
 ```

This is if docker compose can't find the docker daemon even if its running..

```bash
systemctl stop docker
systemctl restart docker.socket
systemctl start docker


systemctl daemon-reload
systemctl restart docker
```



