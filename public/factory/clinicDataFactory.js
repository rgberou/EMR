/**
 * Created by kent on 2/5/2016.
 */

'use strict';

app.factory('clinicDataFactory',function($http){
    /** https://docs.angularjs.org/guide/providers **/
    var clinicsDataFactory = {};

    clinicsDataFactory.getClinics = function(){
        return $http.get(urlBase + '/api/clinics');
    };
    clinicsDataFactory.getClinicBySysPK = function(id){
        return $http.get(urlBase + '/api/clinics/' + id);
    };

    clinicsDataFactory.addClinic = function(clinic){
        return $http.post(urlBase + '/api/clinics', clinic);
    };

    clinicsDataFactory.updateClinic = function(clinic){
        return $http.put(urlBase + '/api/clinics/' + clinic.SysPK_Clinic,clinic);
    };

    clinicsDataFactory.deleteClinic = function(id){
        return $http.delete(urlBase + '/api/clinics/' + id);
    };

    clinicsDataFactory.getClinicByUserSysPK = function(usersyspk){
        return $http.get(urlBase + '/api/getClinicsByUserSysPK/' + usersyspk);
    };

    clinicsDataFactory.getClinicByClinicRoomID = function(clinicroomID){
        return $http.get(urlBase + '/api/getClinicsByClinicRoomID/' + clinicroomID);
    };

    clinicsDataFactory.getClinicsOfUser = function(usersyspk){
        return $http.get(urlBase + '/api/getClinicsOfUser/' + usersyspk);
    };

    //clinic junction
    clinicsDataFactory.addClinicJunction = function(clinicjunction){
        return $http.post(urlBase + '/api/clinicjunctions', clinicjunction);
    };

    clinicsDataFactory.deleteClinicJunctions = function(clinicroomID){
        return $http.delete(urlBase + '/api/deleteClinicJunctions/' + clinicroomID);
    };

    clinicsDataFactory.deleteClinicJunctionByClinicAndDPSID = function(clinicID,dpsID){
        return $http.delete(urlBase + '/api/deleteClinicJunctionByClinicAndDPSID/' + clinicID + '/' + dpsID);
    };

    clinicsDataFactory.updateClinicJunction = function(clinicjunction){
        return $http.put(urlBase + '/api/clinicjunctions/' + clinicjunction.id,clinicjunction);
    };

    clinicsDataFactory.getClinicJunctionsByClinicRoomID = function(clinicroomID){
        return $http.get(urlBase + '/api/getClinicJunctionByClinicRoomID/' + clinicroomID);
    };

    clinicsDataFactory.getClinicJunctionsByClinicAndDPSID = function(clinicID, dpsID){
        return $http.get(urlBase + '/api/getClinicJunctionByClinicAndDPSID/' + clinicID +'/' + dpsID);
    };

    clinicsDataFactory.getClinicRoomsOfUser = function(dpspk){
        return $http.get(urlBase + '/api/getClinicRoomsOfUser/' + dpspk);
    }

    clinicsDataFactory.getClinicRooms = function(){
        return $http.get(urlBase + '/api/getClinicRooms');
    }
    clinicsDataFactory.getClinicRooms2 = function(){
        return $http.get(urlBase + '/api/getClinicRooms2');
    }

    clinicsDataFactory.addClinicRoom = function(clinicroom){
        console.log("clinic room: " + clinicroom);
        return $http.post(urlBase + '/api/clinicrooms', clinicroom);
    };

    //Society

    clinicsDataFactory.getMedicalSocieties = function(){
        return $http.get(urlBase + '/api/getMedicalSocieties');
    }

    return clinicsDataFactory;
});