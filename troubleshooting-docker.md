# Troubleshooting docker-compose and Docker

The container update process can hit problems. When the CLIENT_VERSION and API_VERSION env variables are changed and applied, a `docker-compose up -d` will pull any new images from Azure `epraseregistry.azurecr.io` via the internet. This access is enabled by a web proxy provided by SCC. The OS is old - Centos7 and is running the latest possible version of Docker it can support (26.1.4). 

## Proxy settings

There is a code snippet in `root\.docker\config.json` that specifies the proxy used and also an Enviroment variable set in `/etc/systemd/system/docker.service.d/http-proxy.conf`. These need to match the web proxy IP, or it won't be possible to pull new docker images to update the application. (This file also contains the auth key for `epraseregistry.azurecr.io`).

![config.json](/readme-images/config.json.png)


![http-proxy.conf](/readme-images/docker-http-proxy.png)

This was a helpful link. 

[https://stackoverflow.com/questions/58841014/set-proxy-on-docker](https://stackoverflow.com/questions/58841014/set-proxy-on-docker)

## Problems with pulling new Docker images

Docker by default pulls multiple image layers as the same time. This can cause the download to hang and fail. It's possible to force docker to pull one layer at a time by using the --max-concurrent-downloads 1 flag. Stop the Docker service `service docker stop` and then start it using `dockerd --max-concurrent-downloads 1`

```bash
service docker stop
dockerd --max-concurrent-downloads 1
```

At this point, the Docker service will be actively running in the terminal - DO NOT stop it by control-c. Open a new terminal window, log in with root permissions as before. Go to the eprase directory and run `docker-compose up -d`. The image layers should queue to download individually. 

[https://stackoverflow.com/questions/41303784/how-to-pull-layers-one-by-one-in-docker-to-avoid-connection-timeout](https://stackoverflow.com/questions/41303784/how-to-pull-layers-one-by-one-in-docker-to-avoid-connection-timeout)


It's probably best to close the new terminal window once the download is completed and the containers are running. Then control-c out of the dockerd service, restart docker `service docker start` and exit. If on logging back into the server docker-compose refuses to run, try the systemctl commands at the bottom of this page.

## Helpful Docker commands

There are commands you can run to see the status of the Docker daemon :

```bash
systemctl show docker
 ```

 ```bash
systemctl status docker
 ```

This is if docker-compose can't find the docker daemon even if its running..

```bash
systemctl stop docker
systemctl restart docker.socket
systemctl start docker


systemctl daemon-reload
systemctl restart docker
```



