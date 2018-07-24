When you start learning new foreign language, you may need to save your new words for future review.
**Devict** is an application to do this!

This application licensed under MIT license.

#How to use:

You can install this application in your own web server and config mobile application to use your own API server.

#Installation on shared hosts

First clone the source code to your local machine:

```
git clone https://github.com/m6devin/devict.git

cd devict

composer install

cd ionic 

npm install

```

Know, follow this steps:

1. Upload "devict" directory in your shared host
1. Optional: Create a subdomain for example `devict.example.com` that points to public directory of devict folder
1. Create another subdomain for example `app.example.com` that points to ionic directory of devict folder
1. Download latest release version OR compile your own app(If you need to compile your own release, you must  follow https://ionicframework.com/docs/intro/deploying/)
1. Install the application on your smart phone and open it
1. Open left side menu and go to config 
1. Set the API host to ionic sub domain created in step 3 (`app.example.com`)
