webApp
        .controller(
                'ReportController',
                [
                        '$scope',
                        '$http',
                        '$rootScope',
                        '$location',
                        function($scope, $http, $rootScope, $location) {
                            $scope.urlBase = 'http://localhost:8080';
                            $scope.showReport = false;
                            console.log($scope.showReport);
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
                            
                            $scope.$watch('user.batch',function(newVal, oldVal) {
                                $scope.batchName = newVal.batchName;
                                $scope.batchId = newVal.batchId;
                                $scope.dept=null;
                                $http.get($scope.urlBase+ '/attendanceReport/Student/batch/'+ $scope.batchId
                                                + '/dept/'
                                                + $scope.dept).then(
                              function(response) {                    
                                $scope.studentAttendanceReportList=response.data;
                                $scope.deptNames = _.uniq(_.sortBy(_.pluck($scope.studentAttendanceReportList,'dept')));        
                                                                                
                                $scope.countReport = $scope.studentAttendanceReportList.length;
                                $scope.period = localStorage.getItem('totalSession');
                                                                            
                                console.log($scope.studentAttendanceReportList);
                                                    });
                                                                
                                                
                                $http.get($scope.urlBase+ '/batches/id/'+ $scope.batchId+ '/trDates').then(
                                   function(response) {                        
                                    $scope.dateList = response.data;
                                    $scope.totalDates = $scope.dateList.length;
                                    localStorage.setItem("totalSession",$scope.totalDates);
                                                       });
                                            });
                    
                             $scope.studentAttendanceReport = (function(user) {
                                $scope.showReport = true;
                                $scope.showList = true;
                                $scope.dept = null;
                                
                            });
                             

                             
                          $scope.exportPdf = function() {
                            	window.print();
                                
                             };
                             
                             /*
                             $scope.exportPdf = function() {
                             $http.post($scope.urlBase+ '/generteReport',$scope.studentAttendanceReportList).then(
                                     function(response) { 
                                    	 console.log("s");	
                                     });}*/
                             
                            localStorage.removeItem('studentDate');
                            localStorage.removeItem('batchId');
                            localStorage.removeItem('deptId');
                            localStorage.removeItem('batchName');
                        } ]);