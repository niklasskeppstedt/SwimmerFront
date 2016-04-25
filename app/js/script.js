// script.js

// create the module and name it scotchApp
    // also include ngRoute for all our routing needs
var scotchApp = angular.module('scotchApp', ['ngRoute','ngCookies']);

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
        })

        // route for the contact page
        .when('/login', {
            templateUrl : 'pages/login.html',
            controller  : 'loginController'
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

/**function loginController($scope, userService) {
    alert("Before login");
    $scope.hellos = [
        $scope.fromService = userService.login($scope.username, $scope.password, this)
    ];
    alert("After login");
}**/


scotchApp.controller('loginController', function($scope, userService) {
    $scope.errorMessage = 'This is an errormessage text';
    $scope.login = function($scope)
    {
        userService.login(username, password, this);
    }

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

/**
*
*/
scotchApp.service('userService', ['$cookieStore','$http', function($cookieStore,$http) {
    alert("Creating userService");
    this.user = {};

    this.storeToSession = function() {
        $cookieStore.put('userHeader', this.user.header);
    };

    this.loadFromSession = function() {
        var userHeader = $cookieStore.get('userHeader');
        if ( userHeader ) {
            this.loadCurrentUser(userHeader);
        }
    };

    this.loadCurrentUser = function(loadCurrentUser) {
        /* $http get to load user info with given header */
    };

    this.login = function(email,password,ctrl) {
        alert("In login service");
        var userIn = {
            username : username,
            password : password
        }
        var that = this;
        $http.post('http://localhost:7000/users/login', userIn).success(function(data) {
            if (data.success === true) {
                that.user.username = userIn.username;
                that.user.header = btoa(userIn.username + ':' + userIn.password);
                ctrl.errorMessage = '';
                that.storeToSession();
            } else {
                ctrl.errorMessage = 'Something went bad';
            }
        }).error(function(arg) {
            ctrl.errorMessage = 'Something went very bad';
        });
    }

    this.logout = function() {
        this.user = {};
        this.storeToSession();
    }

    this.loadFromSession();
}])
