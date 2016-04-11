/**
 * Created by kent on 2/5/2016.
 */


'use strict';

app.controller('clinicRoomController',['$scope', '$rootScope', '$modal', '$log', 'clinicDataFactory', 'newsfeedDataFactory', 'doctorDataFactory','employeeDataFactory',
    '$location','$stateParams','toastr','rfc4122',
    function($scope, $rootScope, $modal, $log, clinicDataFactory, newsfeedDataFactory,doctorDataFactory,employeeDataFactory,
             $location, $stateParams, toastr, rfc4122){

        $scope.clinicrooms = [];
        $scope.clinicroom = {};
        $scope.clinics = [];
        $scope.clinic = {};

        $scope.DPSLists = [];
        $scope.DPSList = {};
        $scope.CJuncs = [];
        $scope.CJunc = {};
        $scope.dpss = [];
        var rn = '';

        $scope.selectedClinicName = '';

        //
        var getClinicRooms = function(){
             clinicDataFactory.getClinicRooms().then(function(data) {
                $scope.clinicrooms = data.data;
            });
        };
        getClinicRooms();

        var getClinic = function(syspk){
            clinicDataFactory.getClinicBySysPK(syspk).then(function(data) {
                $scope.clinic = data.data[0];
            });
        };

        var getClinicJunctionsByClinicID = function(clinicID){
            clinicDataFactory.getClinicJunctionsByClinicRoomID($stateParams.syspk).then(function(data){
                $scope.DPSLists = [];
                $scope.CJuncs = [];
                for(var i = 0; i < data.data.length; i ++){
                    var rn = data.data[i];
                    $scope.DPSList = {};
                    $scope.CJuncs.push({
                        id : data.data[i].id,
                        SysFK_DPS_CJunc : data.data[i].SysFK_Doctor_CJunc,
                        DPSTable_CJunc : data.data[i].DPSTable_CJunc,
                        ClinicRoom_CJunc : data.data[i].ClinicRoom_CJunc
                    });

                    if(data.data[i].DPSTable_CJunc == 'Doctor'){
                        doctorDataFactory.getDoctor(data.data[i].SysFK_Doctor_CJunc).then(function(doctor){
                            $scope.DPSLists.push({
                                Name : doctor.data.data.Name_Doctor,
                                DPSTable : "Doctor",
                                SysPKDPS : doctor.data.data.SysPK_Doctor,
                                RoomNumber : rn.ClinicRoom_CJunc
                            });
                        })
                    }
                    if(data.data[i].DPSTable_CJunc == 'Secretary'){
                        employeeDataFactory.getEmployee(data.data[i].SysFK_Doctor_CJunc).then(function(empl){
                            $scope.DPSLists.push({
                                Name : empl.data.data.Name_Empl,
                                DPSTable : "Secretary",
                                SysPKDPS : empl.data.data.SysPK_Empl,
                                RoomNumber : rn.ClinicRoom_CJunc
                            });
                        })
                    }
                };
            })
        }

        if($stateParams.syspk){
            clinicDataFactory.getClinicByClinicRoomID($stateParams.syspk).then(function(data) {
                if(data.data[0] == undefined){
                    toastr.error("No record found");
                    $location.path("/clinicroom");
                }else{$scope.clinicroom = data.data[0];}
            });
            //get table list
            getClinicJunctionsByClinicID($stateParams.syspk)
        };

        clinicDataFactory.getClinics().then(function(data) {
            $scope.clinics = data.data;
            console.log("clinics : " + $scope.clinics);
            $scope.openClinics = function (size) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'clinicModal2.html',
                    controller: 'ClinicModalInstanceCtrl',
                    size: size,
                    resolve: {
                        clinics: function () {
                            return $scope.clinics;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selectedClinicName = selectedItem.ClinicName_Clinic;
                    $scope.clinicroom.clinic = selectedItem;

                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
        });

        doctorDataFactory.getDoctors().then(function(data){
            for(var i = 0; i < data.data.length; i ++) {
                var d = {
                    SysPKDPS: data.data[i].SysPK_Doctor,
                    NameDPS: data.data[i].Name_Doctor,
                    AddressDPS: data.data[i].Address_Doctor,
                    TableDPS: 'Doctor'
                }
                $scope.dpss.push(d);
            }
        });

        employeeDataFactory.getEmployees().then(function(data){
            for(var i = 0; i < data.data.length; i ++) {
                var d = {
                    SysPKDPS: data.data[i].SysPK_Empl,
                    NameDPS: data.data[i].Name_Empl,
                    AddressDPS: data.data[i].Address_Empl,
                    TableDPS: 'Secretary'
                }
                $scope.dpss.push(d);
            }
        });

        //modal dps
        $scope.openDPS = function (size) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'dpsModal.html',
                controller: 'DPSModalInstanceCtrl',
                size: size,
                resolve: {
                    dpss: function () {
                        return $scope.dpss;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.addListDPS(selectedItem);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.addListDPS = function(data){
            console.log(data);
            //data to be added in the database table clinicjunctions
            $scope.CJunc = {
                SysFK_DPS_CJunc : data.SysPKDPS,
                DPSTable_CJunc : data.TableDPS,
                ClinicRoom_CJunc : ""
            };

            $scope.CJuncs.push($scope.CJunc);

            //data to be displayed in table in clinic setup
            var list = {
                Name : data.NameDPS,
                DPSTable : data.TableDPS,
                SysPKDPS : data.SysPKDPS,
                RoomNumber : ""
            }
            $scope.DPSLists.push(list);
        }

        $scope.removeDPS = function(dps){
            console.log(dps);
            //if(dps.id){
            clinicDataFactory.getClinicJunctionsByClinicAndDPSID($stateParams.syspk, dps.SysPKDPS).then(function(dps){
                console.log($scope.DPSLists);
                clinicDataFactory.deleteClinicJunctionByClinicAndDPSID($stateParams.syspk, dps.data[0].SysFK_Doctor_CJunc);
            })
            var cjunc = {
                SysFK_DPS_CJunc : dps.SysPKDPS,
                DPSTable_CJunc : dps.SysPKDPS,
                ClinicRoom_CJunc : ""
            }
            console.log($scope.CJuncs);
            console.log("cjuncs : " + angular.toJson(cjunc));
            var indexList = $scope.DPSLists.indexOf(dps);
            var indexCJunc = $scope.CJuncs.indexOf(cjunc);
            if(indexList >= 0){
                $scope.DPSLists.splice(indexList, 1);
            }
            if(indexCJunc >= 0) {
                $scope.CJuncs.splice(indexCJunc, 1);
            }
            //}
            //else{
               // var index = $scope.DPSLists.indexOf(dps);
                //console.log(index);
                //$scope.DPSLists.splice(index, 1);
            //}
        }

        $scope.addClinicRoom = function(){
            if($stateParams.syspk){
                var clinic = $scope.clinicroom;
                clinicDataFactory.updateClinic(clinic).then(function(){
                    toastr.success($scope.clinic.ClinicName_Clinic + " successfully updated to the database.");
                    $location.path("/clinicroom");
                    //getClinicRooms();
                });
                //clinicDataFactory.deleteClinicJunctions(clinic.SysPK_CRoom).then();
                for(var i = 0; $scope.CJuncs.length > i; i ++){
                    $scope.CJuncs[i].SysFK_Clinic_CJunc = clinic.SysPK_CRoom;

                    clinicDataFactory.addClinicJunction($scope.CJuncs[i])

                    /*clinicDataFactory.getClinicJunctionsByClinicAndDPSID(clinic.SysPK_CRoom, $scope.CJuncs[i].SysFK_Doctor_CJunc).then(function(data){
                     if(data.data.length > 0){
                     clinicDataFactory.updateClinicJunction($scope.CJuncs[i]);
                     }else{
                     clinicDataFactory.addClinicJunction($scope.CJuncs[i]).then(function(){
                     getClinicRooms();
                     });
                     }
                     }) */
                }

                getClinicRooms();
            }
            else //no clinicroom id parameter     /clinicroom/:$stateParams.syspk
            {
                var clinicroom = {};
                var clinic = {};
                if($scope.selectedClinicName !== $scope.clinicroom.ClinicName_Clinic){
                    clinic = {
                        SysPK_Clinic: rfc4122.v4(),
                        ClinicName_Clinic: $scope.clinicroom.clinic.ClinicName_Clinic,
                        Address_Clinic: $scope.clinicroom.clinic.Address_Clinic,
                        ContactNumber_Clinic: $scope.clinicroom.clinic.ContactNumber_Clinic
                    };
                    clinicroom = {
                        SysPK_CRoom: rfc4122.v4(),
                        SysFK_Clinic_CRoom: clinic.SysPK_Clinic,
                        RoomNumber_CRoom: $scope.clinicroom.RoomNumber_CRoom
                    };
                    clinicDataFactory.addClinic(clinic);
                    clinicDataFactory.addClinicRoom(clinicroom).then(function(){
                        //getClinicRooms();
                    });
                }else{ //if no changes in the selected clinic name
                    clinicroom = {
                        SysPK_CRoom: rfc4122.v4(),
                        RoomNumber_CRoom: $scope.clinicroom.RoomNumber_CRoom,
                        SysFK_Clinic_CRoom: $scope.clinicroom.clinic.SysPK_Clinic
                    };
                    clinicDataFactory.addClinicRoom(clinicroom).then(function(){
                        getClinicRooms();
                    });
                }

                for(var i = 0; $scope.CJuncs.length > i; i ++){
                    $scope.CJuncs[i].SysFK_Clinic_CJunc = clinicroom.SysPK_CRoom;
                    clinicDataFactory.addClinicJunction($scope.CJuncs[i]).then(function(){
                        //
                    });
                }
                getClinicRooms();
                toastr.success($scope.clinic.ClinicName_Clinic + " successfully added to the database.")
                $scope.clinic = {};
                $scope.clinicroom = {};
                $scope.CJuncs = [];
                $scope.DPSLists = [];;
            }
        };
    }]);
