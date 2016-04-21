'use strict';

swimmersApp.controller('EditSwimmerController', function EditSwimmerController($scope) {
  $scope.searchSwimmer = function(swimmer, newSwimmerForm) {
    if(newSwimmerForm.$valid) {
      window.alert('swimmer' + swimmer.name + ' searched!');
      window.location = '/SwimmerDetails.html';
    }
  };
  
  $scope.cancelSwimmer = function() {
    window.location = '/SwimmerDetails.html';
  }
});