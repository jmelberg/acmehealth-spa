/** Author: Jordan Melberg */
/** Copyright © 2016, Okta, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *	Authenticates the user with custom login UI using AuthSDK
 *
 * 	Stores the response object in localStorage and sets the current session to true
 */

app.controller('LoginController',
  function ($scope, $location, $rootScope, widgetManager) {
    $rootScope.layout = 'page-Login';

    /**
      * Sometimes you will have to refresh this page due to compatibility
      * issues with the widget and AngularJS.
    */
    widgetManager.getWidgetByPromise()
    .then(widget => {
      widget.show();
      try {
        widget.renderEl({ el: '#widget-container' }, response => {
          response.forEach(token => {
            if (token.idToken) {
              widget.tokenManager.add('idToken', token);
            }
            if (token.accessToken) {
              widget.tokenManager.add('accessToken', token);
            }
          });
          $rootScope.$apply(() => {
            widget.hide();
            $location.path('/');
          });
        });
      } catch (error) {
        $location.path('/login');
      }
    }, () => {
      $rootScope.$apply(() => {
        $location.path('/login');
      });
    });
  });
