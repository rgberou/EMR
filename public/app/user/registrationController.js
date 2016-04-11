/**
 * Created by kent on 3/2/2016.
 */

'use strict';

app.controller('RegistrationCtrl', ['$q', '$rootScope', '$scope', '$location', '$auth', 'toastr', 'rfc4122', 'userDataFactory', 'doctorDataFactory',
    function($q, $rootScope, $scope, $location, $auth, toastr, rfc4122, userDataFactory, doctorDataFactory) {

        $scope.doctor = {};
        $scope.user = {};

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
                rights: user.AccessRights_User
            }
            console.log("Root " + angular.toJson($rootScope.user))
        };

        $scope.signup = function(){
            userDataFactory.getUserByUsername($scope.user.UserName_User).then(function(data) {
                if(data.data.length === 0){
                    $scope.user.SysPK_User = rfc4122.v4();
                    $scope.doctor.SysPK_Doctor = rfc4122.v4();
                    $scope.doctor.SysFK_User_Doctor = $scope.user.SysPK_User

                    var ln = $scope.doctor.LastName_Doctor === undefined ? "" : $scope.doctor.LastName_Doctor;
                    var fn = $scope.doctor.FirstName_Doctor === undefined ? "" : $scope.doctor.FirstName_Doctor;
                    var mn = $scope.doctor.MiddleName_Doctor === undefined ? "" : $scope.doctor.MiddleName_Doctor;
                    var en = $scope.doctor.ExtensionName_Doctor === undefined ? "" : $scope.doctor.ExtensionName_Doctor;
                    $scope.user.Name_User = ln + ", " + fn + " " + mn + " " + en
                    $scope.doctor.Name_Doctor = ln + ", " + fn + " " + mn + " " + en

                    $scope.user.AccessRights_User = $scope.doctor.DoctorType_Doctor !== 'Student' ? 'doctor' : 'student';

                    doctorDataFactory.addDoctor($scope.doctor);
                    userDataFactory.addUser($scope.user).then(function(){
                        var user = {
                            UserName_User : $scope.user.UserName_User,
                            Password_User : $scope.user.Password_User
                        }
                        $auth.login(user).then(function(){
                            setGlobalUser($scope.user);
                            $auth.setCookie('globals',$scope.user);
                            $location.path('/profile/' + $scope.doctor.SysPK_Doctor)
                        })
                        .catch(function(response) {
                            //toastr.error(response.data.message, response.status);
                        });
                    });

                }else{
                    toastr.error("Username is already taken. Please pick another one.");
                }
            });
        };
    }
]);
