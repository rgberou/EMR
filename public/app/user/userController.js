/**
 * Created by kent on 1/25/2016.
 */

'use strict';

app.controller('UserListCtrl', ['$scope', '$rootScope', '$location', '$auth', 'toastr', 'filterFilter', 'userDataFactory',
    function($scope, $rootScope, $location, $auth, toastr, filterFilter, userDataFactory) {
        $scope.users = [];
        $scope.id = '';
        userDataFactory.getUsers().then(function(users) {
            $scope.users = users.data;
            //pagination and search
            $scope.search = {};
            $scope.resetFilters = function () {
                // needs to be a function or it won't trigger a $watch
                $scope.search = {};
            };
            // pagination controls
            $scope.currentPage = 1;
            $scope.totalItems = $scope.users.length;
            $scope.entryLimit = 10; // items per page
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
            // $watch search to update pagination
            $scope.$watch('search', function (newVal, oldVal) {
                $scope.filtered = filterFilter($scope.users, newVal);
                $scope.totalItems = $scope.filtered.length;
                $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
                $scope.currentPage = 1;
            }, true);
        });
        $scope.setID = function(user){
            $scope.id = user.SysPK_User;

            if ($scope.lastSelected) {
                $scope.lastSelected.selected = '';
            }
            this.selected = 'active';
            $scope.lastSelected = this;
        };
        $scope.deleteuser = function(){
            if($scope.id !='') {
                $confirm({text: 'Are you sure you want to delete?', title: 'Confirm', ok: 'Yes', cancel: 'No'})
                    .then(function () {
                        userDataFactory.deleteUser($scope.id).success(function () {
                            userDataFactory.getUsers().then(function (data) {
                                $scope.users = data.data;
                                $scope.id = '';
                                toastr.success('User successfully deleted.');
                            });
                        });
                    });
            }else{
                toastr.error('Please select user to delete.');
            }

        };
        $scope.gotoUpdate = function(path){
            if($scope.id !=''){
                $location.path(path + $scope.id);
            }else{
                toastr.error('Please select user to update.');
            }
        };
    }]);

app.controller('LogoutCtrl', ['$auth','$location','oluserDataFactory','$rootScope', function($auth, $location,oluserDataFactory,$rootScope){

    $auth.logout()
        .then(function() {
            //oluserDataFactory.deleteOLUser($auth.getToken());
            oluserDataFactory.deleteOLUser($rootScope.user.syspk);
            $auth.removeToken();
            $auth.removeCookie('globals');
            $auth.removeCookie('clinic');

            //toastr.info('You have been logged out');
            $location.path('/login');
        });
}])

app.controller('LoginCtrl', ['$scope', '$rootScope', '$location', '$auth', 'Cookie', 'toastr', 'Base64', 'oluserDataFactory', 'userDataFactory', 'clinicDataFactory', 'rfc4122', '$modal', 'Idle',
    function($scope, $rootScope, $location, $auth, Cookie, toastr, Base64, oluserDataFactory, userDataFactory, clinicDataFactory, rfc4122, $modal, Idle) {
        $scope.user = {};
        $rootScope.onlineUser = {};
        $rootScope.rclinics = {};

        //set rootScope / global scope
        var setGlobalUser = function(user){
            var nameuser = user.Name_User;
            var namelengt = user.Name_User.length;
            if(namelengt > 13){
                nameuser = nameuser.substr(0, 14) + ' ...'
            }
            $rootScope.user = {
                uname: user.UserName_User,
                name: nameuser,
                syspk: user.SysPK_User,
                rights: user.AccessRights_User,
                accounttype: user.AccountType_User
            }
        };

        var getClinicsOfUser = function(syspkuser, userrights){
            userDataFactory.getDPS(syspkuser, userrights).then(function(dps){
                var syspkdps = '';
                if(userrights === 'doctor'){syspkdps = dps.data[0].SysPK_Doctor}
                if(userrights === 'secretary'){syspkdps = dps.data[0].SysPK_Empl}
                if(userrights === 'patient'){syspkdps = dps.data[0].SysPK_Patient}
                clinicDataFactory.getClinicRoomsOfUser(syspkdps).then(function(clinic){
                    $rootScope.rclinics = clinic.data;
                })
            })
        };

        $scope.login = function() {
            $auth.login($scope.user)
                .then(function() {
                    userDataFactory.getUserByUsername($scope.user.UserName_User).then(function(data) {
                        setGlobalUser(data.data[0]);
                        $rootScope.clinicCookie = {};
                        $auth.setCookie('globals',data.data[0]);

                        getClinicsOfUser(Base64.decode(data.data[0].SysPK_User), Base64.decode(data.data[0].AccessRights_User));
                        //
                        $location.path('/profile');
                        /*
                        if(Base64.decode(data.data[0].AccessRights_User) === 'administrator'){
                            $location.path('/newsfeed');
                        }else{
                            if(Base64.decode(data.data[0].AccessRights_User) === 'secretary'){
                                $location.path('/patient-encounter');
                            }else{
                                $location.path('/dashboard');
                            }
                        } */
                    });

                    /////update token
                    $scope.onlineUser.Token_OLUser = $auth.getToken();
                    $scope.onlineUser.UserName_OLUser = $scope.user.UserName_User;

                    oluserDataFactory.getCurrentUserByUserName($scope.user.UserName_User).then(function(data){
                        if(data.data.length === 0) {
                            $rootScope.onlineUser.SysPK_OLUser = rfc4122.v4();
                            $scope.onlineUser.SysFK_UserID=$rootScope.user.syspk;
                            oluserDataFactory.addOLUser($scope.onlineUser);
                        }else{
                            $rootScope.onlineUser.SysPK_OLUser = data.data[0].SysPK_OLUser
                            $scope.onlineUser.SysFK_UserID=$rootScope.user.syspk;
                            oluserDataFactory.updateOLUser($scope.onlineUser);
                        }
                    });
                    toastr.success('You have successfully signed in');
                })
                .catch(function(response) {
                    toastr.error(response.data.message, response.status);
                });
        };
        $scope.authenticate = function(provider) {
            $auth.authenticate(provider)
                .then(function() {
                    toastr.success('You have successfully signed in with ' + provider);
                    $location.path('/patient-setup');
                })
                .catch(function(response) {
                    toastr.error(response.data.message);
                });
        };


    }]);

