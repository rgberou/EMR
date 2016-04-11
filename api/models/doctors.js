/**
 * Created by kent on 10/9/2015.
 */

exports.doctormodel = function doctors(sequelize, Sequelize){
    return sequelize.define('doctors', {
        SysPK_Doctor: {
            type:Sequelize.STRING,
            allowNull:false,
            primaryKey: true
        },
        SysFK_User_Doctor: {
            type:Sequelize.STRING,
            allowNull:false
        },
        IDNumber_Doctor:{
            type: Sequelize.TEXT,
            allowNull:true
        },
        Name_Doctor: {
            type: Sequelize.TEXT,
            allowNull:true
        },
        Address_Doctor: {
            type: Sequelize.TEXT,
            allowNull:true
        },
        License_Doctor: {
            type: Sequelize.TEXT,
            allowNull:true
        },
        PTR_Doctor: {
            type: Sequelize.TEXT,
            allowNull:true
        },
        Specialization_Doctor: {
            type: Sequelize.TEXT,
            allowNull: false,
            foreignKey: true
        },
        S2_Doctor: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        HomePhone_Doctor: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        OfficePhone_Doctor: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        BusinessPhone_Doctor: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        ContactNumber_Doctor: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Picture_Doctor: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        FirstName_Doctor: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        MiddleName_Doctor: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        LastName_Doctor: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        ExtensionName_Doctor: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Birthdate_Doctor: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Status_Doctor: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        School_Doctor: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        SchoolID_Doctor: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        TrainingInstitution_Doctor: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        EmaiAdd_Doctor: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Gender_Doctor: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        DoctorType_Doctor: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        SchoolAddress_Doctor: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    });
}
