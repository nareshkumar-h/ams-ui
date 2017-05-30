webApp.controller('HeaderController', [ '$scope', '$http', '$rootScope',
		'$location','$window', function($scope, $http, $rootScope, $location,$window) {
			$scope.urlBase = 'http://localhost:8080';
			$scope.name = localStorage.getItem('name');
			$scope.loggedIn = localStorage.getItem('loggedIn');

			if ($scope.loggedIn) {
				$scope.name = localStorage.getItem('name');
				$scope.showheader = true;
			} else {
				$scope.showheader = false;
			}
			$scope.roleName = localStorage.getItem('role');

			if ($scope.roleName == 'student') {
				$scope.studentRole = true;

			} else {
				$scope.studentRole = false;

			}
			$scope.logout = function() {
				localStorage.removeItem('name');
				localStorage.removeItem('loggedIn');
				localStorage.removeItem('role');
				localStorage.removeItem('userName');
				localStorage.removeItem('userId');
				$location.path('/');
				$window.location.reload();

			}
			$scope.home = function() {

				$location.path('/home');
				$('#home').addClass('active');
				$('#al').removeClass('active');
				$('#report').removeClass('active');
				$('#inReview').removeClass('active');
			}

			$scope.StudentAttendanceList = (function() {
				$('#home').removeClass('active');
				$('#al').addClass('active');
				$('#report').removeClass('active');
				$('#inReview').removeClass('active');
				$location.path('/myAttendanceReport');
			});
			$scope.generateReport = (function() {
				$('#home').removeClass('active');
				$('#al').removeClass('active');
				$('#report').addClass('active');
				$('#inReview').removeClass('active');
				$location.path('/generateReport');
			});
			$scope.reviewList = (function() {
				$('#home').removeClass('active');
				$('#al').removeClass('active');
				$('#report').removeClass('active');
				$('#inReview').addClass('active');
				$location.path('/studentReview');
			});

			$scope.isActive = function(viewLocation) {
				return viewLocation === $location.path();
			};

		} ]);