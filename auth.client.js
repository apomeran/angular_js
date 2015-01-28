var myApp = angular.module('myApp', []);

myApp.controller('UserCtrl', function ($scope, $http, $window) {
  $scope.appToken = {applicationToken: 'e4d909c290d0fb1ca068ffaddf22cbd0'};
  $scope.isAuthenticated = false;
  $scope.message = '';
  //$http.defaults.headers.common.Authorization = '24cacd2b74fd8557af7adfeee243ea8ee4c2487f'; //ANOTHER WAY TO SEND AUTH HEADER

  $scope.submit = function () {
	 if ($window.sessionStorage.token) {
		$scope.sessionStorageMessage = 'Token already saved is ' + $window.sessionStorage.token;
	}
    $http
      .post('http://h139-233.rackhostvps.com/auth', $scope.appToken) // PHP Api Endpoint
      .success(function (data, status, headers, config) {
		status = parseInt(status);
		
		
		if (status == 200){
			$scope.message = 'Success - New client Token : ' + data.clientToken + ' was saved';
		}
        $window.sessionStorage.token = data.clientToken; //SAVE IT TO LOCAL STORAGE
		
        $scope.isAuthenticated = true;
      })
      .error(function (data, status, headers, config) {
        // Erase token when the user fails to log in
        delete $window.sessionStorage.token;
        $scope.isAuthenticated = false;
        // I Handle errors here
        $scope.error = status + " - " + data;
      });
  };

  $scope.logout = function () {
    $scope.message = '';
    $scope.isAuthenticated = false;
    delete $window.sessionStorage.token;
  };

});

myApp.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
       config.headers = config.headers || {};
      //  config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      config.headers.Authorization = '24cacd2b74fd8557af7adfeee243ea8ee4c2487f'; // <-- SHA1 for AppToken
	  // Send Auth Headers on every Request with Interceptor
      return config;
    },
    responseError: function (rejection) {
	  alert(rejection.status + " - " + rejection.data);	
      return $q.reject(rejection);
    }
  };
});

myApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor'); //Register Interceptor
});

/*
**
** TESTS - JASMINE BDD
**
*/

describe('UserCtrl', function() {
  beforeEach(module('myApp'));

  var $controller;

  beforeEach(inject(function(_$controller_, _$window_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
	$window = _$window_;
  }));

  describe('BDD Test', function() {
    // it('SessionStorage Token with previous value saved', function() {
      // var $scope = {};
      // var controller = $controller('UserCtrl', { $scope: $scope });
      // // $scope.appToken = 'e4d909c290d0fb1ca068ffaddf22cbd0';
      // $scope.submit();
	  // if($scope.appToken.applicationToken){
		// expect($scope.appToken.applicationToken).toBe('e4d909c290d0fb1ca068ffaddf22cbd0');
	  // }else{
		// expect(true).toBe(true);
	  // }
    // });
  });
});