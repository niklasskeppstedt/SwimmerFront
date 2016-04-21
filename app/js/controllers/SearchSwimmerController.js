'use strict';

swimmersApp.controller('SearchSwimmerController', function SearchSwimmerController($scope) {
  $scope.searchSwimmer = function(swimmer, newSwimmerForm) {
    if(newSwimmerForm.$valid) {
      if(swimmer.name.startsWith("Elias") ) {
        $scope.searchResult = [
          {
            id: '1234',
            name: 'Elias Mord',
            yearOfBirth: '2003',
            club: 'SSK'
          },
          {
            id: '98988',
            name: 'Elias Skeppstedt',
            yearOfBirth: '2003',
            club: 'TSS'
          }
        ]
      } else {
        $scope.searchResult = [
        ]
        $scope.alertMessage = "No swimmer found for {{swimmer.name}}";
      }
      //window.location = '/SwimmerDetails.html';
    }
  };
  
  $scope.cancelSwimmer = function() {
    window.location = '/SwimmerDetails.html';
  }
});