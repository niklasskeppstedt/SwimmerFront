'use strict';
swimmersApp.controller('SwimmersController',
  function SwimmersController($scope, $http) {
  	$scope.showSwimmerDetails = function(swimmer) {
        window.location = '/SwimmerDetails.html?id=' + swimmer.id;
    }


	$http({
	  method: 'GET',
	  url: 'http://localhost:7000/swimmers'
	}).then(function successCallback(response) {
	    $scope.swimmers = response.data;
	  }, function errorCallback(response) {
	  	if(response.status == 0) {
	  		$scope.errorText = "No response from server. Could not fetch swimmers";
	    }
	    else 
	  		$scope.errorText = "Unknown server error: " + response.config.url + " " + response.data.message;
	  });
  });
