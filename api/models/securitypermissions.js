/**
 * Created by kent on 3/21/2016.
 */

exports.spmodel = function securitypermissions(sequelize, Sequelize){
    return sequelize.define('securitypermissions', {
        SysPK_SP: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        SysFK_User_SP: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Webpage_SP: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Rights_SP: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    })
};