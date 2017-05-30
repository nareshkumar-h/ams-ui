webApp
		.controller(
				'StudentReviewController',
				[
						'$scope',
						'$http',
						'$rootScope',
						'$location',
						'$timeout',
						function($scope, $http, $rootScope, $location, $timeout) {
							$scope.urlBase = 'http://localhost:8080';

							$scope.showList = false;
							$scope.getStudentList = (function() {

						 $http.get($scope.urlBase+ '/attendance/studentReview')
										.then(function(response) {
												
							$scope.studentAllInReviewList = response.data;
							$scope.colleges = _.uniq(_.sortBy(_.pluck($scope.studentAllInReviewList,'collegeName')));
							console.log($scope.colleges);
						 $http.get($scope.urlBase+ '/attendance/InReview/byCollege/'+ $scope.colleges[0])				
										.then(function(response) {		
							$scope.colClick = false;
							$scope.studentInReviewList = response.data;											
							if ($scope.studentInReviewList.length == 0) {
								$scope.infoMessage = true;
								$scope.showList = false;
								$timeout(
										function() {
											$scope.infoMessage = false;
										},
										3000);
							          } else {
								        $scope.showList = true;
							          }

										});					
									});
							 });
						   $scope.getStudentList();
						   $scope.showInReviewListBycollege = function(college) {
						   $scope.colClick = true;
						   $scope.college = college;
                         $http.get($scope.urlBase+ '/attendance/InReview/byCollege/'+ $scope.college)
							.then(function(response) {
								
							$scope.studentInReviewList = response.data;
							if ($scope.studentInReviewList.length == 0) {
									$scope.infoMessage = true;
									$scope.showList = false;
									$timeout(function() {
										$scope.infoMessage = false;
									}, 3000);
							     }
							  else {
								$scope.showList = true;
							       }							
							});

							}
						   
							$scope.acceptst = function(u) {
								console.log(u);
								$rootScope.id = u.id;
								console.log(u.requestByStudent);
								$rootScope.presentByStudent = u.requestByStudent;
							}
							$scope.rejectst = function(u) {
								$rootScope.id = u.id;
								console.log($rootScope.id);
								console.log(u.requestByStudent);
								$rootScope.presentByStudent = u.requestByStudent;
							}
							
							$scope.accept = (function(c) {

								c.id = $rootScope.id;
								c.modifiedBy = localStorage.getItem("userId");
								c.reviewedBy = localStorage.getItem("userId");
								c.reviewStatus = 2;
								if ($rootScope.presentByStudent) {
									c.attended = true;
								} else {
									c.attended = false;
								}

								console.log(c);
								if ($scope.colClick == false) {
									$scope.college = $scope.colleges[0];
								} else {
									$scope.college = $scope.college;

								}

								
								
								$http.put($scope.urlBase+ '/attendance/review/update',c)
										.then(
												function(response) {
												console.log(response.data);
									$http.get($scope.urlBase+ '/attendance/InReview/byCollege/'+ $scope.college)
												.then(function(response) {	
													$scope.studentInReviewList = response.data;
													if ($scope.studentInReviewList.length == 0) {
														$scope.infoMessage = true;
														$scope.showList = false;
														c.reviewComments=null;
														$timeout(
																function() {
																	$scope.infoMessage = false;
																}, 3000);

													} else {
														$scope.showList = true;
														$scope.successMessage = true;	
														c.reviewComments=null;
														$timeout(
																function() {
																	$scope.successMessage = false;
																},
																3000);
													}
													
												});
				
									});		
											
							});

							$scope.reject = (function(c) {

								c.id = $rootScope.id;
								c.modifiedBy = localStorage.getItem("userId");
								c.reviewedBy = localStorage.getItem("userId");
								c.reviewStatus = 3;
								if ($rootScope.presentByStudent) {
									c.attended = false;
								} else {
									c.attended = false;
								}
								console.log(c);

								if ($scope.colClick == false) {
									$scope.college = $scope.colleges[0];
								} else {
									$scope.college = $scope.college;

								}
								
								
								
								$http.put($scope.urlBase+ '/attendance/review/update',c)
										.then(function(response) {
													console.log(response.data);

								$http.get($scope.urlBase+ '/attendance/InReview/byCollege/'+ $scope.college)			
									then(function(response) {			
										$scope.studentInReviewList = response.data;
										if ($scope.studentInReviewList.length == 0) {
											$scope.infoMessage = true;
											$scope.showList = false;
											$timeout(
													function() {
														$scope.infoMessage = false;
													}, 3000);

										} else {
											$scope.showList = true;
											$scope.successMessage = true;
											$timeout(
													function() {
														$scope.successMessage = false;
													},
													3000);
										}
										
										
									});
				
				               });
																		
							});

							$scope.toggle = function() {
								$scope.variable = !$scope.variable
							}
							
							$scope.close = function(c) {
                                c.reviewComments=null;
                            }

						} ]);