app.controller('RegisterCtrl', ['$scope', '$location', 'toastr', '$modal', '$log', '$filter', '$stateParams', 'userDataFactory', 'patientDataFactory', 'doctorDataFactory', 'employeeDataFactory', 'rfc4122',
    function($scope, $location, toastr, $modal, $log, $filter, $stateParams, userDataFactory, patientDataFactory, doctorDataFactory, employeeDataFactory, rfc4122) {
        $scope.user = {};
        $scope.userList = [];
        $scope.syspk = ''; //params
        $scope.DPSPK = ''; //doctor, patient or secretary pk
        $scope.DPS = {}; //doctor, patient, secretary

        if($stateParams.syspk) {
            $scope.syspk = $stateParams.syspk;
            userDataFactory.getUserBySysPK($stateParams.syspk).then(function (user) {
                $scope.user = user.data[0];
                if($scope.user == undefined){
                    toastr.error("No Record Found");
                    $location.path('/users');
                }
            });
        };


        $scope.register = function() {
            var user = $scope.user;
            if($stateParams.syspk){
                user.SysPK_User = $stateParams.syspk;
                userDataFactory.updateUser(user).then(function(){
                    $location.path('/users');
                    toastr.success("User " + user.UserName_User + " is succesfully updated.");
                });
            }else{
                if(isAvailableUsername(user.UserName_User)){
                    user.SysPK_User = rfc4122.v4();
                    userDataFactory.addUser(user).then(function(){
                        $scope.userList.push(user.UserName_User);
                        toastr.success("User " + user.UserName_User + " is succesfully added to EMR database.");
                        $scope.user = {};
                    });
                    if(user.AccessRights_User === 'doctor'){
                        $scope.DPS.SysFK_User_Doctor = user.SysPK_User;
                        doctorDataFactory.updateDoctor($scope.DPS);
                        $scope.DPS = {};
                    }
                    if(user.AccessRights_User === 'patient'){
                        $scope.DPS.SysFK_User_Patient = user.SysPK_User;
                        patientDataFactory.updatePatient($scope.DPS);
                        $scope.DPS = {};
                    }
                    if(user.AccessRights_User === 'secretary'){
                        $scope.DPS.SysFK_User_Empl = user.SysPK_User;
                        employeeDataFactory.updateEmployee($scope.DPS);
                        $scope.DPS = {};
                    }
                }
            }
        }

        userDataFactory.getUsers().then(function(user) {
            for(var i = 0; i < user.data.length; i++){
                $scope.userList.push(user.data[i].UserName_User);
            }
        });

        function isAvailableUsername(username){
            if($filter('filter')($scope.userList, username).length ===0){
                return true;
            }else{
                toastr.info('Username is already taken. Please pick another one.');
                return false;
            }
        }

        //for modal patient list
        patientDataFactory.getPatients().then(function(data){
            $scope.patients = data.data;
            $scope.openpatient = function (size) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'patientModal.html',
                    controller: 'PatientModalInstanceCtrl',
                    size: size,
                    resolve: {
                        patients: function () {
                            return $scope.patients;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.user.Name_User = selectedItem.Name_Patient;
                    $scope.user.SysFK_User_User = selectedItem.SysPK_Patient;
                    $scope.DPS = selectedItem;
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
        });
        //for modal doctor list
        doctorDataFactory.getDoctors().then(function(data){
            $scope.doctors = data.data;
            $scope.opendoctor = function (size) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'doctorModal.html',
                    controller: 'DoctorModalInstanceCtrl',
                    size: size,
                    resolve: {
                        doctors: function () {
                            return $scope.doctors;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.user.Name_User = selectedItem.Name_Doctor;
                    $scope.DPSPK = selectedItem.SysPK_Doctor;
                    $scope.DPS = selectedItem;
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
        });
        //for modal employee list
        employeeDataFactory.getEmployees().then(function(data){
            $scope.employees = data.data;
            $scope.openemployee = function (size) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'employeeModal.html',
                    controller: 'EmployeeModalInstanceCtrl',
                    size: size,
                    resolve: {
                        employees: function () {
                            return $scope.employees;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.user.Name_User = selectedItem.Name_Empl;
                    $scope.DPSPK = selectedItem.SysPK_Empl;
                    $scope.DPS = selectedItem;
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
        });

    }]);