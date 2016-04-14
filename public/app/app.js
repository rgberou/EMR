/**
 * Created by alain.bibera on 8/18/2015.
 */

'use strict';
var urlBase = '';
var app=angular.module('mdrApp',[
    'uuid',
    'ngIdle',
    'ngRoute',
    'ngCookies',
    'toastr',
    'mdrApp.angular-confirm',
    'angularFileUpload',
    'ngAnimate',
    'ngSanitize',
    'mgcrea.ngStrap',
    'angular-jwt',
    'angular-storage',
    'ui.router',
    'satellizer']);

app.controller('MainCtrl', ['$scope', '$auth', '$rootScope', '$cookieStore', 'Base64', '$location','Idle', '$modal', '$window',
    'oluserDataFactory','clinicDataFactory','userDataFactory',
    function($scope, $auth, $rootScope, $cookieStore, Base64, $location, Idle,$modal,$window,
    oluserDataFactory,clinicDataFactory,userDataFactory) {

    $rootScope.user = {};
    $rootScope.clinicCookie = {};
    $rootScope.oluser = {};
    $rootScope.dps = {};
    $rootScope.rclinics = {};


    urlBase = 'http://' + $location.host() + ':' + $location.port();
    var user = $cookieStore.get('globals') || undefined;
    var clinic = $cookieStore.get('clinic') || undefined;
    //getting online doctors
        //socket io functionalities


        /*Socket.connect();

        $scope.on('$locationchangestart',function(event){
            Socket.disconnect(true);
        })*/


        //
        (function update() {
            $timeout(update, 1000);
         
        }());
    /*oluserDataFactory.getOLDoctors().then(function(){
        try{
            var socket=io.connect('http://127.0.0.1:3001');
        }catch(e){

        }
        if(socket!==undefined){
            console.log('Ok');
            socket.on('output',function(data){
                console.log(data);
            });
        }
    });*/
        /*try{
            var socket=io.connect();
            console.log('its working');
        }catch(e){

        }
        if(socket!==undefined){
            console.log('Ok');
            socket.on('output',function(data){
                console.log('nadawat ang output');
                //console.log(data.name);
            });
        }*/


    $rootScope.getClinicsOfUser = function(syspkuser, userrights){
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

    if(user !== undefined){
        //Idle.watch();
        $rootScope.getClinicsOfUser(Base64.decode(user.dataObj.SysPK_User), Base64.decode(user.dataObj.AccessRights_User));
        var nameuser = Base64.decode(user.dataObj.Name_User);
        var namelengt = nameuser.length;
        if(namelengt > 13){
            nameuser = nameuser.substr(0, 14) + ' ...'
        }
        $rootScope.user = {
            uname : Base64.decode(user.dataObj.UserName_User),
            name : nameuser,
            rights : Base64.decode(user.dataObj.AccessRights_User),
            syspk : Base64.decode(user.dataObj.SysPK_User),
            accounttype : Base64.decode(user.dataObj.AccountType_User)
        }
    };
    if(clinic !== undefined){
        $rootScope.clinicCookie = {
            syspkclinic : Base64.decode(clinic.dataObj.syspkclinic),
            clinicname : Base64.decode(clinic.dataObj.clinicname),
            clinicroom : Base64.decode(clinic.dataObj.clinicroom)
        }
    }

    var getDPS = function(){
        userDataFactory.getDPS($rootScope.user.syspk, $rootScope.user.rights).then(function(data){
            if($rootScope.user.rights === 'doctor'){
                $scope.syspkdps = data.data[0].SysPK_Doctor;
            }
            if($rootScope.user.rights === 'patient'){
                $scope.syspkdps = data.data[0].SysPK_Patient;
            };
            if($rootScope.user.rights === 'secretary'){
                $scope.syspkdps = data.data[0].SysPK_Empl;
            }

            clinicDataFactory.getClinicRoomsOfUser($scope.syspkdps).then(function(data) {
                $scope.clinics = data.data;

                var modalInstance = $modal.open(
                    {
                        animation: true,
                        templateUrl: 'clinicModal.html',
                        controller: 'ClinicModalInstanceCtrl',
                        size: "md",
                        resolve: {
                            clinics: function () {
                                return $scope.clinics;
                            }
                        }
                    });
                modalInstance.result.then(function (selectedItem) {
                    var clinicCookie = {
                        syspkclinic : selectedItem.clinicroom.clinic.SysPK_Clinic,
                        clinicname : selectedItem.clinicroom.clinic.ClinicName_Clinic,
                        clinicroom : selectedItem.clinicroom.RoomNumber_CRoom
                    }
                    $rootScope.clinicCookie = {
                        syspkclinic : clinicCookie.syspkclinic,
                        clinicname : clinicCookie.clinicname,
                        clinicroom : clinicCookie.clinicroom
                    }
                    $auth.setCookie('clinic',clinicCookie);
                }, function () {
                    //$log.info('Modal dismissed at: ' + new Date());
                });
            });
        });
    }
    $scope.selectClinic = function(userPK){
        getDPS();
    }

    $scope.started = false;
    function closeModals() {
        if ($scope.warning) {
            $scope.warning.close();
            $scope.warning = null;
        }
        if ($scope.timedout) {
            $scope.timedout.close();
            $scope.timedout = null;
        }
    }
    $scope.$on('IdleStart', function() {
        closeModals();

        $scope.warning = $modal.open({
            templateUrl: 'warning-dialog.html',
            windowClass: 'modal-danger'
        });
    });

    $scope.$on('IdleEnd', function() {
        closeModals();
    });

    $scope.$on('IdleTimeout', function() {
        closeModals();
        $scope.timedout = $modal.open({
            templateUrl: 'timedout-dialog.html',
            windowClass: 'modal-danger'
        });
        oluserDataFactory.deleteOLUser($auth.getToken());
        $auth.removeToken();
        $location.path('/login')
    });

    $scope.$on('$locationChangeSuccess',function(evt, absNewUrl, absOldUrl) {
        $rootScope.previouspage = absOldUrl.split('#')[1];
    });

    $scope.isAuthenticated = function () {
        return $auth.isAuthenticated();
    };

    if(!$cookieStore.get('globals')) {
        oluserDataFactory.deleteOLUser($auth.getToken());
        $auth.removeToken();
    }

    //to ensure that only one person can use one(1) account..
    var isTokenMatch = function(){
        if(user !== undefined) {
            oluserDataFactory.getCurrentUserByUserName(Base64.decode(user.dataObj.UserName_User)).then(function (res) {
                if (res.data.length !== 0) {
                    if($auth.getToken() !== res.data[0].Token_OLUser){
                        oluserDataFactory.deleteOLUser($auth.getToken());
                        $auth.removeToken();
                        $location.path('/login');
                    }
                }
            });
        }
    } //END


    isTokenMatch();
}]);

app.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
});

