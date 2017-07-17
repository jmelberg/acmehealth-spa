angular
.module('OktaAuthClient', [])
.factory('widgetManager', (OKTACONFIG, $q) => {
  var widget = new OktaSignIn({
    baseUrl: OKTACONFIG.baseUrl,
    logo: './images/logo--red.svg',
    language: 'en',
    i18n: {
      en: {
        'primaryauth.title': 'Sign in to AcmeHealth'
      }
    },
    clientId: OKTACONFIG.clientId,
    redirectUri: OKTACONFIG.redirectUri,
    authParams: {
      issuer: OKTACONFIG.issuer,
      scopes: OKTACONFIG.scopes,
      responseType: ['id_token', 'token']
    }
  });

  return {
    getWidget: () => {
      return widget;
    },
    getWidgetByPromise: () => {
      var deferred = $q.defer();
      if (widget) {
        deferred.resolve(widget);
      } else {
        deferred.reject();
      }
      return deferred.promise;
    },
    getTokenManager: () => {
      return widget.tokenManager;
    }
  };
});
