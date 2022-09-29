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

### Control of version number shown

Adjust the value of the `version` variable in the settings.js file to match any major version updates. This is shown in small print on the welcome page of the application.


### Open/close the application to users, while keeping it open to admin

Two variables are used to control user access. One is a boolean JS variable in the client code base (`appOpen`), the other is an environment variable in the .env file (`APP_OPEN`). To close the application to standard users but keep it open to admin, adjust the value of the `appOpen` variable in the settings.js file. e.g. `appOpen : false`. This variable controls whether the 'start' button is shown on the application welcome page. Users will still be able to navigate directly to the login page (as this needs to be kept open for admin access). However, the environment variable APP_OPEN should be set to 'false' in this case, this will ensure that only users with admin roles will be able to log into the application.

It should be possible to update the appOpen variable without affecting the overall application (and database) by manually bringing down the client only and pulling an updated image with the docker commands:

* `$ docker-compose stop <service_name>`
* `$ docker pull <service_name>`
* `$ docker-compose up -d <service_name>`


## Deployment Overview

![deployent-diagram](eprase-deployment.png)

## Staging Deployment

The QA version of eprase is hosted at: https://eprase.ncldata.dev/. This staging version of the application is designed for testing and will be automatically updated and deployed by a push to the `main` branch. This could be done manually, or by merging a Pull Request from `dev` branch to `main`.

Access to the staging VM:

`ssh -i <path-to-your-private-key> adminuser@51.140.36.254`

Containers can be explored using the following command,  `sudo docker ps` will list all the container ids.

`sudo docker exec -it <container-id> /bin/bash`

To see the state of data in the database use:

`sudo docker exec -it <container-name> psql -U eprase eprase` It will open a connection that allows you to use SQL queries.

To see all tables: `\dt`

To select data: `select * from users`

Quite the database: `\q`

On the staging server, the eprase-client and eprase-server images are tagged as `latest`.  If the application is refusing to update, either of the current 'latest' image may need to be removed manully before doing another Pull Request to main.

`$ sudo docker image ls`

Then remove the image with `$ sudo docker rmi <image_id>`. You should see output similar to that below.

```Untagged: epraseregistry.azurecr.io/eprase-server:latest```
```Untagged: epraseregistry.azurecr.io/eprase-server@sha256:xxxxx```
```Deleted: sha256:xxxxx```
```Deleted: sha256:xxxxx```

Then a new Pull Request will pull down the new image from Docker and bring the containers back up.

### Pull an image manually

Pull a new image with `$ sudo docker pull client:latest`. You may be asked to log into Docker. The password to do this is available from the eprase registry on Azure.

`sudo docker login epraseregistry.azurecr.io -u epraseregistry --password-stdin`

?????

Bring the client service back up with the docker-compose command 'up -d'.

* `$ sudo docker-compose stop <service_name>`
* `$ sudo docker-compose up -d <service_name>`


When updating the staging server, check that the environment variables in the .env file match the variables set in the docker-compose.yml file.


### Cache

The staging version runs under the `ncldata.dev` domain, meaning cache may need to be purged after a new deployment.

## Production Deployment

Production deployment is a manual process due to protected nature of the hosting server - https://eprase.nhs.uk. Domain access is only possible through an NHS network.

This guide assumes you have access to the production server via Pulse Secure using a token provided by SCC. Contact Becky Osselton or Mark Turner if you are not in this position. Once you have a secure connection to the NHS network, connect to the VM using:

```bash
ssh <username>@192.168.241.18
```

This will prompt for your password, again provided by SCC. Immediately switch to sudo mode using `sudo -i`, which will prompt for your password again. Then change directory to `/eprase`.

To deploy a new version of the app, alter the version numbers in the `.env` file to match the latest tagged version of the client and server in the Azure eprase repository. You can also alter the status of the APP_OPEN and ENV_BUILD environment variables.

* APP_OPEN is used to limit access to the application to admin users only, when the site is offically closed to other NHS users.
* ENV_BUILD is used to prevent loss of data when the application is offcially open.

If ENV_BUILD is set to `test`, then the data for the app can be cleared using `docker-compose down -v`. Then `docker-compose up -d` will bring up a clean database, but with all the pre-required data created. This is the application being used in a testing mode.

If the application is in production mode (as in open to use by NHS users) and one of the containers has gone down, the site needs to be restored without data loss. At the beginning of an 'open' period, the ENV_BUILD variable value should be set to 'prod'. This will allow containers to be brought down and back up without the server code trying to rebuild pre-required data in its runner files (which causes a build error).

 Run `source .env` to apply any changes. You can check this has worked with `echo <ENV_VAR>` and it will print the value you just set.

 When updating the production server, check that the environment variables in the .env file match the variables set in the docker-compose.yml file.

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

## SSL cert renewal

SSL certificates are bought through [https://www.ssl2buy.com/](https://www.ssl2buy.com/) and need to be renewed at regular intervals. When a certificate expires SSL2buy will send an email with a link incorporating a unique pin. This can be used to login to the SSL wizard.

Firstly a Certificate Signing Request (CSR) file must be created on the server to paste into the SSL wizard. This requires using the Pulse Secure login and then running a command at login root.

```openssl req –new –newkey rsa:2048 –nodes –keyout eprase.nhs.uk.key –out eprase.nhs.uk.csr```

A eprase.nhs.uk.csr file is generated. Open the generated file and copy the contents into the wizard. The address used to authenticate the Cert is :

+	Company Name : Newcastle University
+	Street Address : 2nd Floor Armstrong Building, Queen Victoria Road, Newcastle Upon Tyne
+	City : Newcastle upon Tyne
+	State / Province : Tyne and Wear
+	Country : United Kingdom
+	Zip Code : NE1 7RU

Once the wizard has been updated with the file contents, you must specify how to authenticate yourself as the domain owner. Choose CNAME hash rather than an email address @eprase.nhs.uk. The wizard will generate a CNAME hash code snippet that you can use to validate yourself as domain owner. The CNAME records are managed by NHS Digital (not SCC who manage the server).

Email: dnsteam@nhs.net

Email them and ask them to add the code snippet to the DNS records for eprase.nhs.uk. The hash has the following format:


xxxxxxxxxxxxxxxxxxx.eprase.nhs.uk
CNAME
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Once this is done, you should be sent a certificate via an email with an attached zip from Sectigo Certification Authority. The .crt file within the zip archive is your cert. You may get emailed an intermediate and full certificate. SSL2buy have an excellent online chat line if you hit difficulties with this process. They will liaise with Sectigo.

Once you have the new full cert from an email labelled 'InstantSSL Pro Certificate', transfer it onto the server using SFTP. You will need to use Pulse Secure with your soft token. From there, rename it from eprase_nhs_uk.crt to eprase.nhs.uk-new.crt. Then move it into the ./client/certs directory. Rename the existing cert file to old before renaming your new file to the correct name ie. `eprase.nhs.uk.crt`.

The certificate path is coded in the docker-compose.yml file.
