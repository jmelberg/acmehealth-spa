angular
.module('ApiClient', [])
.factory('apiClient', ($q, $http) => {
  // Endpoint for resource server
  var BASE_URL = 'http://localhost:8088';
  var apiClient = {};

  apiClient.getAppointments = (token, filter) => {
    var deferred = $q.defer();
    const api_url = BASE_URL + '/appointments/' + filter;
    $http({
      method: 'GET',
      url: api_url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.data.Error) {
        deferred.reject(res.data.Error);
      } else {
        deferred.resolve(angular.toJson(res));
      }
    }, err => {
      deferred.reject(err);
    });
    return deferred.promise;
  };

  apiClient.confirmAppointment = (appointment, token) => {
    appointment['status'] = 'CONFIRMED';
    var deferred = $q.defer();
    const api_url = BASE_URL + '/appointments/' + appointment['_id'];
    $http({
      method: 'PUT',
      url: api_url,
      data: appointment,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.data.Error) {
        deferred.reject(res.data.Error);
      } else {
        deferred.resolve(angular.toJson(res));
      }
    }, err => {
      deferred.reject(err);
    });
    return deferred.promise;
  };

  apiClient.cancelAppointment = (appointment, token) => {
    appointment['status'] = 'DENIED';
    var deferred = $q.defer();
    const api_url = BASE_URL + '/appointments/' + appointment['_id'];
    $http({
      method: 'PUT',
      url: api_url,
      data: appointment,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.data.Error) {
        deferred.reject(res.data.Error);
      } else {
        deferred.resolve(angular.toJson(res));
      }
    }, err => {
      deferred.reject(err);
    });
    return deferred.promise;
  };

  apiClient.deleteAppointment = (appointment, token) => {
    var deferred = $q.defer();
    const api_url = BASE_URL + '/appointments/' + appointment['_id'];
    $http({
      method: 'DELETE',
      url: api_url,
      data: appointment,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization' : 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.data.Error) {
        deferred.reject(res.data.Error);
      } else {
        deferred.resolve(res);
      }
    }, err => {
      deferred.reject(err);
	});
    return deferred.promise;
  };

  apiClient.populate = data => {
    var deferred = $q.defer();
    const api_url = BASE_URL + '/populate';
    $http({
      method: 'POST',
      url : api_url,
      headers : {'Content-Type' : 'application/json'},
      data: data
    })
    .then(res => {
      if (res.data.Error) {
        deferred.reject(res.data.Error);
      } else {
        deferred.resolve(res);
      }
    }, err => {
      deferred.reject(err);
    });
    return deferred.promise;
  };

  return apiClient;
});
