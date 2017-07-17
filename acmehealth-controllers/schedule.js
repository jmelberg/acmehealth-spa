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

/** Route: '/' */
app.controller('ScheduleController',
  function ($scope, $window, $location, $timeout, $route, $rootScope, widgetManager, apiClient) {
    $rootScope.layout = 'page-Schedule has-sidebar';

    const tokenManager = widgetManager.getTokenManager();
    if (!tokenManager || !tokenManager.get('accessToken') || !tokenManager.get('idToken')) {
      $rootScope.$apply(() => {
        $location.path('/login');
      });
    }

    /** Get current idToken */
    $scope.idToken = tokenManager.get('idToken');

    /** Get appointments */
    var confirmedAppointments = getConfirmedAppointments(
      tokenManager.get('accessToken'),
      tokenManager.get('idToken')
	);

    /** Filter appointments by date and sorted by time */
    var filterAppointments = (appointmentData, date) => {
      var dailyAppointments = [];
      angular.forEach(appointmentData, item => {
      // Compare MM/DD/YYYY
        if (item.startTime.split('T')[0] === date) {
          dailyAppointments.push(item);
        }
      });
      return dailyAppointments;
    };

    /** Returns Month (September) from Date Object */
    var getMonthFromDate = dateObject => {
      return dateObject.startTime.split('T')[0].split('-')[1];
    };

    /** Returns first appointment */
    var getFirstAppointment = appointmentsJson => {
      for (var month in appointmentsJson) {
        if (appointmentsJson.hasOwnProperty(month)) {
          var date = appointmentsJson[month];
          for (var appt in date) {
            if (date.hasOwnProperty(appt)) {
              return date[appt][0];
            }
          }
        }
      }
    };

    /**
      *	Format all confirmed appointments into JSON following data structure:
      *
      *	Example:
      *  {
      *		 September : {
      *			2016-09-01 : [ appointmentJSON,	appointmentJSON	],
      *			2016-09-15 : [ appointmentJSON, appointmentJSON ]
      *		 },
      *		 October : {
      *			2016-10-05 : [ appointmentJSON, appointmentJSON ]
      *		}
      *	 }
      *
	  */

    function parseConfirmedAppointments(confirmedAppointments) {
      var appointmentsByDate = {};
      angular.forEach(confirmedAppointments, item => {
        var months = [
          'January', 'February', 'March',
          'April', 'May', 'June', 'July', 'August',
          'September', 'October', 'November', 'December'
        ];
        var month = getMonthFromDate(item); // Returns Month as text 'September'

        if (!appointmentsByDate[months[month - 1]]) {
          appointmentsByDate[months[month - 1]] = {};
        }
        if (!appointmentsByDate[months[month - 1]][item.startTime.split('T')[0]]) {
          appointmentsByDate[months[month - 1]][item.startTime.split('T')[0]] = [];
        }
        appointmentsByDate[months[month - 1]][item.startTime.split('T')[0]].push(item);
      });
      var firstAppt = getFirstAppointment(appointmentsByDate);
      var setInitialApptView = filterAppointments(confirmedAppointments, firstAppt.startTime.split('T')[0]);
      $scope.appointments = setInitialApptView;
      $scope.sorted = appointmentsByDate;
    }

    /** Get appointments */
    function getConfirmedAppointments(accessToken, idToken) {
      apiClient.getAppointments(accessToken.accessToken, idToken.claims.sub)
      .then(appointments => {
        var appointmentJSON = JSON.parse(appointments).data;
        var confirmedAppointmentsList = [];
        angular.forEach(appointmentJSON, item => {
          if (item.status === 'CONFIRMED') {
            confirmedAppointmentsList.push(item);
          }
        });

        if (confirmedAppointmentsList.length > 0) {
          // Store confirmed appointments
          parseConfirmedAppointments(confirmedAppointmentsList);
          $window.localStorage['appointments'] = angular.toJson(confirmedAppointmentsList);
          return angular.toJson(confirmedAppointmentsList);
        }
      }, err => {
        console.error(err);
        return;
      });
    }

    /**	Clears the localStorage saved in the web browser and scope variables */
    function clearStorage() {
      $window.localStorage.clear();
      widgetManager.getWidget().tokenManager.clear();
      $scope = $scope.$new(true);
    }

	/** Updates appointment list when date is selected */
    $scope.updateAppointmentList = (date) => {
      var appointments = !angular.isUndefined($window.localStorage['appointments']) ? JSON.parse($window.localStorage['appointments']) : undefined;
      $scope.appointments = filterAppointments(appointments, date);
    };

    /**	Signout method called via button selection */
    $scope.signout = () => {
      widgetManager.getTokenManager().clear();
      clearStorage();
      $location.url('/login');
    };
  });
