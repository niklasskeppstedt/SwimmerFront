// script.js

// create the module and name it scotchApp
    // also include ngRoute for all our routing needs
var scotchApp = angular.module('scotchApp', ['ngRoute','ngCookies'])

/*
scotchApp.run(
    angular.element($window).on('onbeforeunload', function (event) {
        // do whatever you want in here before the page unloads.        

        // the following line of code will prevent reload or navigating away.
        alert("Aha trying to navigate away");
        event.preventDefault();
    })
);*/
/*
scotchApp.run(function($window) {
    angular.element($window).on('beforeunload', event.preventDefault());
});*/

// configure our routes
scotchApp.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'pages/swimmerlist.html',
            controller  : 'swimmersController'
        })

        // route for the swimmers page, same as home
        .when('/swimmers', {
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

        // route for the signup page
        .when('/signup', {
            templateUrl : 'pages/signup.html',
            controller  : 'signupController'
        })

        // route for the search page
        .when('/search', {
            templateUrl : 'pages/search.html',
            controller  : 'searchController'
        });

});

// create the controller and inject Angular's $scope
scotchApp.controller('swimmersController', function($scope, $http, $location, userService) {
    if(userService.user.header == null) {
        $location.path("/login").search({page: ""}); 
        return;
    }
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

scotchApp.controller('signupController', function($scope, $location) {
    $scope.message = 'This is the signup page...';

});

scotchApp.controller('loginController', function($scope, $location, userService) {
    $scope.errorMessage = '';
    $scope.login = function() {
        user = userService.login($scope.username, $scope.password, this);
    }

    $scope.loginSuccess = function() {
        page = $location.search().page;
        possibleId = $location.search().id;
        //reset search params
        $location.search({})
        $location.path("/" + page).search({"id": possibleId});     
    }
    $scope.loginFailed = function(errorMessage) {
        if($scope.errorMessage.length > 0) {
            $scope.errorMessage = "";     
        }
        $scope.errorMessage = errorMessage;     
    }
    $scope.signup = function() {
        $location.path("/signup");     
    }

});

scotchApp.controller('contactController', function($scope) {
    $scope.message = 'niklas.skeppstedt@gmail.com';
});

scotchApp.controller('swimmerController', function($scope, $http, $location, userService) {
    if(userService.user.header == null) {
        $location.path("/login").search({page: "swimmer", id: $location.search().id}); 
        return;
    }
    $http.get('http://localhost:7000/swimmers/' + $location.search().id, {headers: {'Authorization': 'Basic ' + userService.user.header}})
        .success(function (data) {
            $scope.swimmer = data;
        })
        .error(function (data, status) {
          alert("Error in swimmersController " + JSON.stringify(data) + ":::" + JSON.stringify(status));
          if(response.status == 0) {
            $scope.errorText = "No response from server. Could not fetch swimmer";
          }
          else
            $scope.errorText = "Unknown server error: " + response.config.url + " " + response.data.message;
        });
});

scotchApp.controller('searchController', function ($scope, $http, $location, userService) {
    if(userService.user.header == null) {
        $location.path("/login").search({page: "search"});;
        return;
    }

    $scope.searchResult = [];
    $scope.noHitsReturned = false;
    $scope.searchSwimmer = function(swimmer, newSwimmerForm) {
        if(newSwimmerForm.$valid) {
            $http.post('http://localhost:7000/swimmers/search', JSON.stringify(swimmer), {headers: {'Authorization': 'Basic ' + userService.user.header}})
                .success(function (data) {
                    $scope.noHitsReturned = data.length == 0;
                    $scope.searchResult = data;
                })
                .error(function (data, status) {
                    alert("Something is wrong: " + JSON.stringify(data) + " " + JSON.stringify(status));;
                });
        } else {
            alert("Search phrases not valid");
        }
    };

    $scope.save = function(swimmer) {
        outSwimmer = {
            id: swimmer.id,
            firstName: swimmer.firstName,
            lastName: swimmer.lastName,
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
        location;
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
        $http.post('http://localhost:7000/users/login', JSON.stringify(userIn)).success(function(data) {
            if(data.name == null) {
                ctrl.loginFailed("Could not login using given credentials");
                return;
            }
            that.user.username = userIn.username;
            that.user.header = btoa(userIn.username + ':' + userIn.password);
            ctrl.errorMessage = '';
            that.storeToSession();
            ctrl.loginSuccess();
//            return that.user;
        }).error(function(arg) {
            ctrl.errorMessage('Something went very bad, logging in anyway ');
        });
//        return null;
    }

    this.logout = function() {
        this.user = {};
        this.storeToSession();
    }

    this.loadFromSession();
}])
