// script.js

// create the module and name it scotchApp
// also include ngRoute for all our routing needs
// also include ngCookies for cookie handling
var scotchApp = angular.module('scotchApp', ['ngRoute','ngCookies'])

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
scotchApp.controller('swimmersController', function($scope, $http, $location, userService, httpService) {
    if(!userService.isLoggedIn()) {
        $location.path("/login").search({page: ""}); 
        return;
    }
    httpService.get('http://localhost:7000/swimmers')
        .then(function successCallback(response) {
            $scope.swimmers = response.data;
          }, function errorCallback(response) {
              if(response.status == 0) {
                $scope.errorText = "No response from server. Could not fetch swimmer";
              }
              else
                $scope.errorText = "Unknown server error: " + response.config.url + " " + response.data.message;
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
    $scope.dataLoading = false;
    $scope.errorMessage = '';
    $scope.message = '';
    $scope.login = function() {
        $scope.dataLoading = true;
        user = userService.login($scope.username, $scope.password, this);
        $scope.dataLoading = false;
    }

    $scope.loginSuccess = function() {
        $scope.errorMessage = '';
        $scope.message = '';
        page = $location.search().page;
        possibleId = $location.search().id;
        //reset search params
        $location.search({})
        $location.path("/" + page).search({"id": possibleId});     
    }
    $scope.loginFailed = function(message) {
        if($scope.message.length > 0) {
            $scope.message = "";     
        }
        $scope.message = message;     
    }
    $scope.loginError = function(errorMessage) {
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

scotchApp.controller('swimmerController', function($scope, $http, $location, userService, httpService) {
    if(!userService.isLoggedIn()) {
        $location.path("/login").search({page: "swimmer", id: $location.search().id}); 
        return;
    }
    httpService.get('http://localhost:7000/swimmers/' + $location.search().id)
        .then(function successCallback(response) {
            $scope.swimmer = response.data;
        }, function errorCallback(response) {
          if(response.status == 0) {
            $scope.errorText = "No response from server. Could not fetch swimmer";
          }
          else
            $scope.errorText = "Unknown server error: " + response.config.url + " " + response.data.message;
        });
});

scotchApp.controller('searchController', function ($scope, $http, $location, userService, httpService) {
    if(!userService.isLoggedIn()) {
        $location.path("/login").search({page: "search"});;
        return;
    }

    $scope.searchResult = [];
    $scope.errorMessage = "";
    $scope.noHitsReturned = false;
    $scope.searchSwimmer = function(swimmer, newSwimmerForm) {
        $scope.errorMessage = "";
        $scope.noHitsReturned = false;
        if(newSwimmerForm.$valid) {
            httpService.post('http://localhost:7000/swimmers/search', swimmer)
            .then(function successCallback(response) {
                $scope.noHitsReturned = response.data.length == 0;
                $scope.swimmer = response.data;
            }, function errorCallback(response) {
                alert("Failed search: " + JSON.stringify(response));
                if(response.status == 0) {
                    $scope.errorMessage = "Could not contact server at " + response.config.url;
                }
                else
                    $scope.errorMessage = "Server responded with error: " + response.config.url + " " + response.data.message;
            });            



            /*
            $http.post('http://localhost:7000/swimmers/search', JSON.stringify(swimmer), {headers: {'Authorization': 'Basic ' + userService.user.header}})
                .success(function (data) {
                    $scope.noHitsReturned = data.length == 0;
                    $scope.searchResult = data;
                })
                .error(function (data, status) {
                    alert("Something is wrong: " + JSON.stringify(data) + " " + JSON.stringify(status));;
                });*/
        } else {
            $scope.errorMessage = "Search phrases not valid";
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
scotchApp.service('userService', ['$cookieStore','$http', '$timeout', function($cookieStore, $http, $timeout) {
    this.user = {};

    this.isLoggedIn = function() {
        return this.user.header
    };

    this.storeToSession = function() {
        if( this.isLoggedIn() ) {
            $cookieStore.put('newUserHeader', this.user.header);
        } else {
            $cookieStore.remove('newUserHeader');
        }
    };

    this.loadFromSession = function() {
        var userHeader = $cookieStore.get("newUserHeader");
        if ( userHeader ) {
            this.loadCurrentUser(userHeader);
        }
    };

    this.startTimer = function() {
        var that = this;
        $timeout(function() {
            alert("User will be logged out due to inactivity");
            that.logout()
        }, 500000);
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
            that.startTimer();
        }).error(function(arg) {
            ctrl.loginError('Could not contact server to login...');
        });
//        return null;
    }

    this.logout = function() {
        this.user = {};
        this.storeToSession();
    }

    this.loadFromSession();
}])

/**
 *Http service handling all http calls and authenication
 */
scotchApp.service('service2',['service1', function(service1) {}]);
scotchApp.service('httpService', ['$cookieStore','$http', 'userService', function($cookieStore, $http, userService) {
    this.post = function(url, data) {
        alert("Posting to url: " + url + " with data: " + JSON.stringify(data));
        return $http({
            method: 'POST',
            url: url,
            data: JSON.stringify(data),
            headers: {
               'Authorization': 'Basic ' + userService.user.header
            }
        })
    };

    this.get = function(url) {
        return $http({
            method: 'GET',
            url: url,
            headers: {
               'Authorization': 'Basic ' + userService.user.header
            }
        })
    };

    this.delete = function(url) {
        alert("httpService.delete executed");
        return;
    };
}])
