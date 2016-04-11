/**
 * Created by kent on 1/26/2016.
 */

exports.usermodel = function users(sequelize, Sequelize){
    return sequelize.define('users', {
        Date_PM: {
            type: Sequelize.DATE,
            allowNull: true
        },
        SysPK_Sender_PM: {
            type: Sequelize.STRING,
            allowNull: true
        },
        SysFK_Receiver_PM: {
            type: Sequelize.STRING,
            allowNull: true
        },
        Message_PM: {
            type: Sequelize.STRING,
            allowNull: true
        },
        Files_PM: {
            type: Sequelize.STRING,
            allowNull: true
        }
    })
}