'use strict';

/**
 * @ngdoc service
 * @name fptdriveApp.Authentication
 * @description
 * # Authentication
 * Factory in the fptdriveApp.
 */
angular.module('fptdriveApp')
    .factory('AuthenticationService', function($rootScope, $cookies) {
        // Service logic
        // ...

        // Public API here
        return {
            CreateCredential: function(username, password, callback) {
                var response;
                if (username === "admin" && password === "123123") {
                    // TODO: Call to backend to get users credential
                    var token = "abcdef";
                    var data = {
                        currentUser: {
                            username: username,
                            token: token
                        }
                    };
                    response = {
                        success: true,
                        data: data
                    };
                    callback(response);
                } else {
                    var error = {
                        "error_code": 400,
                        "message": "Username and password does not match (username: admin, password: 123123)"
                    };
                    response = {
                        success: false,
                        data: error
                    };
                    callback(response);
                }
            },
            SetCredential: function(data) {
                $cookies.put('globals', angular.toJson(data, true));
            },
            RemoveCredential: function() {
                $cookies.remove('globals');
            }
        };
    });
