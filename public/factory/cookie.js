/**
 * Created by kent on 2/5/2016.
 */

'use strict';

app.factory('Cookie',function($cookieStore){

    var Cookies = {};

    Cookies.setCookie = function(cookieName, data){
        $cookieStore.put(cookieName, data);
    };

    Cookies.getCookie = function(cookieName){
      $cookieStore.get(cookieName);
    };

    Cookies.removeCookie = function(cookieName){
      $cookieStore.remove(cookieName);
    };

    return Cookies;

})