app.filter('iif', function () {
    return function(input, trueValue, falseValue) {
        return input ? trueValue : falseValue;
    };
});

app.filter('ageFilter', function() {
    function calculateAge(birthday) { // birthday is a date
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    function monthDiff(d1, d2) {
        if (d1 < d2){
            var months = d2.getMonth() - d1.getMonth();
            return months <= 0 ? 0 : months;
        }
        return 0;
    }
    return function(birthdate) {
        var age = calculateAge(birthdate);
        if (age == 0)
            return monthDiff(birthdate, new Date()) + '';
        return age;
    };
});
app.config(function($stateProvider, $urlRouterProvider, KeepaliveProvider,IdleProvider){

    $stateProvider
        .state('page-not-found', {
            url: '/page-not-found',
            controller: '',
            templateUrl: 'app/404.html'
        })
        .state('/', {
            url: '',
            controller: 'LoginCtrl',
            templateUrl: 'app/user/login.html',
            resolve: {
                skipIfLoggedIn: skipIfLoggedIn
            }
        })
        .state('register', {
            url: '/register',
            controller: 'RegistrationCtrl',
            templateUrl: 'app/user/registration.html',
            resolve: {
                skipIfLoggedIn: skipIfLoggedIn
            }
        })
        .state('users', {
            url: '/users',
            controller: 'UserListCtrl',
            templateUrl: 'app/user/userLists.html',
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('user-setup', {
            url: '/user-setup',
            controller: 'RegisterCtrl',
            templateUrl: 'app/user/userSetup.html',
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('user-setup/:syspk', {
            url: '/user-setup/:syspk',
            controller: 'RegisterCtrl',
            templateUrl: 'app/user/userSetup.html',
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('login', {
            url: '/login',
            controller: 'LoginCtrl',
            templateUrl: 'app/user/login.html',
            resolve: {
                skipIfLoggedIn: skipIfLoggedIn
            }
        })
        .state('logout', {
            url: '/logout',
            template: null,
            controller: 'LogoutCtrl'
        })
        .state('newsfeed', {
            url: '/newsfeed',
            controller: 'NewsfeedCtrl',
            templateUrl: 'app/newsfeed/newsfeed.html',
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('profile', {
            url: '/profile',
            controller: 'ProfileCtrl',
            templateUrl: 'app/user/UserProfile.html',
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('profile/:syspkUSer', {
            url: '/profile/:syspkUser',
            controller: 'ProfileCtrl',
            templateUrl: 'app/user/UserProfile.html',
            resolve: {
                loginRequired: loginRequired
            }
        })
        ////PATIENTS ROUTES
        .state('patients', {
            url: '/patients',
            controller: 'PatientListCtrl',
            templateUrl: 'app/setup/patient/patientList.html',
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('patients/:id', {
            url: '/patients/:id',
            controller: 'PatientInfoController',
            templateUrl: 'app/setup/patient/patientInfo.html',
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('patient-setup', {
            url: '/patient-setup',
            controller: 'PatientSetupCtrl',
            templateUrl: 'app/setup/patient/patientSetup.html',
            resolve: {
                loginRequired: loginRequired,
                isTokenMatch: isTokenMatch
            }
        })
        .state('patient-setup/:id', {
            url: '/patient-setup/:id',
            controller: 'PatientSetupCtrl',
            templateUrl: 'app/setup/patient/patientSetup.html',
            resolve: {
                loginRequired: loginRequired
            }
        })
        ////DOCTOR ROUTES
        .state('showDoctors', {
            url: '/doctors',
            controller: 'DoctorListCtrl',
            templateUrl: 'app/setup/doctor/doctorList.html',
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('doctorSetup', {
            url: '/doctor-setup',
            controller: 'DoctorSetupCtrl',
            templateUrl: 'app/setup/doctor/doctorSetup.html',
            resolve: {
                loginRequired: loginRequired
            }
        })

        ////EMPLOYEE ROUTES
        .state('employees', {
            url: '/employees',
            controller: 'SecretaryListCtrl',
            templateUrl: 'app/setup/employee/employeeList.html',
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('secretarySetup', {
            url: '/sect-setup',
            controller: 'SecretarySetupCtrl',
            templateUrl: 'app/setup/employee/employeeSetup.html',
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('adddoctorsecretary', {
            url: '/sect-setup/addnew/:cjuncID',
            controller: 'SecretarySetupCtrl',
            templateUrl: 'app/setup/employee/employeeSetup.html',
            resolve: {
                loginRequired: loginRequired
            }
        })


        .state('encounters', {
            url: '/encounters',
            templateUrl: "app/encounter/patientEncounterList.html",
            controller: "patientEncounterListCtrl",
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('patient-encounter', {
            url: '/patient-encounter',
            templateUrl: "app/encounter/patientencounterSetup.html",
            controller: "patientEncounterSetupController",
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('patient-encounter/:id', {
            url: '/patient-encounter/:id',
            templateUrl: "app/encounter/patientencounterSetup.html",
            controller: "patientEncounterSetupController",
            resolve: {
                loginRequired: loginRequired
            }
        })
        /////DEPARTMENTS
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: "app/dashboard/dashboard.html",
            controller: "dashboardController",
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('dashboard/:id', {
            url: '/dashboard/:id',
            templateUrl: "app/dashboard/dashboard.html",
            controller: "dashboardController",
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('pediatrics', {
            url: '/pediatrics',
            templateUrl: "app/setup/pediatric/pediatric.html",
            controller: "pediatricController",
            resolve: {
                loginRequired: loginRequired
            }
        })
        //////CLINIC
        .state('clinic', {
            url: '/clinic',
            templateUrl: "app/setup/clinic/clinicSetup.html",
            controller: "clinicController",
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('clinic/:syspk', {
            url: '/clinic/:syspk',
            templateUrl: "app/setup/clinic/clinicSetup.html",
            controller: "clinicController",
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('clinicroom', {
            url: '/clinicroom',
            templateUrl: "app/setup/clinic/clinicRoomSetup.html",
            controller: "clinicRoomController",
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('clinicroom/:syspk', {
            url: '/clinicroom/:syspk',
            templateUrl: "app/setup/clinic/clinicRoomSetup.html",
            controller: "clinicRoomController",
            resolve: {
                loginRequired: loginRequired
            }
        });

    $urlRouterProvider.otherwise('/page-not-found');

    IdleProvider.idle(7200);
    IdleProvider.timeout(10);
    KeepaliveProvider.interval(5);

    //$locationProvider.html5Mode({
    //enabled: true,
    //requireBase: false
    //});

    function isTokenMatch($cookieStore,oluserDataFactory,Base64,$auth,$location){
        var user = $cookieStore.get('globals') || undefined;
        if(user !== undefined) {
            oluserDataFactory.getCurrentUserByUserName(Base64.decode(user.dataObj.UserName_User)).then(function (res) {
                if (res.data.length !== 0) {
                    if($auth.getToken() !== res.data[0].Token_OLUser){
                        //oluserDataFactory.deleteOLUser($auth.getToken());
                        $auth.removeToken();
                        $location.path('/login');
                    }
                }
            });
        }
    }

    function skipIfLoggedIn($q, $location, $auth) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
            //deferred.reject();
            $location.path('/newsfeed');
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }

    function loginRequired($q, $location, $auth, Idle) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
            Idle.watch();
            deferred.resolve();
        } else {
            //$auth.removeToken();
            $location.path('/login');
        }
        return deferred.promise;
    };
});