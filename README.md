# vue-eprase

> The Vue version of the eprase client.

## About

Eprase is a tool to test electronic prescribing systems used by NHS Trusts in England. It has a Vue based client (front-end) and Java Spring Boot server based back-end that interacts with a Postgres database. This repo contains the client code base.

### Project Team

* Becky Osselton, Newcastle University  ([rebecca.osselton@newcastle.ac.uk](mailto:rebecca.osselton@newcastle.ac.uk))
* Mark Turner, Newcastle University  ([mark.turner@newcastle.ac.uk](mailto:mark.turner@newcastle.ac.uk))
* Jude Heed, Newcastle University ([Jude.Heed@newcastle.ac.uk](mailto:jude.heed@newcastle.ac.uk))
* Stephanie Klein, The Newcastle Hospitals NHS Foundation Trust  ([stephanie.klein@nhs.net](mailto:stephanie.klein@nhs.net))
* Neil Watson, The Newcastle Hospitals NHS Foundation Trust ([neil.watson14@nhs.net](mailto:neil.watson14@nhs.net))


### RSE Contact
Becky Osselton/Mark Turner, RSE Team, Newcastle University


### Built With

* [Vue.js](https://vuejs.org/)
* [Java - Spring Boot Framework](https://spring.io/projects/spring-boot)
* [Postgres](https://www.postgresql.org/)

### Prerequisites

Node.js, Git

## Local Development Build Setup

Pull down the copy of the repo, then cd into the directory and use npm to install the required dependencies

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```

### Build for production with minification

Running the build command creates a build folder called 'dist'. This contains all the images and a build.js file of minified code

```
npm run build
```

### Control of version number shown

Adjust the value of the version variable in the settings.js file


### Open/close the application to users, while keeping it open to admin

Adjust the value of the appOpen variable in the settings.js file


## Production Deployment

This guide assumes you have access to the production server via Pulse Secure using a token provided by SCC. Contact Becky Osselton or Mark Turner if you are not in this position. Once you have a secure connection to the NHS network, connect to the VM using

```bash
ssh <username>@192.168.241.18
```

This will prompt for your password, again provided by SCC. Immediately switch to sudo mode using `sudo -i`, which will prompt for your password again. Then change directory to `/eprase`.

To deploy a new version of the app alter the version numbers in the `.env` file to match as needed. Run `source .env` to apply the change. You can check this has worked with `echo $CLIENT_VERSION` and it will print the value you just set. Then bring down any running services including the data volvumes with

```bash
docker-compose down -v
```

Service images are hosted in a private Azure registry, make sure your user is logged in to that registry for the image pull process to work.

```bash
docker login epraseregistry.azurecr.io -u epraseregistry -p <password>
```

Ensure the lastest images are locally available based on the versions defined in the `.env` file with

```bash
docker-compose pull
```

Finally start all the services in detached mode using

```bash
docker-compose up -d
```

Use 'docker-compose ps' to confirm that all services are running (the server, database and pgadmin). Pgadmin does not run in production.

```bash
docker-compose ps
```

If any services are down, start debugging by viewing the logs for that service.

```bash
docker-compose logs <service-name>
```


