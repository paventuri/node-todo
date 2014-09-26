// js/controllers/main.js


angular.module('authController', [])

        .controller('authController', function($scope, $location, Auth) {
                "use strict";
                
                $scope.formData = {};

                // when submitting the add form, send the text to the node API
                $scope.login = function() {
                        if (!$.isEmptyObject($scope.formData)) {
                                Auth.login($scope.formData)
                                        .success(function(data) {
                                                $scope.formData = {}; // clear the form so our user is ready to enter another
                                                console.log('auth controller: ' +data);
                                        })
                                        .error(function(data) {
                                                console.log('Error: ' + data);
                                        })
                                        .then(function() {
                                                $location.url('/profile');
                                        });
                        }
                };

        });