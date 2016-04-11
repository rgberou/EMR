/**
 * Created by alain.bibera on 9/22/2015.
 */
'use strict';

app.factory('userDataFactory',function($http){
    /** https://docs.angularjs.org/guide/providers **/
    //console.log('Inside user data factory ');
    var usersDataFactory = {};

    usersDataFactory.addUser = function(user){
        return $http.post(urlBase + '/api/users', user);
    };

    usersDataFactory.getUsers = function(){
        return $http.get(urlBase + '/api/users/');
    };

    usersDataFactory.getUserBySysPK = function(syspk){
        return $http.get(urlBase + '/api/getUserBySysPK/' +syspk);
    };

    usersDataFactory.getUserByUsername = function(username){
        return $http.get(urlBase + '/api/getUserByUsername/' +username);
    };

    usersDataFactory.updateUser = function(user){
        return $http.put(urlBase + '/api/users/' + user.SysPK_User,user);
    };

    usersDataFactory.deleteUser = function(id){
        return $http.delete(urlBase + '/api/users/' + id);
    };

    //to get data of Doctor or Patient or Employee by syspk_user
    usersDataFactory.getDPS = function(syspkuser,userright){
        return $http.get(urlBase + '/api/getDPS/' + syspkuser + '/' + userright);
    }

    return usersDataFactory;
});