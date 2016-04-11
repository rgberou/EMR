/**
 * Created by kent on 12/11/2015.
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
var patientmodel = require('../models/patients');
var hospitalizationmodel = require('../models/hospitalizations');

var Patient = patientmodel.patientmodel(sequelize, Sequelize);
var Hospitalization = hospitalizationmodel.hospitalizationmodel(sequelize, Sequelize);

//relationships
Patient.hasMany(Hospitalization, {foreignKey: 'SysFK_Patient_Hospitalization'});
Hospitalization.belongsTo(Patient, {foreignKey: 'SysFK_Patient_Hospitalization'});

/////upadted
exports.upsertHospitalizations = function(req, res){
    console.log("Data : " + req.body + " Res : " + res.body)
    //Hospitalization.upsert({where: {'Doctor.SysPK_Doctor' : req.params.id, 'IsServed_Encounter' : 0, 'Date_Encounter' : req.params.dte}, include: [Patient, Doctor]}).then(
      //  function(encounters){
        //    res.jsonp(encounters);
        //});
};