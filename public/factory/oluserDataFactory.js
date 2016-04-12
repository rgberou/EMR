/**
 * Created by kent on 11/26/2015.
 */

'use strict';

app.factory('oluserDataFactory',function($http, $auth){
    /** https://docs.angularjs.org/guide/providers **/
    var olusersDataFactory = {};
    var token = $auth.getToken();
    olusersDataFactory.addOLUser = function(oluser){
        return $http.post(urlBase + '/api/onlineusers', oluser);
    };

    olusersDataFactory.updateOLUser = function(oluser){
        return $http.put(urlBase + '/api/onlineusers/' + oluser.SysPK_OLUser,oluser);
    };

    olusersDataFactory.getOLUsers = function(){
        return $http.get(urlBase + '/api/onlineusers');
    };

    olusersDataFactory.getCurrentUserByUserName = function(username){
        return $http.get(urlBase + '/api/getCurrentUserByUsername/' + username);
    };

    olusersDataFactory.getOLUserToken = function(){
        return $http.get(urlBase + '/onlineusertoken/' + $auth.getToken());
    };

    /*olusersDataFactory.deleteOLUser = function(token){
        return $http.delete(urlBase + '/api/deleteOnlineUser/' + token);
    };*/

    olusersDataFactory.deleteOLUser = function(userid){
        return $http.delete(urlBase + '/api/deleteOnlineUser/' + userid);
    };

    return olusersDataFactory;
});
