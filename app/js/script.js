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
        })

        // route for the search page
        .when('/search', {
            templateUrl : 'pages/search.html',
            controller  : 'searchController'
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

scotchApp.controller('loginController', function($scope, $location, userService) {
    $scope.errorMessage = 'This is an errormessage text';
    $scope.login = function()
    {
        user = userService.login($scope.username, $scope.password, this);
        alert("login returned " + JSON.stringify(user));
        if(user != null) {
            $location.path("/swimmers");
        }
    }

});

scotchApp.controller('contactController', function($scope) {
    $scope.message = 'niklas.skeppstedt@gmail.com';
});

scotchApp.controller('swimmerController', function($scope, $http, $location) {
    $http(
    {
      method: 'GET',
      url: 'http://localhost:7000/swimmers/' + $location.search().id
    }).then(function successCallback(response) {
      $scope.swimmer = response.data;
    }, function errorCallback(response) {
      if(response.status == 0) {
        $scope.errorText = "No response from server. Could not fetch swimmer";
      }
      else
        $scope.errorText = "Unknown server error: " + response.config.url + " " + response.data.message;
    });
});

scotchApp.controller('searchController', function ($scope, $http, $location) {
    $scope.searchResult = [];
    $scope.noHitsReturned = false;
    $scope.searchSwimmer = function(swimmer, newSwimmerForm) {
        if(newSwimmerForm.$valid) {
            $http.post('http://localhost:7000/swimmers/search', JSON.stringify(swimmer))
                .success(function (data) {
                    $scope.noHitsReturned = data.length == 0;
                    $scope.searchResult = data;
                })
                .error(function (data, status) {
                    alert("Got error " + JSON.stringify(data) + status);
                });
        } else {
            alert("Search phrases not valid");
        }
    };

    $scope.save = function(swimmer) {
        outSwimmer = {
            id: swimmer.id,
            name: swimmer.name,
            club: swimmer.club,
            yearOfBirth: swimmer.yearOfBirth
        }
        $http.post('http://localhost:7000/swimmers', JSON.stringify(outSwimmer))
            .success(function (data) {
                $location.path("/");
            })
            .error(function (data, status) {
                alert("Got error " + JSON.stringify(data) + status);
            });
    };


    $scope.cancelSwimmer = function() {
        window.path("/");
    }
});

/**
 *User service
 */
scotchApp.service('userService', ['$cookieStore','$http', function($cookieStore,$http) {
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
        /* $http get to load user info < with given header */
    };

    this.login = function(email,password,ctrl) {
        var userIn = {
            username : email,
            password : password
        }
        var that = this;
        alert("Logging in with " + JSON.stringify(userIn))
        $http.post('http://localhost:7000/users/login', JSON.stringify(userIn)).success(function(data) {
//            if (data.success == true) {
                that.user.username = userIn.username;
                that.user.header = btoa(userIn.username + ':' + userIn.password);
                ctrl.errorMessage = '';
                that.storeToSession();
                alert("Returning " + JSON.stringify(that.user));
                return that.user;
  //          } else {
    //            ctrl.errorMessage = 'Something went bad: ' + JSON.stringify(data) ;
    //        }
        }).error(function(arg) {
            ctrl.errorMessage = 'Something went very bad, logging in anyway ' + JSON.stringify(arg);
        });
        return null;
    }

    this.logout = function() {
        this.user = {};
        this.storeToSession();
    }

    this.loadFromSession();
}])
