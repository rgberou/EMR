/**
 * Created by kent on 2/12/2016.
 */

exports.employeemodel = function employees(sequelize, Sequelize){
    return sequelize.define('employees', {
        SysPK_Empl: {
            type:Sequelize.STRING,
            primaryKey: true,
            allowNull:false
        },SysFK_User_Empl: {
            type:Sequelize.STRING,
            allowNull:false
        },Name_Empl: {
            type:Sequelize.TEXT,
            allowNull:true
        },Address_Empl: {
            type:Sequelize.TEXT,
            allowNull:true
        },ContactNumber_Empl: {
            type:Sequelize.TEXT,
            allowNull:true
        },Position_Empl: {
            type:Sequelize.TEXT,
            allowNull:true
        },Picture_Empl: {
            type:Sequelize.TEXT,
            allowNull:true
        },IDNo_Empl: {
            type:Sequelize.TEXT,
            allowNull:true
        },LastName_Empl: {
            type:Sequelize.TEXT,
            allowNull:true
        },MiddleName_Empl: {
            type:Sequelize.TEXT,
            allowNull:true
        },FirstName_Empl: {
            type:Sequelize.TEXT,
            allowNull:true
        },ExtName_Empl: {
            type:Sequelize.TEXT,
            allowNull:true
        }
    });
}
