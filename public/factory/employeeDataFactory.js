/**
 * Created by kent on 2/17/2016.
 */
'use strict';

app.factory('employeeDataFactory',function($http){

    /** https://docs.angularjs.org/guide/providers **/
    var employeesDataFactory = {};

    employeesDataFactory.getEmployees = function(){
        return $http.get(urlBase + '/api/employees');
    };

    employeesDataFactory.getEmployee = function(id){
        return $http.get(urlBase + '/api/employees/' + id);
    };

    employeesDataFactory.getEmployeeByUserSysPK = function(id){
        return $http.get(urlBase + '/api/getEmployeeByUserSysPK/' + id);
    };

    employeesDataFactory.addEmployee = function(employee){
        return $http.post(urlBase + '/api/employees', employee);
    };

    employeesDataFactory.updateEmployee = function(employee){
        return $http.put(urlBase + '/api/employees/' + employee.SysPK_Empl,employee);
    };

    employeesDataFactory.deleteEmployee = function(id){
        return $http.delete(urlBase + '/api/employees/' + id);
    };

    return employeesDataFactory;
});
