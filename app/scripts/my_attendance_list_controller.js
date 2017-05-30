webApp
		.controller(
				'myAttendanceReportController',
				[
						'$scope',
						'$http',
						'$rootScope',
						'$location',
						'$timeout',
						'$route',
						function($scope, $http, $rootScope, $location,
								$timeout, $route) {
							$scope.urlBase = 'http://localhost:8080';
							$scope.showReport = false;

							localStorage.getItem('userName');
							$scope.roleName = localStorage.getItem('role');

							localStorage.getItem('userName');

							$scope.getStudentDetails = (function(email) {
								if ($scope.roleName == 'student') {
									$scope.email = localStorage.getItem('userName');
									console.log($scope.email);
								} else {
									$scope.email = email;
									console.log($scope.email);
								}

								$http.get($scope.urlBase+ '/attendance/student?userName='+ $scope.email)
										.then(function(response) {
													$scope.studentInfo = response.data;
													if ($scope.studentInfo.length == 0) {
														$scope.infoMessage = true;
														$scope.showList = false;
														$timeout(
																function() {
																	$scope.infoMessage = false;
																}, 3000);
													} else {
														angular.forEach($scope.studentInfo,function(response) {
														console.log($scope.studentInfo);
														if (response.reviewStatus === "INREVIEW"
														|| response.reviewStatus === "APPROVED"
														|| response.reviewStatus === "REJECTED") {
														response.disabled = 'true';
														console.log(response.reviewStatus);

													} else {
													response.disabled = 'false';
													}
													if (response.reviewStatus === "INREVIEW") {
													response.cancelEnable = true;
													} else {
												$scope.cancelEnable = false;
													}
													$scope.batchName = response.batchName;
													$scope.collegeName = response.collegeName;
													$scope.deptName = response.dept;
													$scope.showList = true;
													console.log('hoooooooooooooooooooooooooooo');
                                                    console.log(response);
													})

													}

												});
							});

							if ($scope.roleName == 'student') {
								$scope.getStudentDetails();

								$scope.studentRole = true;
							} else {
								$scope.studentRole = false;
							}

							$scope.update = (function(u) {
							u.modifiedBy = localStorage.getItem("userId");
								
						    $http.put($scope.urlBase + '/attendance/student/update',u).then(
							
						    function(response) {

							$http.get($scope.urlBase+ '/attendance/student?userName='+ $scope.email) .then(
							    function(response) {
								$scope.studentInfo = response.data;
							if ($scope.studentInfo.length == 0) {
											$scope.infoMessage = true;
											$scope.showList = false;
											$timeout(function() {
											$scope.infoMessage = false;
													},
											3000);
												} else {
											angular.forEach($scope.studentInfo,	function(response) {
												
												$scope.batchName = response.batchName;
												$scope.collegeName = response.collegeName;
												$scope.deptName=response.dept;
												$scope.showList = true;
											    $scope.successMessage = true;
											    $timeout(function() {
												$scope.successMessage = false;
														},
														3000);

														})

														}

													});

												});
							    });

							    $scope.updateAll = (function() {
								console.log(JSON.stringify($scope.studentInfo));

								var modifiedBy = localStorage.getItem("userId");
								angular.forEach($scope.studentInfo, function(response) {
									response.modifiedBy = modifiedBy;
								});

								$http.put($scope.urlBase+ '/attendance/updateAll',	$scope.studentInfo).then(
												function(response) {
													
													$http.get($scope.urlBase + '/attendance/student?userName='
																			+ $scope.email).then(
															
													function(response) {
																			
													$scope.studentInfo = response.data;

													if ($scope.studentInfo.length == 0) {
													$scope.infoMessage = true;
													$scope.showList = false;
													$timeout(	function() {
													$scope.infoMessage = false;
													},3000);
													} else {
												  angular.forEach($scope.studentInfo, function(response) {

													$scope.batchName = response.batchName;
													$scope.collegeName = response.collegeName;
													$scope.deptName=response.dept;
												    $scope.showList = true;

												   $scope.successMessage = true;
												    $timeout(
													function() {
										           $scope.successMessage = false;
															},	3000);	})
																	
																}

															});

												});
							      });

							      $scope.disabled = false;
							      $scope.button = "Request";
							      $scope.request = (function(u) {
								  console.log(u.attended);
								  if (u.attended == true) {
								  u.requestByStudent = true;
								  } else {
								u.requestByStudent = false;
								}
								u.modifiedBy = localStorage.getItem("userId");
								$scope.button = "Request Sent";

								
								$http.get($scope.urlBase + '/seedStatus/list').then(

										function(response) {
										$scope.seedStatusList = response.data;
										angular.forEach($scope.seedStatusList,
										function(response) {
										if (response.status === "INREVIEW") {
								        u.seedStatusId = response.id;
										$http.put($scope.urlBase + '/attendance/request/byStudent',u).then(
										function(response) {$http.get($scope.urlBase + '/attendance/student?userName='
																				
										+ $scope.email).then(function(response) {
										$scope.studentInfo = response.data;
												if ($scope.studentInfo.length == 0) {
											$scope.infoMessage = true;
											$scope.showList = false;
										    $timeout(function() {
													$scope.infoMessage = false;
													},
													3000);
													} else {

											angular	.forEach(	$scope.studentInfo,
											function(response) {
												console.log(response.requestByStudent);
												console.log(response.reviewStatus);					
																		
												if (response.reviewStatus === "INREVIEW"
												|| response.reviewStatus === "APPROVED"
												|| response.reviewStatus === "REJECTED") {
												$scope.button = "Request Sent";
											    response.disabled = 'true';

												} else {
												$scope.button = "Request";
												response.disabled = 'false';
													}
												if (response.reviewStatus === "INREVIEW") {
														
												response.cancelEnable = true;
													} else {
													$scope.cancelEnable = false;
															}
													$scope.batchName = response.batchName;
													$scope.collegeName = response.collegeName;
													$scope.deptName = response.dept;

													$scope.requestMessage = true;
						                            $scope.showList = true;
						                             $timeout( function() {
									                 $scope.requestMessage = false;
								                     },
								                       3000);

					                                 })
                                                     }

                                                 });

                                                 });
                                           }
															
							            });

							         });

							  });

							  $scope.cancel = (function(u) {
								u.reviewStatus = null;
								u.requestByStudent = false;
								u.reason = null;
								
								$http.put($scope.urlBase+ '/attendance/request/byStudent',u).then(
										function(response) {
												
							    $http.get($scope.urlBase+ '/attendance/student?userName='+ $scope.email).then(
							    		function(response) {
								$scope.studentInfo = response.data;

										if ($scope.studentInfo.length == 0) {
													$scope.infoMessage = true;
													$scope.showList = false;

												$timeout(function() {
														$scope.infoMessage = false;
														},3000);
														} else {
													 angular.forEach(
													 $scope.studentInfo,
													function(response) {
														 console.log(response);										
														 console.log(response.requestByStudent);
														 console.log(response.reviewStatus);
														if (response.reviewStatus === "INREVIEW"
														|| response.reviewStatus === "APPROVED"
														|| response.reviewStatus === "REJECTED") {
														$scope.button = "Request Sent";
														response.disabled = 'true';

														} else {
															$scope.button = "Request";
															response.disabled = 'false';
															}

															if (response.reviewStatus === "INREVIEW") {
															console.log("cancel");
																										
															response.cancelEnable = true;
													       } else {
														 $scope.cancelEnable = false;
															}

															$scope.batchName = response.batchName;
															$scope.collegeName = response.collegeName;
															$scope.deptName = response.dept;
														    $scope.cancelMessage = true;
															$scope.showList = true;
																$timeout(function() {
																$scope.cancelMessage = false;
																	},
																	3000);

																})
																		}

																});

												});
								
							});

						} ]);
