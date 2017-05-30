webApp
		.controller(
				'HomeController',
				[
						'$scope',
						'$http',
						'$rootScope',
						'$location',
						'$timeout',
						function($scope, $http, $rootScope, $location, $timeout) {
							$scope.urlBase = 'http://localhost:8080';
							$scope.getCollegeList = (function() {
								$http.get($scope.urlBase + '/colleges/list')
										.then(function(response) {
											$scope.collegeList = response.data;
											console.log($scope.collegeList);
										});
							});
							$scope.getCollegeList();
							$scope.batchList = [];
							$scope.$watch('user.college', function(newVal,
									oldVal) {
								$scope.collegeId = newVal.id;
								$http.get(
										$scope.urlBase + '/batches/id/'
												+ newVal.id).then(
										function(response) {
											$scope.batchList = response.data;
											console.log($scope.batchList);
										});
							});
							$scope.deptList = [];
							$scope
									.$watch(
											'user.batch',
											function(newVal, oldVal) {
												$scope.batchName = newVal.batchName;
												localStorage.setItem(
														"batchName",
														$scope.batchName);
												$scope.batchId = newVal.batchId;
												localStorage.setItem("batchId",
														$scope.batchId);
												$http
														.get(
																$scope.urlBase
																		+ '/batches/batch/id/'
																		+ $scope.batchId)
														.then(
																function(
																		response) {
																	$scope.deptList = response.data;
																});
												$http
														.get(
																$scope.urlBase
																		+ '/batches/id/'
																		+ $scope.batchId
																		+ '/trDates')
														.then(
																function(

																response) {
																	$scope.dateList = response.data;
																	$scope.totalDates = $scope.dateList.length;
																	localStorage
																			.setItem(
																					"totalSession",
																					$scope.totalDates);

																});
											});
							$scope.dateList = [];
							$scope.showList = false;
							$scope.getStudentList = (function(user) {
                                
								$('#ece').addClass('active');
								$('#cse').removeClass('active');
								$('#eee').removeClass('active');

								localStorage.setItem("studentDate",
										user.date.trDate);
								$rootScope.trainingDate = user.date.trDate;
								if (user.dept) {
									$scope.dept = user.dept.department;
								}
								
								localStorage.setItem("deptId", $scope.dept);
								$http
										.get(
												$scope.urlBase
														+ '/attendance/Student/batch/'
														+ $scope.batchId
														+ '/trainingDate/'
														+ user.date.trDate)
										.then(
												function(response) {
													$scope.studentAllDeptList = response.data;
													var std = _
															.pluck(
																	$scope.studentAllDeptList,
																	'studentId');
													$scope.deptNames = _
															.uniq(_
																	.sortBy(_
																			.pluck(
																					std,
																					'department')));
													$scope.firstDept=[$scope.deptNames[0]];
													console
															.log($scope.firstDept);
													
													
													

													$http
															.get(
																	$scope.urlBase
																			+ '/attendance/Student/batch/'
																			+ $scope.batchId
																			+ '/trainingDate/'
																			+ $rootScope.trainingDate
																			+ '/dept/'
																			+ $scope.deptNames[0])
															.then(
																	function(
																			response) {

																		$scope.studentList = response.data;
																		$(
																				'#dept')
																				.addClass(
																						'active');

																		if ($scope.studentList.length == 0) {
																			$scope.infoMessage = true;
																			$scope.showList = false;
																			$timeout(
																					function() {
																						$scope.infoMessage = false;
																					},
																					3000);
																		} else {
																			
																			angular
																			.forEach(
																					$scope.studentList,
																					function(
																							response) {
																						console.log('first');
																						console.log(response.freeze);
																						if(response.freeze===true)
																							{
																							console.log('true');
																							$scope.disableUpdateButton=true;
																							$scope.showList = true;
																							$scope.showFreezeButton = true;
																							}
																						else
																							{
																							console.log('false');
																							$scope.disableUpdateButton=false;
																							$scope.showList = true;	
																							$scope.showFreezeButton = true;
																							}
																						
																					})
																		}

																	});

												});
							});

							$scope.update = (function(u) {
								u.modifiedBy = localStorage.getItem("userId");

								$http
										.put(
												$scope.urlBase
														+ '/attendance/update',
												u)
										.then(
												function(response) {

													$http
															.get(
																	$scope.urlBase
																			+ '/attendance/Student/batch/'
																			+ $scope.batchId
																			+ '/trainingDate/'
																			+ $rootScope.trainingDate
																			+ '/dept/'
																			+ u.studentId.department)
															.then(
																	function(
																			response) {
																		$scope.studentList = response.data;
																		
																		if(response.freeze===true)
																		{
																		console.log('true');
																		$scope.disableUpdateButton=true;
																		$scope.showList = true;
																		$scope.showFreezeButton = true;
																		}
																	else
																		{
																		console.log('false');
																		$scope.disableUpdateButton=false;
																		$scope.showList = true;
																		$scope.showFreezeButton = true;
																		}
																	});
													
													$scope.successMessage = true;
													$timeout(
															function() {
																$scope.successMessage = false;
															}, 3000);
												});
							});

							$scope.updateAll = (function() {
								console.log(JSON.stringify($scope.studentList));
								var modifiedBy = localStorage.getItem("userId");
								angular.forEach($scope.studentList, function(
										response) {

									response.modifiedBy = modifiedBy;

								})

								console.log(JSON.stringify($scope.studentList));
								$http
										.put($scope.urlBase + '/attendance',
												$scope.studentList)
										.then(
												function(response) {

													angular
															.forEach(
																	$scope.studentList,
																	function(
																			response) {
																		$http
																				.get(
																						$scope.urlBase
																								+ '/attendance/Student/batch/'
																								+ $scope.batchId
																								+ '/trainingDate/'
																								+ $rootScope.trainingDate
																								+ '/dept/'
																								+ response.studentId.department)
																				.then(
																						function(
																								response) {
																							$scope.studentList = response.data;
																							if(response.freeze===true)
																							{
																							console.log('true');
																							$scope.disableUpdateButton=true;
																							$scope.showList = true;
																							}
																						else
																							{
																							console.log('false');
																							$scope.disableUpdateButton=false;
																							$scope.showList = true;
																							}

																						});
																	})
													$scope.successMessage = true;
													$timeout(
															function() {
																$scope.successMessage = false;
															}, 3000);
												});
							});

							$scope.toggle = function() {
								$scope.variable = !$scope.variable
							}
							
							$scope.showDept = function(dept) {
								$scope.dept = dept;
								
								$http
										.get(
												$scope.urlBase
														+ '/attendance/Student/batch/'
														+ $scope.batchId
														+ '/trainingDate/'
														+ $rootScope.trainingDate
														+ '/dept/'
														+ $scope.dept)
										.then(
												function(response) {

													$scope.studentList = response.data;
													if ($scope.studentList.length == 0) {
														$scope.infoMessage = true;
														$scope.showList = false;
														$timeout(
																function() {
																	$scope.infoMessage = false;
																}, 3000);
													} else {
														
														angular
														.forEach(
																$scope.studentList,
																function(
																		response) {
																	console.log('second');
																	console.log(response.freeze);
																	if(response.freeze===true)
																		{
																		console.log('true');
																		$scope.disableUpdateButton=true;
																		$scope.showList = true;
																		$scope.showFreezeButton = true;
																		}
																	else
																		{
																		console.log('false');
																		$scope.disableUpdateButton=false;
																		$scope.showList = true;
																		$scope.showFreezeButton = true;
																		}
																	
																})
                                         
													}

												});

							}
							var freeze=false;
							$scope.updateFreeze=(function(user)
							{
								console.log(user.date.trDate);
								$scope.trdate=user.date.trDate;
								var freeze=true;
								$http
								.put(
										$scope.urlBase
												+ '/attendance/freezeAttendance?trDate='+
												$scope.trdate +'&freezed='
												+ freeze)
								.then(
										function(response) {
											console.log('freezed');
											
											$http
											.get(
													$scope.urlBase
															+ '/attendance/Student/batch/'
															+ $scope.batchId
															+ '/trainingDate/'
															+ $rootScope.trainingDate
															+ '/dept/'
															+ $scope.deptNames[0])
											.then(
													function(
															response) {

														$scope.studentList = response.data;
														$(
																'#dept')
																.addClass(
																		'active');

														if ($scope.studentList.length == 0) {
															$scope.infoMessage = true;
															$scope.showList = false;
															$timeout(
																	function() {
																		$scope.infoMessage = false;
																	},
																	3000);
														} else {
															
															angular
															.forEach(
																	$scope.studentList,
																	function(
																			response) {
																		console.log('first');
																		console.log(response.freeze);
																		if(response.freeze===true)
																			{
																			console.log('true');
																			$scope.disableUpdateButton=true;
																			$scope.showList = true;
																			$scope.freezeMessage = true;
																			$scope.showFreezeButton = true;
																			$timeout(
																					function() {
																						$scope.freezeMessage = false;
																					},
																					3000);
																			
																			}
																		else
																			{
																			console.log('false');
																			$scope.disableUpdateButton=false;
																			$scope.freezeMessage = true;
																			$scope.showFreezeButton = true;
																			$scope.showList = true;
																			$timeout(
																					function() {
																						$scope.freezeMessage = false;
																					},
																					3000);
																			
																			}
																		
																	})
														}

													});

								});
										});		
							

						} ]);
