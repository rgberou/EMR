/**
 * Created by kent on 9/29/2015.
 */
'use strict';

app.factory('patientDataFactory',function($http){

    /** https://docs.angularjs.org/guide/providers **/
    var patientsDataFactory = {};

    patientsDataFactory.getPatients = function(syspkDoctor,clinic){
        var a = syspkDoctor ?  "/" + syspkDoctor : '/null';
        var b = clinic ? "/" + clinic : '/null';
        console.log(a + b);
        return $http.get(urlBase + '/api/getPatients' + a + b);
    };

    patientsDataFactory.getLastPatientID = function(){
        return $http.get(urlBase + '/lastPatientID');
    };

    patientsDataFactory.getPatient = function(id){
        return $http.get(urlBase + '/api/getPatient/' + id);
    };

    patientsDataFactory.addPatient = function(patient){
        return $http.post(urlBase + '/api/patients', patient);
    };

    patientsDataFactory.updatePatient = function(patient){
        return $http.put(urlBase + '/api/patients/' + patient.SysPK_Patient,patient);
    };

    patientsDataFactory.deletePatient = function(id){
        return $http.delete(urlBase + '/api/patients/' + id);
    };


    return patientsDataFactory;
});