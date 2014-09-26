// js/services/todos.js

angular.module('authService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Auth', function($http, $q, $cookies, $location) {
		'use strict';

		return {
			login : function(userData) {
				console.log(userData);
				return $http.post('/login', userData).success(function(result){
					console.log('auth service: ' +result.user);
					$http.defaults.headers.common.Authorization = ['Bearer ', result.user.token].join('');
					$cookies.auth_token = result.user.token;
					console.log('Authentication header and cookie set.');
				});
			},
			verifyUser : function() {
				var token = $cookies.auth_token;
				var deferred = $q.defer();
				if (token) {
					console.log('User is already authenticated.');
					$http.defaults.headers.common.Authorization = ['Bearer ', token].join('');
					return true;
				}
				return false;
			}
		};
	});
