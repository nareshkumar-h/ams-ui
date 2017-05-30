webApp
		.controller(
				'LoginController',
				[
						'$scope',
						'$http',
						'$rootScope',
						'$location',
						'$window',
						function($scope, $http, $rootScope, $location,$window) {
							$scope.urlBase = 'http://localhost:8080';

							$scope.submit = function() {
								$scope.submitted = true;
								console.log($scope.submitted);
							}

							$scope.login = function(userName) {
								$scope.submitted = true;
								$http
										.get(
												$scope.urlBase
														+ "/login/logbyname/?userName="
														+ userName)
										.then(
												function(response) {

													$scope.loginlist = response.data;
													angular
															.forEach(
																	$scope.loginlist,
																	function(
																			response) {
																		$scope.correctPassword = response.password;
																		$scope.name = response.name;
																		$scope.roleName = response.role.roleName;

																		$scope.userId = response.userId;
																		localStorage
																				.setItem(
																						"userId",
																						$scope.userId);

																		localStorage
																				.setItem(
																						"userName",
																						userName);
																		localStorage
																				.setItem(
																						"name",
																						$scope.name);
																		localStorage
																				.setItem(
																						"role",
																						$scope.roleName);
																	})

													if ($scope.loginlist.length == 0
															|| $scope.password !== $scope.correctPassword) {
														$scope.error = true;
														$scope.loggedIn = false;

													} else {
														$scope.loggedIn = true;
														$window.location.reload();
														$scope.roleName = localStorage
																.getItem('role');
														if ($scope.roleName == 'student') {
															$location
																	.path('/myAttendanceReport');
														} else {
															
															$location
																	.path('/home');
														}
														localStorage
																.setItem(
																		"loggedIn",
																		$scope.loggedIn);
													}

												})
							}

						} ]);