/**
 * Created by kent on 2/6/2016.
 */


exports.clinicjuntionmodel = function clinicjunctions(sequelize, Sequelize){
    return sequelize.define('clinicjunctions', {
        id: {
            type:Sequelize.INTEGER,
            allowNull:false
        },SysFK_Doctor_CJunc: {
            type:Sequelize.STRING,
            allowNull:true
        },SysFK_Clinic_CJunc: {
            type:Sequelize.STRING,
            allowNull:true
        },DPSTable_CJunc: {
            type:Sequelize.TEXT,
            allowNull:true
        },ClinicRoom_CJunc: {
            type:Sequelize.TEXT,
            allowNull:true
        }
    });
}