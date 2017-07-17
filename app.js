/** Author: Jordan Melberg */
/** Copyright © 2016, Okta, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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

var app = angular.module('app', ['ngRoute', 'OktaAuthClient', 'ApiClient', 'OktaConfig']);
app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/schedule.html',
      controller: 'ScheduleController'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginController',
    })
    .when('/requests', {
      templateUrl: 'views/requests.html',
      controller: 'RequestsController'
    })
  .otherwise({redirectTo: '/'});
});
