# SSL certificate renewal for eprase.nhs.uk

## Buying or renewing 

SSL certificates are bought through [https://www.ssl2buy.com/](https://www.ssl2buy.com/) and need to be renewed at regular intervals. Ask Mark Turner or Becky Osselton for the login credentials. This can get complex, be prepared!

### Create a certificate signing request

Firstly a Certificate Signing Request (CSR) file must be created on the server to paste into the ssl2buy SSL wizard. You will need to have secure access set up with hosting company SCC and be able to log into the production server with the ssh command. Login with your Pulse Secure credentials and then run a command at root. You must be the root user.arms The command below is best hand-typed into the terminal to avoid copy & paste character issues.

```openssl req –new –newkey rsa:2048 –nodes –keyout eprase.nhs.uk.key –out eprase.nhs.uk.csr```

A new private key `eprase.nhs.uk.key` will be generated. Use `ls -al` to see all the directory contents and file details. You will need to fill in some additional details in the terminal to finish the signing process (shown below).

![certificate signing request details](/readme-images/cert-info.png)

### Complete the ssl2buy process

A eprase.nhs.uk.csr file is generated. Open the generated file using `cat` and copy the contents into the ssl2buy wizard. Once this is in the wizard you will be able to progress. Any errors in the generation of the certificate are shown in the wizard. if this happens, you will need to try generating the CSR again on the server.

Once the wizard has been updated with the file contents, you must specify how to authenticate yourself as the domain owner. Choose the DNS option (CNAME hash) rather than an email address @eprase.nhs.uk. The wizard will generate a CNAME hash code snippet that you can use to validate yourself as domain owner. The CNAME records are managed by NHS Digital (not SCC who manage the server).

Email: dnsteam@nhs.net

Email the DNS team and ask them to add the code snippet to the DNS records for eprase.nhs.uk. You should get an email from england.dnsteam@nhs.net confirming that they have updated the DNS record. They usually have a fairly quick response time. 

![CNAME details](/readme-images/cname-details.png)

At some point you will receive an email from Sectigo.com labelled 'Sectigo Certificate Subscriber Agreement 'with a link and verification code. Log into this and try and authenticate the certificate. You'll need to keep logging in using the code to check the status of the order.

<img width="927" height="1075" alt="Sectigo order verification" src="https://github.com/user-attachments/assets/cad6bc79-66c7-4f58-91bf-10b5fb354ed9" />

The address used to authenticate the Cert is :

+	Company Name : Newcastle University
+	Street Address : King's Gate
+	City : Newcastle upon Tyne
+	State / Province : Tyne and Wear
+	Country: United Kingdom
+	Postcode: NE1 7RU

They will want a personal email address and phone number for their records.

The last stage of the wizard features multiple verification processes. 

![Sectigo verification](/readme-images/Sectigo-order-verification.png)
![Sectigo verification](/readme-images/Sectigo-wizard.png)

Sectigo may vary how they authenticate these details and you may be asked to upload documents that show the University address. Previously, a charitable status letter and Annual Report have been uploaded to Sectigo's website. They may also want a main phone number (not a personal mobile), so use the main Uni switchboard and an extension that you can access when they call. In 2025, phone verification was done through the RSE office phone extension (84366). This cam all take time, so factor this in when renewing the certficates. Once verificatiuon is complete, you should be sent your full certificate.

The Domain Control Validation should show all green at this point.


### Getting and replacing the new certificate

Once all this is done, you should be sent a certificate via an email with an attached zip from Sectigo Certification Authority.

IMPORTANT - you will get a temporary cert first from SSL (Comodo), the full certificate will be sent inside an email as shown below. Unzip into a suitable folder - it contains multiple files. The .crt file within the zip archive is your cert.  SSL2buy have an excellent online chat line if you hit difficulties with this process. They will liaise with Sectigo.

![Sectigo email](/readme-images/Full-cert.png)

Once you have the new full cert from an email labelled 'InstantSSL Pro Certificate', transfer it onto the server using SFTP. You will need to use Pulse Secure with your soft token. Navigate to the directory where your .crt file is located and connect to the server using sftp.

`sftp xxxx@<ipaddress>`

Then once in the sftp shell transfer the .crt file with :

`put eprase_nhs_uk.crt`


Logout sftp, login as root user. From the home directory, rename it from eprase_nhs_uk.crt to eprase.nhs.uk-new.crt.

`mv eprase_nhs_uk.crt erase.nhs.uk-new.crt`

Then copy it into the nginx/ssl directory.

`cp eprase.nhs.uk-new.crt nginx/ssl`


 Rename the existing cert file to old before renaming your new file to the correct name ie. `eprase.nhs.uk.crt`.

`mv eprase.nhs.uk.crt eprase.nhs.uk-old.crt`

The certificate path is coded in the docker-compose.yml file.

 #### Docker- Verify repository client with certificates

https://docs.docker.com/engine/security/certificates/
