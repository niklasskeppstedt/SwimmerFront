'use strict';

swimmersApp.controller('EditSwimmerController', function EditSwimmerController($scope) {
  $scope.saveSwimmer = function(swimmer, newSwimmerForm) {
    if(newSwimmerForm.$valid) {
      window.alert('swimmer' + swimmer.name + ' saved!');
    }
  };
  
  $scope.cancelSwimmer = function() {
    window.location = '/SwimmerDetails.html';
  }
});