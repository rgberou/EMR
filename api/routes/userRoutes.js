/**
 * Created by kent on 11/11/2015.
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
var usermodel = require('../models/users');
var olusermodel = require('../models/onlineusers');
var doctormodel = require('../models/doctors');
var patientmodel = require('../models/patients');
var employeemodel = require('../models/employees');

var User = usermodel.usermodel(sequelize, Sequelize);
var OLUser = olusermodel.olusermodel(sequelize, Sequelize);
var Doctor = doctormodel.doctormodel(sequelize, Sequelize);
var Patient = patientmodel.patientmodel(sequelize, Sequelize);
var Employee = employeemodel.employeemodel(sequelize, Sequelize);

//relationships
User.hasMany(OLUser, {foreignKey: 'SysFK_UserID'});
OLUser.belongsTo(User, {foreignKey: 'SysFK_UserID'});

exports.getOnlineDoctors = function(req, res){
    OLUser.findAll({include: [{model:User,where: {AccessRights_User:'doctor'}}]}).then(
        function(users){
            if(users){
                res.jsonp(users);
            }else{
                res.jsonp({success:false});
            }

        });
};;
exports.getUsers = function(req, res){
    User.findAll({}).then(
        function(users){
            res.jsonp(users);
        });
};


exports.getUserByUsername = function(req, res) {
    User.findAll({where: {'UserName_User' : req.params.username}}).then(
        function (user) {
            res.jsonp(user)
        });
}

exports.getUserBySysPK = function(req, res) {
    User.findAll({where: {'SysPK_User' : req.params.syspk}}).then(
        function (user) {
            res.jsonp(user)
        });
}

exports.getCurrentUserByUsername = function(req, res) {
    OLUser.findAll({where: {'UserName_OLUser' : req.params.username}}).then(
        function (olusers) {
            res.jsonp(olusers)
        });
}

exports.getToken = function(req, res) {
    OLUser.findAll({where: {'Token_OLUser' : req.params.id}}).then(
        function (olusers) {
            res.jsonp(olusers)
        });
}

exports.deleteOnlineUser = function(req, res) {
    //OLUser.destroy({'Token_OLUser' : req.params.token}).then();
    OLUser.destroy({'SysFK_UserID' : req.params.userid}).then();
}

//to get DPS data


exports.getDPS = function(req, res) {
    if(req.params.userright === 'doctor'){
        Doctor.findAll({where: {'SysFK_User_Doctor' : req.params.syspkuser}}).then(
            function(dps){
                res.jsonp(dps);
            });
    }
    if(req.params.userright === 'patient'){
        Patient.findAll({where: {'SysFK_User_Patient' : req.params.syspkuser}}).then(
            function(dps){
                res.jsonp(dps);
            });
    }
    if(req.params.userright === 'secretary'){
        Employee.findAll({where: {'SysFK_User_Empl' : req.params.syspkuser}}).then(
            function(dps){
                console.log("dps : " + dps.data);
                res.jsonp(dps);
            });
    }
}