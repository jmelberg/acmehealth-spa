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
