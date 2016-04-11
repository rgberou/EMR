/**
 * Created by kent on 2/5/2016.
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
var clinicmodel = require('../models/clinics');
var clinicroommodel = require('../models/clinicrooms');
var clinicjunctionmodel = require('../models/clinicjunctions');
var usermodel = require('../models/users');
var patientmodel = require('../models/patients');
var doctormodel = require('../models/doctors');
var employeemodel = require('../models/employees');
var docemplmodel = require('../models/doctorempljunctions');

var Clinic = clinicmodel.clinicmodel(sequelize, Sequelize);
var Clinicroom = clinicroommodel.clinicroommodel(sequelize, Sequelize);
var ClinicJunction = clinicjunctionmodel.clinicjuntionmodel(sequelize, Sequelize);
var User = usermodel.usermodel(sequelize, Sequelize);
var Patient = patientmodel.patientmodel(sequelize, Sequelize);
var Doctor = doctormodel.doctormodel(sequelize, Sequelize);
var Employee = employeemodel.employeemodel(sequelize, Sequelize);
var DocEmplJunction = docemplmodel.docemplmodel(sequelize, Sequelize);

//relationships
Clinicroom.hasMany(ClinicJunction, {foreignKey: 'SysFK_Clinic_CJunc'});
ClinicJunction.belongsTo(Clinicroom, {foreignKey: 'SysFK_Clinic_CJunc'});
Clinic.hasMany(Clinicroom, {foreignKey: 'SysFK_Clinic_CRoom'});
Clinicroom.belongsTo(Clinic, {foreignKey: 'SysFK_Clinic_CRoom'});

User.hasMany(ClinicJunction, {foreignKey: 'SysFK_Doctor_CJunc'});
ClinicJunction.belongsTo(User, {foreignKey: 'SysFK_Doctor_CJunc'});

Doctor.hasMany(ClinicJunction, {foreignKey: 'SysFK_Doctor_CJunc'});
ClinicJunction.belongsTo(Doctor, {foreignKey: 'SysFK_Doctor_CJunc'});

Employee.hasMany(ClinicJunction, {foreignKey: 'SysFK_Empl_CJunc'});
ClinicJunction.belongsTo(Employee, {foreignKey: 'SysFK_Empl_CJunc'});

Doctor.hasMany(DocEmplJunction, {foreignKey: 'SysFK_CJunc_DocSecJunc'})
DocEmplJunction.belongsTo(Doctor, {foreignKey: 'SysFK_CJunc_DocSecJunc'});

Employee.hasMany(DocEmplJunction, {foreignKey: 'SysFK_Empl_DocSecJunc'})
DocEmplJunction.belongsTo(Employee, {foreignKey: 'SysFK_Empl_DocSecJunc'});

ClinicJunction.hasMany(DocEmplJunction, {foreignKey: 'SysFK_CJunc_DocSecJunc'})
DocEmplJunction.belongsTo(ClinicJunction, {foreignKey: 'SysFK_CJunc_DocSecJunc'});

DocEmplJunction.hasOne(ClinicJunction, {foreignKey: 'SysFK_Doctor_CJunc'})
ClinicJunction.belongsTo(DocEmplJunction, {foreignKey: 'SysFK_Doctor_CJunc'});

exports.getClinics = function(req, res){
    Clinic.findAll({orderBy: 'ClinicName_Clinic'}).then(
        function(clinics){
            res.jsonp(clinics);
        });
};

exports.getClinicBySysPK = function(req, res){
    Clinic.findAll({where: {'SysPK_Clinic' : req.params.syspk}}).then(
        function(clinic){
            res.jsonp(clinic);
        });
};

exports.getClinicOfUser = function(req, res){
    var userpk = '';
    User.findAll({where: {'SysPK_User' : req.params.UserId}}).then(
        function(user){
            console.log("userpk : " + angular.toJson(user));
        });
};

exports.getClinicByUserSysPK = function(req, res){
    ClinicJunction.findAll({where: {"SysFK_Doctor_CJunc" : req.params.UserId}, include: [Clinic, User]}).then(
        function(clinics){
            res.jsonp(clinics);
        });
};

exports.getClinicByClinicRoomID = function(req, res){
    Clinicroom.findAll({where: {'SysPK_CRoom' : req.params.clinicroomId}, include: [Clinic]}).then(
        function(clinics){
            res.jsonp(clinics);
        });
};

exports.getClinicJunctionByClinicRoomID = function(req, res) {
    ClinicJunction.findAll({where: {'SysFK_Clinic_CJunc' : req.params.ClinicroomId}}).then(
        function (clinicjunctions) {
            res.jsonp(clinicjunctions);
        });
};

exports.getClinicJunctionByClinicAndDPSID = function(req, res) {
    ClinicJunction.findAll({where: {'SysFK_Clinic_CJunc' : req.params.ClinicId, "SysFK_Doctor_CJunc" : req.params.DPSId}}).then(
        function (clinicjunctions) {
            res.jsonp(clinicjunctions);
        });
};

exports.deleteClinicJunctions = function(req, res) {
    ClinicJunction.destroy({'SysFK_Clinic_CJunc' : req.params.clinicroomID}).then();
};

exports.deleteClinicJunctionByClinicAndDPSID = function(req, res) {
    ClinicJunction.destroy({'SysFK_Clinic_CJunc' : req.params.clinicID, "SysFK_Doctor_CJunc" : req.params.dpsID}).then();
};

exports.getClinicRoomsOfUser = function(req, res) {
    ClinicJunction.findAll({where: {"SysFK_Doctor_CJunc" : req.params.dpspk},
        include: [{model: Clinicroom, include:[Clinic]},
                  {model: DocEmplJunction, include: [Employee]}]}).then(
        function (clinics) {
            res.jsonp(clinics);
        });
};

/*exports.getClinicRoomsOfUser = function(req, res) {
 ClinicJunction.findAll({where: {"SysFK_Doctor_CJunc" : req.params.dpspk},
 include: [{model: Clinicroom, include:[Clinic]},
 {model: Doctor},
 {model: Employee}]}).then(
 function (clinics) {
 res.jsonp(clinics);
 });
 };*/

exports.getClinicRooms = function(req, res) {
    Clinic.findAll({where: {Module_Clinic: 'CLINIC'}, include: [Clinicroom]}).then(
        function (clinicrooms) {
            res.jsonp(clinicrooms);
        });
};

exports.getMedicalSocieties = function(req, res) {
    Clinic.findAll({where: {Module_Clinic: 'SOCIETY'}, include: [Clinicroom]}).then(
        function (clinicrooms) {
            res.jsonp(clinicrooms);
        });
};

exports.getClinicRooms2 = function(req, res) {
    Clinicroom.findAll({order: ['clinic.ClinicName_Clinic'] ,include: [Clinic]}).then(
        function (clinicrooms) {
            res.jsonp(clinicrooms);
        });
};