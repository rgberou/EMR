/**
 * Created by kent on 3/9/2016.
 */

exports.docemplmodel = function doctorempljunctions(sequelize, Sequelize){
    return sequelize.define('doctorempljunctions', {
        id: {
            type:Sequelize.INTEGER,
            allowNull:false
        },
        SysFK_CJunc_DocSecJunc: {
            type:Sequelize.STRING,
            allowNull:false
        },
        SysFK_Empl_DocSecJunc: {
            type:Sequelize.STRING,
            allowNull:false
        }
    });
}