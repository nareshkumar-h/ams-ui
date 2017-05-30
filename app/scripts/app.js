var webApp = angular.module('webApp', [ 'ngRoute',
		'angularUtils.directives.dirPagination' ]);

webApp
		.config([ '$routeProvider', function($routeProvider) {
			$routeProvider.when('/', {
				templateUrl : 'app/views/login.html',
				controller : 'LoginController'

			}).when("/home", {
				templateUrl : "app/views/home.html",
				controller : "HomeController"
			}).when("/generateReport", {
				templateUrl : "app/views/report.html",
				controller : "ReportController"
			}).when("/myAttendanceReport", {
				templateUrl : "app/views/my-attendance-list.html",
				controller : "myAttendanceReportController"
			}).when("/studentReview", {
				templateUrl : "app/views/student-review.html",
				controller : "StudentReviewController"
			}).otherwise({
				redirectTo : '/'
			});

		} ])
		.run(
				[
						'$rootScope',
						'$location',
						'$http',
						'$route',
						'$window',
						function($rootScope, $location, $http, $route, $window) {
							$rootScope.roleName = localStorage.getItem('role');
							$rootScope
									.$on(
											'$routeChangeStart',
											function(event, next) {

												var userAuthenticated = localStorage
														.getItem('loggedIn');
												if (!userAuthenticated
														&& !next.isLogin) {
													$rootScope.savedLocation = $location
															.path();
													$location.path('/');

												} else {
													$rootScope.savedLocation = $location
															.path();
													$location
															.path($rootScope.savedLocation);
													if ($rootScope.roleName == 'student'
															&& ($rootScope.savedLocation == '/'
																	|| $rootScope.savedLocation == '/home' || $rootScope.savedLocation == '/generateReport')) {
														$location
																.path('myAttendanceReport');

													} else if ($rootScope.roleName == 'trainer'
															&& $rootScope.savedLocation == '/') {
														$location.path('home');

													}
												}
											});

						} ]);