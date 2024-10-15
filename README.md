# vue-eprase

> The Vue version of the eprase client.

## About

Eprase is a tool to test electronic prescribing systems used by NHS Trusts in England. It has a Vue based client (front-end) and Java Spring Boot server based back-end that interacts with a Postgres database. This repo contains the client code base. The client does not need to be run in Docker when in local development mode.

### Project Team

* Becky Osselton, Newcastle University  ([rebecca.osselton@newcastle.ac.uk](mailto:rebecca.osselton@newcastle.ac.uk))
* David Herbert, Newcastle University  ([David.Herbert2@newcastle.ac.uk](mailto:David.Herbert2@newcastle.ac.uk))
* John Schoneboom, Newcastle University  ([John.Schoneboom@newcastle.ac.uk](mailto:John.Schoneboom@newcastle.ac.uk))
* Stephanie Klein, The Newcastle Hospitals NHS Foundation Trust  ([stephanie.klein@nhs.net](mailto:stephanie.klein@nhs.net))
* Ellie Merrison, The Newcastle Hospitals NHS Foundation Trust  ([eleanor.merrison1@nhs.net](mailto:eleanor.merrison1@nhs.net))


### RSE Contact
Becky Osselton, RSE Team, Newcastle University
David Herbert, RSE Team, Newcastle University
John Schoneboom, RSE Team, Newcastle University


### Built With

