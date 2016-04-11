/**
 * Created by kent on 10/27/2015.
 */

'use strict';
app.factory('junctionDataFactory',function($http){
    /** https://docs.angularjs.org/guide/providers **/
    var junctionsDataFactory = {};

    //department
    junctionsDataFactory.getDepartmentJunctions = function(){
        return $http.get(urlBase + '/api/departmentjunctions');
    };

    junctionsDataFactory.addDepartmentJunction = function(departmentjunction){
        return $http.post(urlBase + '/api/departmentjunctions', departmentjunction);
    };

    junctionsDataFactory.updateDepartmentJunction = function(departmentjunction){
        return $http.put(urlBase + '/api/departmentjunctions/' + departmentjunction.SysPK_Department,departmentjunction);
    };

    junctionsDataFactory.getDepartmentJunction = function(id){
        return $http.get(urlBase + '/api/departmentjunctions/' + id);
    };

    junctionsDataFactory.deleteDepartmentJunction = function(id){
        return $http.delete(urlBase + '/api/departmentjunctions/' + id);
    };

    //Doctor Secretary Junctions
    junctionsDataFactory.addDocSecJunction = function(docsecjunc){
        return $http.post(urlBase + '/api/doctorempljunctions', docsecjunc)
    }

    junctionsDataFactory.deleteDocSecJunction = function(id){
        return $http.delete(urlBase + '/api/doctorempljunctions/' + id);
    };


    return junctionsDataFactory;
});

