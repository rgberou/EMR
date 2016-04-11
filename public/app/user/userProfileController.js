/**
 * Created by kent on 3/5/2016.
 */

'use strict';

app.controller('ProfileCtrl', ['$scope', '$stateParams', '$rootScope', '$location', '$auth', 'Cookie', 'toastr', 'Base64', '$modal',
    'userDataFactory', 'doctorDataFactory', 'employeeDataFactory', 'junctionDataFactory','clinicDataFactory',
    function($scope, $stateParams, $rootScope, $location, $auth, Cookie, toastr, Base64, $modal,
             userDataFactory, doctorDataFactory, employeeDataFactory, junctionDataFactory,clinicDataFactory) {

        $scope.detail = {};
        $scope.detail.profilePic = '../assets/img/avatar_2xx.png';
        $scope.clinics = [];
        $scope.societies = [];

        console.log("Last Page : " + $rootScope.previouspage);

        clinicDataFactory.getMedicalSocieties().then(function(soc){
            $scope.societies = soc.data;
        })

        var getDetailsofUser = function(syspkUser){
            userDataFactory.getUserBySysPK(syspkUser).then(function(user){
                if(user.data.length > 0){
                    if(user.data[0].AccessRights_User === 'doctor' || user.data[0].AccessRights_User === 'student'){
                        doctorDataFactory.getDoctorByUserSysPK(user.data[0].SysPK_User).then(function(doctor){
                            $scope.detail = {
                                Name: doctor.data[0].Name_Doctor,
                                Occupation: doctor.data[0].Specialization_Doctor,
                                Address: doctor.data[0].Address_Doctor,
                                SysPKUser: doctor.data[0].SysFK_User_Doctor,
                                SysPKDPS: doctor.data[0].SysPK_Doctor,
                                profilePic: doctor.data[0].Picture_Doctor !== '' ? '../assets/img/' + doctor.data[0].Picture_Doctor : '../assets/img/avatar_2xx.png'
                            }
                            console.log($scope.detail.profilePic);
                        });
                    }
                    if(user.data[0].AccessRights_User === 'secretary'){
                        employeeDataFactory.getEmployeeByUserSysPK(user.data[0].SysPK_User).then(function(empl){
                            $scope.detail = {
                                Name: empl.data[0].Name_Empl,
                                Occupation: 'Secretary',
                                Address: empl.data[0].Address_Empl,
                                SysPKUser: empl.data[0].SysFK_User_Empl,
                                SysPKDPS: empl.data[0].SysPK_Empl,
                                profilePic: empl.data[0].Picture_Empl !== '' ? '../assets/img/' + empl.data[0].Picture_Empl : '../assets/img/avatar_2xx.png'
                            }
                        });
                    }
                }else{
                    $location.path("/profile");
                }
            });
        };

        if($stateParams.syspkUser){
            getDetailsofUser($stateParams.syspkUser)
            console.log($scope.detail.profilePic);
        }else{
            getDetailsofUser($rootScope.user.syspk)
            console.log($scope.detail.profilePic);
        }

        $scope.updatePhoto = function(){

        }

        $scope.addClinic = function(){
            $scope.clinics = [];
            clinicDataFactory.getClinicRooms2().then(function(data) {
                $scope.clinics = data.data;
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'clinicRoomModal.html',
                    controller: 'ClinicModalInstanceCtrl',
                    size: 'md',
                    resolve: {
                        clinics: function () {
                            return $scope.clinics;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    console.log("dasdasd : " + angular.toJson(selectedItem));
                    var clinicjunc = {
                        SysFK_Doctor_CJunc : $scope.detail.SysPKDPS,
                        SysFK_Clinic_CJunc : selectedItem.SysPK_CRoom,
                        DPSTable_CJunc : $rootScope.user.rights
                    }
                    clinicDataFactory.addClinicJunction(clinicjunc);
                    $rootScope.getClinicsOfUser($rootScope.user.syspk, $rootScope.user.rights);
                }, function () {
                    //$log.info('Modal dismissed at: ' + new Date());
                });
            });
        }

        $scope.addSecretary = function(cjunc){
            $scope.dpss = [];
            employeeDataFactory.getEmployees().then(function(data){
                for(var i = 0; i < data.data.length; i ++) {
                    var d = {
                        SysPKDPS: data.data[i].SysPK_Empl,
                        NameDPS: data.data[i].Name_Empl,
                        AddressDPS: data.data[i].Address_Empl,
                        TableDPS: 'Secretary',
                        SysPKCJunc: cjunc.id
                    }
                    $scope.dpss.push(d);
                }
            });
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'dpsModal.html',
                controller: 'DPSModalInstanceCtrl',
                size: 'md',
                resolve: {
                    dpss: function () {
                        return $scope.dpss;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                var docsec = {
                    SysFK_CJunc_DocSecJunc: cjunc.id,
                    SysFK_Empl_DocSecJunc: selectedItem.SysPKDPS
                }
                junctionDataFactory.addDocSecJunction(docsec);
                clinicDataFactory.getClinicJunctionsByClinicAndDPSID(cjunc.SysFK_Clinic_CJunc, selectedItem.SysPKDPS).then(function(data){
                    if(data.data.length === 0){
                        var clinicjunc = {
                            SysFK_Doctor_CJunc: selectedItem.SysPKDPS,
                            SysFK_Clinic_CJunc: cjunc.SysFK_Clinic_CJunc,
                            DPSTable_CJunc: 'Secretary'
                        }
                        clinicDataFactory.addClinicJunction(clinicjunc).then(function(){
                            $rootScope.getClinicsOfUser($rootScope.user.syspk,$rootScope.user.rights);
                        });
                    }else {
                        $rootScope.getClinicsOfUser($rootScope.user.syspk, $rootScope.user.rights);
                    }
                })
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        }

        $scope.removeSecretary = function(empl){
            junctionDataFactory.deleteDocSecJunction(empl.id).then(function(){
                $rootScope.getClinicsOfUser($rootScope.user.syspk, $rootScope.user.rights);
            })
        }

    }
]);


