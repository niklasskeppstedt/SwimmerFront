'use strict';

swimmersApp.controller('SwimmerDetailsController',
  function SwimmerDetailsController($scope, $http) {
    $scope.swimmerid = "000";
    alert("Get swimmer with id " + $scope.swimmerid + " accessing url " + 'http://localhost:7000/swimmers/' + $scope.swimmerid);
    $http(
    {
      method: 'GET',
      url: 'http://localhost:7000/swimmers/' + $scope.swimmerid
    }).then(function successCallback(response) {
      alert("Got data " + JSON.stringify(response));
      response.data.personalBests = [
        {
          event: {
            distance: '25',
            discipline: 'Freestyle'
          },
           time: '0.16.23',
           date: 20150712,
           competition: 'Varsimiaden',
           official: true
         },
        {
          event: {
            distance: '50',
            discipline: 'Breaststroke'
          },
          time: '0.34.23',
          date: 20160913,
          competition: 'Breaststroke Cup',
          official: false
        },
        {
          event: {
            distance: '100',
            discipline: 'Butterfly'
          },
          time: '01.14.72',
          date: 20160913,
          competition: 'Butterfly Cup',
          official: false
        },
        {
          event: {
            distance: '800',
            discipline: 'Freestyle'
          },
          time: '11.12.23',
          date: 20160121,
          competition: 'Arne Borgs Minne',
          official: true
        }
       ];
      $scope.swimmer = response.data;
    }, function errorCallback(response) {
      if(response.status == 0) {
        $scope.errorText = "No response from server. Could not fetch swimmer";
      }
      else 
        $scope.errorText = "Unknown server error: " + response.config.url + " " + response.data.message;
    });



/**
    $scope.swimmer = {
      id: '1234',
      name: 'Elias Skeppstedt',
      dateOfBirth: '20030504',
      club: 'SSK',
      imageUrl: '/img/angularjs-logo.png',
      personalBests: [
        {
          event: {
            distance: '25',
            discipline: 'Freestyle'
          },
           time: '0.16.23',
           date: 20150712,
           competition: 'Varsimiaden',
           official: true
         },
        {
          event: {
            distance: '50',
            discipline: 'Breaststroke'
          },
          time: '0.34.23',
          date: 20160913,
          competition: 'Breaststroke Cup',
          official: false
        },
        {
          event: {
            distance: '100',
            discipline: 'Butterfly'
          },
          time: '01.14.72',
          date: 20160913,
          competition: 'Butterfly Cup',
          official: false
        },
        {
          event: {
            distance: '800',
            discipline: 'Freestyle'
          },
          time: '11.12.23',
          date: 20160121,
          competition: 'Arne Borgs Minne',
          official: true
        }
       ]
    }; **/
  });