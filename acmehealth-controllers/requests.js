
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

/** Route '/requests' */
app.controller('RequestsController',
  function ($scope, $window, $location, $rootScope, widgetManager, apiClient) {
    $rootScope.layout = 'page-Requests';

    const tokenManager = widgetManager.getTokenManager();
    if (!tokenManager || !tokenManager.get('accessToken') || !tokenManager.get('idToken')) {
      $rootScope.$apply(() => {
        $location.path('/login');
      });
    }

    /** Get current idToken */
    $scope.idToken = tokenManager.get('idToken');

    getRequests();

    function getRequests() {
      /** Refresh idToken to check for 'groups' */

      const tokenManager = widgetManager.getTokenManager();
      tokenManager.refresh('idToken')
      .then(() => {
        return requestedAppointments = getRequestedAppointments(
          tokenManager.get('accessToken'),
          tokenManager.get('idToken')
        );
      });
    }

    function getRequestedAppointments(accessToken, idToken) {
      /** Get all appointments with 'Requested' status */

      apiClient.getAppointments(accessToken.accessToken, idToken.claims.sub)
      .then(appointments => {
        var appointmentJSON = JSON.parse(appointments).data;
        var pendingAppointments = [];

        /** Get all requested appointments */
        angular.forEach(appointmentJSON, item => {
          if (item.status === 'REQUESTED') {
            pendingAppointments.push(item);
          }
        });
        $scope.requests = pendingAppointments;
      }, err => {
        console.error(err);
      });
    }

    /** Cancel Appointment (Provider ONLY) */
    $scope.cancelAppointment = appointment => {
      var cancel = apiClient.cancelAppointment(
        appointment,
        widgetManager.getTokenManager().get('accessToken').accessToken
      );
      cancel.then(() => {
        getRequests();
      }, error => {
        console.error(error);
      });
    };

    /** Delete Appointment (Patient ONLY) */
    $scope.deleteAppointment = appointment => {
      var deleteAppt = apiClient.deleteAppointment(
        appointment,
        widgetManager.getTokenManager().get('accessToken').accessToken
      );
      deleteAppt.then(() => {
        getRequests();
      }, error => {
        console.error(error);
      });
    };

    /** Confirm Appointment (Provider ONLY) */
    $scope.confirmAppointment = appointment => {
      var confirm = apiClient.confirmAppointment(
        appointment,
        widgetManager.getTokenManager().get('accessToken').accessToken
      );
      confirm.then(() => {
        getRequests();
      }, error => {
        console.error(error);
      });
    };

    /**	Clears the localStorage saved in the web browser and scope variables */
    function clearStorage() {
      $window.localStorage.clear();
      widgetManager.getWidget().tokenManager.clear();
      $scope = $scope.$new(true);
    }

    /**	Signout method called via button selection */
    $scope.signout = () => {
      widgetManager.getTokenManager().clear();
      clearStorage();
      $location.url('/login');
    };
  });
