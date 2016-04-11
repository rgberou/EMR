/**
 * Created by kent on 2/17/2016.
 */
'use strict';

var Sequelize = require('sequelize');

var config = require('../database.json')['dev'];
var password = config.password ? config.password : null;
// initialize database connection
var sequelize = new Sequelize(
    config.database,
    config.user,
    config.password,
    {
        dialect: config.driver,
        logging: console.log,
        define: {
            timestamps: false
        }
    }
);


var employeemodel = require('../models/employees');

var Employee = employeemodel.employeemodel(sequelize, Sequelize);

//relationships

exports.getEmployees = function(req, res){
    Employee.findAll({orderBy: 'Name_Empl'}).then(
        function(employees){
            res.jsonp(employees);
        });
};

exports.getEmployeeByUserSysPK = function(req, res){
    Employee.findAll({where : {'SysFK_User_Empl' : req.params.userSysPK}}).then(
        function(employees){
            res.jsonp(employees);
        });
};
