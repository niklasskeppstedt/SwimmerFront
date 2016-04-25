// script.js

    // create the module and name it scotchApp
        // also include ngRoute for all our routing needs
    var scotchApp = angular.module('scotchApp', ['ngRoute']);

    // configure our routes
    scotchApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'pages/swimmerlist.html',
                controller  : 'swimmersController'
            })

            // route for the about page
            .when('/swimmer', {
                templateUrl : 'pages/swimmer.html',
                controller  : 'swimmerController'
            })

            // route for the about page
            .when('/about', {
                templateUrl : 'pages/about.html',
                controller  : 'aboutController'
            })

            // route for the contact page
            .when('/contact', {
                templateUrl : 'pages/contact.html',
                controller  : 'contactController'
            });

    });

    // create the controller and inject Angular's $scope
    scotchApp.controller('swimmersController', function($scope, $http, $location) {
		$http({
	  		method: 'GET',
	  		url: 'http://localhost:7000/swimmers'
		}).then(function successCallback(response) {
	    	$scope.swimmers = response.data;
        	$scope.message = 'REST call was successful and returned ' + $scope.swimmers.length + " swimmers";
	  	}, function errorCallback(response) {
	  		if(response.status == 0) {
	        	$scope.message = 'No response from server';
	  			$scope.errorText = "No response from server. Could not fetch swimmers";
	    	}
	    	else {
	        	$scope.message = "Unknown server error: " + response.config.url + " " + response.data.message;
	  			$scope.errorText = "Unknown server error: " + response.config.url + " " + response.data.message;
	  		}
	  	});

	  	$scope.showSwimmerDetails = function(swimmer) {
        	$location.path("/swimmer").search({id: swimmer.id});        	
    	}



    });

    scotchApp.controller('aboutController', function($scope, $location) {
        $scope.message = 'This application is developed by Niklas Skeppstedt to get a handle on DropWizard and AngularJs';

    });

    scotchApp.controller('contactController', function($scope) {
        $scope.message = 'niklas.skeppstedt@gmail.com';
    });

    scotchApp.controller('swimmerController', function($scope, $http, $location) {
        // Start REST call
	    $http(
	    {
	      method: 'GET',
	      url: 'http://localhost:7000/swimmers/' + $location.search().id + '/personalbests'
	    }).then(function successCallback(response) {
	      //Hardcoded personal bests for now
	      /**response.data.personalBests = [
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
	       ];*/
	       alert(JSON.stringify(response.data));
	      $scope.swimmer = response.data;
	    }, function errorCallback(response) {
	      if(response.status == 0) {
	        $scope.errorText = "No response from server. Could not fetch swimmer";
	      }
	      else 
	        $scope.errorText = "Unknown server error: " + response.config.url + " " + response.data.message;
	    });
        //End REST call












    });
