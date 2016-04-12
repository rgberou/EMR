/**
 * Created by Rg on 4/12/2016.
 */
'use strict';

app.factory('messageDataFactory',function($http, $auth){
    /** https://docs.angularjs.org/guide/providers **/
    olusersDataFactory.getMessage = function(senderid,receiverid){
        return $http.get(urlBase + '/api/getmessage/'+senderid+'/'+receiverid);
    };
    olusersDataFactory.sendMessage = function(message){
        return $http.get(urlBase + '/api/messages',message);
    };
    return olusersDataFactory;
});
