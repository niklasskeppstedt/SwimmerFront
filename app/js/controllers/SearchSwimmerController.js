'use strict';

swimmersApp.controller('SearchSwimmerController', function SearchSwimmerController($scope, $http) {
  $scope.searchResult = [];
  $scope.noHitsReturned = false; 
  $scope.searchSwimmer = function(swimmer, newSwimmerForm) {
    if(newSwimmerForm.$valid) {
      var config = {
            };
      $http.post('http://localhost:7000/swimmers/search', JSON.stringify(swimmer), config)
      .success(function (data, status, headers, config) {
        $scope.noHitsReturned = data.length == 0;
        $scope.searchResult = data;
      })
      .error(function (data, status, header, config) {
        alert("Got error " + JSON.stringify(data) + status);
      });
    } else {
      alert("Search phrases not valid");
    }
  };

  
  $scope.cancelSwimmer = function() {
    window.location = '/Swimmers.html';
  }
});