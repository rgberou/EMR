/**
 * Created by kent on 2/29/2016.
 */

exports.clinicroommodel = function clinicrooms(sequelize, Sequelize){
    return sequelize.define('clinicrooms', {
        SysPK_CRoom: {
            type:Sequelize.STRING,
            allowNull:false,
            primaryKey: true
        },
        SysFK_Clinic_CRoom: {
            type:Sequelize.STRING,
            allowNull:true
        },
        RoomNumber_CRoom: {
            type: Sequelize.TEXT,
            allowNull:true
        },
        Module_CRoom: {
            type: Sequelize.TEXT,
            allowNull:true
        }
    });
}
