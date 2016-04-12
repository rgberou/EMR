/**
 * Created by kent on 1/26/2016.
 */

exports.usermodel = function messages(sequelize, Sequelize){
    return sequelize.define('messages', {
        SysPK_Message_PM:{
            type: Sequelize.STRING,
            allowNull: true
        },
        Date_PM: {
            type: Sequelize.DATE,
            allowNull: true
        },
        SysFK_Sender_PM: {
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
        }
    })
}