// js/controllers/main.js
	
angular.module('todoController', [])

        .controller('mainController', function($scope, $http, Auth, Todos) {
                $scope.formData = {};

                // when landing on the page, get all todos and show them

                if (Auth.verifyUser()) {
                        var token = $http.defaults.headers.common["Authorization"];
                        console.log(token);
                        Todos.get('/api/todos')
                                .success(function(data) {
                                        $scope.todos = data;
                                })
                                .error(function(data) {
                                        console.log('Error: ' + data);
                                });        
                };
                

                // when submitting the add form, send the text to the node API
                $scope.createTodo = function() {
                        if (!$.isEmptyObject($scope.formData)) {
                                Todos.create($scope.formData)
                                        .success(function(data) {
                                                $scope.formData = {}; // clear the form so our user is ready to enter another
                                                $scope.todos = data;
                                        })
                                        .error(function(data) {
                                                console.log('Error: ' + data);
                                        });
                        }
                };

                // delete a todo after checking it
                $scope.deleteTodo = function(id) {
                        Todos.delete(id)
                                .success(function(data) {
                                        $scope.todos = data;
                                })
                                .error(function(data) {
                                        console.log('Error: ' + data);
                                });
                };

        });