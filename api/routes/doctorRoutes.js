/**
 * Created by kent on 11/13/2015.
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

//model definitions
var doctormodel = require('../models/doctors');
var docemplmodel = require('../models/doctorempljunctions');
var employeemodel = require('../models/employees');

var Doctor = doctormodel.doctormodel(sequelize, Sequelize);
var DocEmplJunction = docemplmodel.docemplmodel(sequelize, Sequelize);
var Employee = employeemodel.employeemodel(sequelize, Sequelize);

//relationships
Doctor.hasMany(DocEmplJunction, {foreignKey: 'SysFK_CJunc_DocSecJunc'})
Employee.hasMany(DocEmplJunction, {foreignKey: 'SysFK_Empl_DocSecJunc'})


exports.getDoctors = function(req, res){
    Doctor.findAll({orderBy: 'Name_Doctor'}).then(
        function(doctors){
            res.jsonp(doctors);
        });
};

exports.getDoctorByUserSysPK = function(req, res){
    Doctor.findAll({where : {'SysFK_User_Doctor' : req.params.userSysPK}}).then(
        function(doctors){
            res.jsonp(doctors);
        });
};


exports.lastDoctorID = function(req, res){
    Doctor.findAll({order: 'UserPK_Doctor DESC', limit: 1}).then(
        function(doctors){
            res.jsonp(doctors);
        });
};

//jnctions of secs and docs

exports.getDoctorsOfSecretary = function(req, res){
    DocEmplJunction.findAll({where: {'SysFK_Empl_DocSecJunc' : req.params.secPK}, include: [Doctors]}).then(
        function(docempljuncs){
            res.jsonp(docempljuncs);
        }
    );
}