'use strict';

swimmersApp.controller('SwimmerController', 
  function SwimmerController($scope) {
    $scope.sortorder = 'name';
    $scope.swimmer = {
      id: '1234',
      name: 'Elias Skeppstedt',
      dateOfBirth: '20030504',
      club: 'SSK',
      location: {
        address: 'Google Headquarters',
        city: 'Mountain View',
        province: 'CA'
      },
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
            distance: '800m',
            discipline: 'Freestyle'
          },
          time: '11.12.23',
          date: 20160121,
          competition: 'Arne Borgs Minne',
          official: true
        }
       ]
    };
    
/*    $scope.upVoteSession = function(session) {
      session.upVoteCount++;
    };
    
    $scope.downVoteSession = function(session) {
      session.upVoteCount--;
    }
*/
  });