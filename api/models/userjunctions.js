/**
 * Created by kent on 2/12/2016.
 */

exports.userjunctionmodel = function userjunctions(sequelize, Sequelize){
    return sequelize.define('userjunctions', {
        SysFK_User_UJunc: {
            type:Sequelize.STRING,
            allowNull:false
        },SysFK_DPS_UJunc: {
            type:Sequelize.STRING,
            allowNull:false
        },Module_UJunc: {
            type:Sequelize.TEXT,
            allowNull:false
        }
    });
}