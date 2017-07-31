# acmehealth-spa

This is an Angular-based Single Page Application designed to work with the [AcmeHealth Server](https://github.com/jmelberg/acmehealth-server) to demonstrate the Okta API Access Management product. An earlier version was demonstrated on stage at Oktane 2016.

## Project Setup In a Nutshell

### Clone Repository
```$ git clone git@github.com:jmelberg/acmehealth-spa.git```
  
### Install the Project
```$ npm install```

### Update the `oktaconfig.js` file

Replace the baseUrl, clientId, and issuer with your own values.

```javascript
angular
.module('OktaConfig', [])
.constant('OKTACONFIG', {
  baseUrl : 'https://jordandemo.oktapreview.com',
  clientId: 'Jw1nyzbsNihSuOETY3R1',
  redirectUri: 'http://localhost:8080',
  issuer: 'https://jordandemo.oktapreview.com/oauth2/aus9wtufc8L041qj50h7',
  scopes: [
    'openid',
    'email',
    'profile',
    'groups',
    // Protected resource scopes
    'appointments:read',
    'appointments:cancel',
    'appointments:edit',
    'appointments:confirm'
  ]
});
```

## Start the Server

```sh
$ npm start
```
## Visit the Application:

The [AcmeHealth Server](https://github.com/jmelberg/acmehealth-server) must be active for this application to function properly.

**[Navigate](http://localhost:8080/)** to [http://localhost:8080/](http://localhost:8080/) to sign in.

