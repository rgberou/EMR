/**
 * Created by kent on 2/5/2016.
 */

exports.clinicmodel = function clinics(sequelize, Sequelize){
    return sequelize.define('clinics', {
        SysPK_Clinic: {
            type:Sequelize.STRING,
            allowNull:false,
            primaryKey: true
        },
        ClinicName_Clinic:{
            type: Sequelize.TEXT,
            allowNull:true
        },
        Address_Clinic: {
            type: Sequelize.TEXT,
            allowNull:true
        },
        ContactNumber_Clinic: {
            type: Sequelize.TEXT,
            allowNull:true
        },
        Module_Clinic: {
            type: Sequelize.TEXT,
            allowNull:true
        }
    });
}