* Client - [Vue.js](https://vuejs.org/)
* Server - [Java - Spring Boot Framework](https://spring.io/projects/spring-boot)
* Database - [Postgres](https://www.postgresql.org/)

### Prerequisites

Node.js, Git

This repository currently requires Node 21. Using NVM can help with this.

## Local Development Build Setup

Pull down the copy of the repo, then cd into the directory and use npm to install the required dependencies

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```

There is no .env file required to run the client code locally.

### Control of version number shown

Adjust the value of the `version` variable in the settings.js file to match any major version updates. This is shown in small print on the welcome page of the application.


### Open/close the application to users, while keeping it open to admin

Two variables are used to control user access. One is a boolean JS variable in the client code base (`appOpen`), the other is an environment variable in the .env file (`APP_OPEN`). To close the application to standard users but keep it open to admin, adjust the value of the `appOpen` variable in the settings.js file. e.g. `appOpen : false`. This variable controls whether the 'start' button is shown on the application welcome page. Users will still be able to navigate directly to the login page (as this needs to be kept open for admin access). However, the environment variable APP_OPEN should be set to 'false' in this case, this will ensure that only users with admin roles will be able to log into the application.

It should be possible to update the appOpen variable without affecting the overall application (and database) by manually bringing down the client only and pulling an updated image with the docker commands:

* `$ sudo docker-compose stop client`
* `$ sudo docker-compose pull client`
* `$ sudo docker-compose start client`


## Deployment Overview

![deployent-diagram](eprase-deployment.png)

## Staging Deployment

The QA version of eprase is hosted at: https://eprase.ncldata.dev/. This staging version of the application is designed for testing and will be automatically updated and deployed by a push to the `main` branch. This could be done manually, or by merging a Pull Request from `dev` branch to `main`.

Access to the staging VM:

`ssh -i <path-to-your-private-key> adminuser@172.167.122.185`

Containers can be explored using the following command,  `sudo docker ps` will list all the container ids.

`sudo docker exec -it <container-id> /bin/bash`

To see the state of data in the database use:

`sudo docker exec -it <container-name> psql -U eprase eprase` It will open a connection that allows you to use SQL queries.

To see all tables: `\dt`

To select data: `select * from users`

Quit the database: `\q`

On the staging server, the eprase-client and eprase-server images are tagged as `latest`.  If the application is refusing to update, either of the current 'latest' image may need to be removed manully before doing another Pull Request to main.

`$ sudo docker image ls`

Then remove the image with `$ sudo docker rmi <image_id>`. You should see output similar to that below.

``` bash
Untagged: epraseregistry.azurecr.io/eprase-server:latest
Untagged: epraseregistry.azurecr.io/eprase-server@sha256:xxxxx
Deleted: sha256:xxxxx
Deleted: sha256:xxxxx
```

Then a new Pull Request will pull down the new image from Docker and bring the containers back up.

When updating the staging server, check that the environment variables in the .env file match the variables set in the docker-compose.yml file.


### Cache

The staging version runs under the `ncldata.dev` domain, meaning cache may need to be purged after a new deployment.

## Production Deployment

Production deployment is a manual process due to protected nature of the hosting server - https://eprase.nhs.uk. Domain access is only possible through an NHS network.

This guide assumes you have access to the production server via Pulse Secure using a token provided by SCC. Contact Becky Osselton or Stephanie Klein if you are not in this position. Once you have a secure connection to the NHS network, connect to the VM using:

```bash
ssh <username>@192.168.241.18
```

This will prompt for your password, again provided by SCC. Immediately switch to sudo mode using `sudo su -`, which will prompt for your password again. Then change directory to `/eprase`.

To deploy a new version of the app, alter the version numbers in the `.env` file to match the latest tagged version of the client and server in the Azure eprase repository. You can also alter the status of the APP_OPEN and ENV_BUILD environment variables.

* APP_OPEN is used to limit access to the application to admin users only, when the site is offically closed to other NHS users.
* ENV_BUILD is used to prevent loss of data when the application is offcially open. It must be set to 'test' if the data vlume is to e destroyed.

If ENV_BUILD is set to `test`, then the data for the app can be cleared using `docker-compose down -v`. Then `docker-compose up -d` will bring up a clean database, but with all the pre-required data created. This is the application being used in a testing mode.

If the application is in production mode (as in open to use by NHS users) and one of the containers has gone down, the site needs to be restored without data loss. At the beginning of an 'open' period, the ENV_BUILD variable value should be set to 'prod'. This will allow containers to be brought down and back up without the server code trying to rebuild pre-required data in its runner files (which causes a build error).

 Run `export $(xargs < .env)` to apply any changes. You can check this has worked by typing`env` at the terminal. This will list all the shell (terminal) environment variables. Output .env contents with `cat .env`. This might need to be done every time you log on the server.

 When updating the production server, check that the environment variables in the .env file match the variables set in the docker-compose.yml file.

 ### Troubleshooting docker-compose problems

 Read about the Docker config and web proxy - [Troubleshooting Docker](troubleshooting-docker.md)

 ### Docker commands

 Bring down any running services including the data volumes:

```bash
docker-compose down -v
```

Bring down running services without removing the data volumes:

```bash
docker-compose down
```

Start all the services in detached mode using:

```bash
docker-compose up -d
```

New images should be pulled as part of the docker 'up' process.


Use 'docker-compose ps' to confirm that all services are running (the server, database and pgadmin). Pgadmin does not run in production.

```bash
docker-compose ps
```

#### Azure registry

Service images are hosted in a private Azure registry, login details

```bash
docker login epraseregistry.azurecr.io -u epraseregistry -p <password>
```

#### View Docker logs

If any services are down, start debugging by viewing the logs for that service.

```bash
docker-compose logs <service-name>
```

Or

```bash
docker logs <container_id>
```


## Preparing for a tool launch (production)

| Server      | Environment variables | Comments     |
| :---        |    :----:   |          ---: |
| docker-compose down -v, docker-compose up -d    | ENV_BUILD=test, APP_OPEN=true       | Start with a clean build  |
| Change ENV_BUILD to prod   | ENV_BUILD=prod, APP_OPEN=true         |  re-apply .env variables     |
| Tool open for reports | ENV_BUILD=prod, APP_OPEN=true | Tool in open mode, volume can no longer be brought down with -v  |

## Closing the application to all users except admin

| Server      | Environment variables | Comments     |
| :---        |    :----:   |          ---: |
| Update settings.js file in the Client, change appOpen=false (on dev branch) |   |
| Create a PR for dev -> master | | Master branch needs to be updated via dev branch changes |
| Create a tagged version for the new client | | Follow format x.x.x |
| Change APP_OPEN to false | ENV_BUILD=prod, APP_OPEN=false | re-apply .env variables  |
| Change the CLIENT_VERSION to match the new the tagged version | ENV_BUILD=prod, APP_OPEN=false, CLIENT_VERSION=x.x.x | re-apply .env variables |
| docker-compose stop client | |  Stops the client container |
| docker-compose pull client | | Pulls a new client image |
| docker-compose start client | | Starts the client with the closed message showing on the home page |
| docker-compose down | | Brings all the containers down (but not the data volume) |
| docker-compose up -d | | Brings all the containers back up. |


This last action rebuilds the app with the environment variable APP_OPEN=false. This needed to ensure that the server code will only allow admin users to access the application through the login page. For safety sake, its best to pull off all the data as csv files before closing the application formally.


## SSL cert renewal

SSL certificates are bought through [https://www.ssl2buy.com/](https://www.ssl2buy.com/) and need to be renewed at regular intervals. When a certificate expires SSL2buy will send an email with a link incorporating a unique pin. This can be used to login to the SSL wizard. Ask Mark Turner or Becky Osselton for the login credentials.

See [SSL Certificate Renewal](SSL.md)