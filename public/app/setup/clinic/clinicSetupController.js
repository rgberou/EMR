/**
 * Created by kent on 2/5/2016.
 */
'use strict';

app.controller('clinicController',['$scope', '$rootScope', '$modal', '$log', 'clinicDataFactory', 'newsfeedDataFactory',
    '$location','$stateParams','toastr','rfc4122',
    function($scope, $rootScope, $modal, $log, clinicDataFactory, newsfeedDataFactory,
             $location, $stateParams, toastr, rfc4122){

        $scope.clinics = [];
        $scope.clinic = {};

        //
        var getClinics = function(){
            clinicDataFactory.getClinics().then(function(data) {
                $scope.clinics = data.data;
            });
        };
        getClinics();

        var getClinic = function(syspk){
            clinicDataFactory.getClinicBySysPK(syspk).then(function(data) {
                $scope.clinic = data.data[0];
            });
        }

        if($stateParams.syspk){
            clinicDataFactory.getClinicBySysPK($stateParams.syspk).then(function(data) {
                $scope.clinic = data.data[0];
                if($scope.clinic == undefined){
                    toastr.error("No record found");
                    $location.path("/clinic");
                }
            });
        };

        $scope.addClinic = function(){
            if($stateParams.syspk){
                var clinic = $scope.clinic;
                clinicDataFactory.updateClinic(clinic).then(function(){
                    toastr.success($scope.clinic.ClinicName_Clinic + " successfully updated to the database.");
                    $location.path("/clinic");
                    getClinics();
                });
            }else{
                var clinic = $scope.clinic;
                clinic.SysPK_Clinic = rfc4122.v4();
                clinicDataFactory.addClinic(clinic).then(function(){
                    $scope.clinic = {};
                    getClinics();
                });
                toastr.success($scope.clinic.ClinicName_Clinic + " successfully added to the database.");

                var newsfeed = {
                    SysPK_Newsfeed : rfc4122.v4(),
                    SysFK_User_Newsfeed : $rootScope.user.syspk,
                    Module_Newsfeed : 'Clinic',
                    Particulars_Newsfeed : $scope.clinic.ClinicName_Clinic,
                    Date_Newsfeed : new Date()
                };
                newsfeedDataFactory.addNewsfeed(newsfeed).then(function(){});
            }
        };
    }]);
