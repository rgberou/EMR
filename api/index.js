/**
 * Created by alain.bibera on 9/15/2015.
 */
////////// Node.JS INITIALIZATION //////////////

exports.init = function init(){
    var express   = require('express')
        , bodyParser = require('body-parser')
        , Sequelize = require('sequelize')
        , http      = require('http')
        , restful   = require('sequelize-restful')
        , logger    = require('morgan')
        , busboy    = require('connect-busboy')
        , fs        = require('fs-extra')
        , util      = require('util')
        , path      = require('path')
        , _         = require('lodash')
        , conf      = require('./config')
        , jwt       = require('jsonwebtoken')
        ,cors       = require('cors')
        , app       = express();
    var server = require('http').createServer(app);
    var io = require('socket.io').listen(server);



    var userRoutes = require('./routes/userRoutes')
        , encounterRoutes = require('./routes/encounterRoutes')
        , surgeryRoutes = require('./routes/surgeryRoutes')
        , coaRoutes = require('./routes/coaRoutes')
        , patientRoutes = require('./routes/patientRoutes')
        , doctorRoutes = require('./routes/doctorRoutes')
        , employeeRoutes = require('./routes/employeeRoutes')
        , transactionRoutes = require('./routes/transactionRoutes')
        , newsfeedRoutes = require('./routes/newsfeedRoutes')
        ,hospitalizationRoutes = require('./routes/hospitalizationRoutes')
        , userRoutes = require('./routes/userRoutes')
        , clinicRoutes = require('./routes/clinicRoutes');

    function ensureAuthenticated(req, res, next) {
        if(!req.headers.authorization) {
            return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
        }
        var token = req.headers.authorization.split(' ')[1];

        var payload = null;
        try {
            payload = jwt.decode(token, conf.secret);
        }
        catch (err) {
            return res.status(401).send({ message: err.message });
        }

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'Token has expired' });
        }
        req.user = payload.sub;
        next();
    }
    app.get('/api/getOnlineDoctors/', userRoutes.getOnlineDoctors);
    app.get('/api/users',ensureAuthenticated, userRoutes.getUsers);
    app.get('/api/getUserBySysPK/:syspk', ensureAuthenticated, userRoutes.getUserBySysPK);
    app.get('/api/getUserByUsername/:username', userRoutes.getUserByUsername);

    app.delete('/api/deleteOnlineUser/:userid', userRoutes.deleteOnlineUser);
    app.get('/api/getDPS/:syspkuser/:userright', userRoutes.getDPS)

    app.get('/api/getPatients/:syspkdoc/:syspkclinic',ensureAuthenticated, patientRoutes.getPatients);
    app.get('/api/getPatient/:syspk', ensureAuthenticated, patientRoutes.getPatientBySysPK);

    app.get('/api/doctors',ensureAuthenticated, doctorRoutes.getDoctors);

    app.get('/api/getDoctorByUserSysPK/:userSysPK',ensureAuthenticated, doctorRoutes.getDoctorByUserSysPK);

    app.get('/api/getDoctorsOfSecretary/:secPK',ensureAuthenticated, doctorRoutes.getDoctorsOfSecretary);

    app.get('/api/employees',ensureAuthenticated, employeeRoutes.getEmployees);
    app.get('/api/getEmployeeByUserSysPK/:userSysPK',ensureAuthenticated, employeeRoutes.getEmployeeByUserSysPK);

    app.get('/api/getAllNewsfeeds', ensureAuthenticated, newsfeedRoutes.getAllNewsfeeds);

    app.get('/api/getCurrentUserByUsername/:username', userRoutes.getCurrentUserByUsername);

    app.get('/api/getEncountersByDoctorNotServe/:id/:dte', ensureAuthenticated, encounterRoutes.getEncountersByDoctorNotServe);

    app.get('/api/clinics', ensureAuthenticated, clinicRoutes.getClinics);
    app.get('/api/clinics/:syspk', ensureAuthenticated, clinicRoutes.getClinicBySysPK);

    app.get('/api/getClinicsByUserSysPK/:UserId', ensureAuthenticated, clinicRoutes.getClinicByUserSysPK);
    app.get('/api/getClinicsByClinicRoomID/:clinicroomId', ensureAuthenticated, clinicRoutes.getClinicByClinicRoomID);
    app.get('/api/getClinicsOfUser/:UserId', ensureAuthenticated, clinicRoutes.getClinicOfUser);
    app.get('/api/getClinicJunctionByClinicRoomID/:ClinicroomId', ensureAuthenticated, clinicRoutes.getClinicJunctionByClinicRoomID);
    app.get('/api/getClinicJunctionByClinicAndDPSID/:ClinicId/:DPSId', ensureAuthenticated, clinicRoutes.getClinicJunctionByClinicAndDPSID);
    app.get('/api/getClinicRoomsOfUser/:dpspk', ensureAuthenticated, clinicRoutes.getClinicRoomsOfUser);
    app.get('/api/getClinicRooms', ensureAuthenticated, clinicRoutes.getClinicRooms);
    app.get('/api/getClinicRooms2', ensureAuthenticated, clinicRoutes.getClinicRooms2);
    app.get('/api/getMedicalSocieties', ensureAuthenticated, clinicRoutes.getMedicalSocieties);
    app.delete('/api/deleteClinicJunctions/:clinicroomID', ensureAuthenticated, clinicRoutes.deleteClinicJunctions);
    app.delete('/api/deleteClinicJunctionByClinicAndDPSID/:clinicID/:dpsID', ensureAuthenticated, clinicRoutes.deleteClinicJunctionByClinicAndDPSID);



    app.get('/onlineusertoken/:id', userRoutes.getToken);


    app.get('/lastPatientID', patientRoutes.lastPatientID);

    app.get('/lastDoctorID', doctorRoutes.lastDoctorID);

    app.get('/getallEncountersByDoctor/:id/:dte', ensureAuthenticated, encounterRoutes.getallEncountersByDoctor);



    app.put('/upsertHospitalizations/:id', hospitalizationRoutes.upsertHospitalizations)

    app.get('/encounters', ensureAuthenticated, encounterRoutes.allEncounters);
    app.get('/encounters/notserve', encounterRoutes.allNotServedEncounters);
    app.get('/encounters/served', encounterRoutes.allServedEncounters);

    app.get('/patientTransactions/:id', transactionRoutes.allPatientTransactions);
    app.get('/departmentTransactions/:id', transactionRoutes.getDepartmentTransaction);

    app.get('/transactions/pediatric', transactionRoutes.allTransactionPediatrics);
    app.get('/transactions/pediatric/:id', transactionRoutes.getTransactionPediatric);

    app.get('/transactions/adultmedicine', transactionRoutes.allTransactionAdultMeds);
    app.get('/transactions/adultmedicine/:id', transactionRoutes.getTransactionAdultMed);

    app.get('/coas', ensureAuthenticated, coaRoutes.allCOAs);
    app.get('/coas/:id', coaRoutes.getCOA);

    var port = process.env.PORT || 3001;
    app.use(express.static(path.join(__dirname, '../public/')));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(busboy());

    //app.use(cors())

    /* app.all('/*', function(req, res, next) {
        // CORS headers
        res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        // Set custom headers for CORS
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,Authorization');
        if (req.method == 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    }); */
    //use node-config to handle environments

    //initialize database connection using node-config
    var env = 'dev';
    var config = require('./database.json')[env];
    var password = config.password ? config.password : null;
    // initialize database connection
    var sequelize = new Sequelize(
        config.database,
        config.user,
        config.password,
        {
            dialect: config.driver,
            logging: console.log,
            define: {
                timestamps: false
            }
        }




    );

    /////////// MODELS DEFINITIONS /////////////////
    var usermodel = require('./models/users');
    var spmodel = require('./models/securitypermissions');
    var userjunctionmodel = require('./models/userjunctions');
    var doctormodel = require('./models/doctors');
    var patientmodel = require('./models/patients');
    var employeemodel = require('./models/employees');
    var clinicmodel = require('./models/clinics');
    var clinicroommodel = require('./models/clinicrooms');
    var clinicjunctionmodel = require('./models/clinicjunctions');
    var docemplmodel = require('./models/doctorempljunctions');

    var olusermodel = require('./models/onlineusers');
    var newsfeedmodel = require('./models/newsfeeds');
    var encountermodel = require('./models/encounters');
    var transactionmodel = require('./models/transactions');

    var coamodel = require('./models/coas');
    var coatypemodel = require('./models/coatypes');
    var prescriptionmodel = require('./models/prescriptions');
    var inventorymodel = require('./models/inventories');
    var ledgerinventorymodel = require('./models/ledgerinventories');
    var ledgerentrymodel = require('./models/ledgerentries');
    var icdmodel = require('./models/icd10s');
    var diagnosesmodel = require('./models/diagnoses');
    var medicalinfo = require('./models/medicalinfo');
    var departmentmodel = require('./models/departments');
    var departmentjunctionmodel = require('./models/departmentjunctions');
    var hospitalizationmodel = require('./models/hospitalizations');
    var requestmodel = require('./models/requests');


    var User = usermodel.usermodel(sequelize, Sequelize);
    var SP = spmodel.spmodel(sequelize, Sequelize);
    var UserJunction = userjunctionmodel.userjunctionmodel(sequelize, Sequelize);
    var Doctor = doctormodel.doctormodel(sequelize, Sequelize);
    var Patient = patientmodel.patientmodel(sequelize, Sequelize);
    var Employee = employeemodel.employeemodel(sequelize, Sequelize);
    var Clinic = clinicmodel.clinicmodel(sequelize, Sequelize);
    var Clinicroom = clinicroommodel.clinicroommodel(sequelize, Sequelize);
    var ClinicJunction = clinicjunctionmodel.clinicjuntionmodel(sequelize, Sequelize);
    var DocEmplJunction = docemplmodel.docemplmodel(sequelize, Sequelize);

    var OLUser = olusermodel.olusermodel(sequelize, Sequelize);
    var Newsfeed = newsfeedmodel.newsfeedmodel(sequelize, Sequelize);
    var Encounter = encountermodel.encountermodel(sequelize, Sequelize);
    var Transaction = transactionmodel.transactionmodel(sequelize, Sequelize);
    var Department = departmentmodel.departmentmodel(sequelize, Sequelize);
    var Prescription = prescriptionmodel.prescriptionmodel(sequelize, Sequelize);
    var Inventory = inventorymodel.invetorymodel(sequelize, Sequelize);
    var LedgerInventory = ledgerinventorymodel.ledgerinvetorymodel(sequelize, Sequelize);
    var LedgerEntry = ledgerentrymodel.ledgerentrymodel(sequelize, Sequelize);
    var COA = coamodel.coamodel(sequelize, Sequelize);
    var COAType = coatypemodel.coatypemodel(sequelize, Sequelize);
    var ICD = icdmodel.icdmodel(sequelize, Sequelize);
    var Diagnose = diagnosesmodel.diagnosesmodel(sequelize, Sequelize);
    var Hospitalization = hospitalizationmodel.hospitalizationmodel(sequelize, Sequelize);
    var Request = requestmodel.requestmodel(sequelize, Sequelize);

    //socket io initialization

    io.sockets.on('connection',function(socket){
        socket.on('oluser',function(data){

            io.sockets.emit('newuser',data);

        });
    })

    /*User.hasMany(OLUser, {foreignKey: 'SysFK_UserID'});
    OLUser.belongsTo(User, {foreignKey: 'SysFK_UserID'});
    io.on('connection', function(client) {
        console.log("A User has Connected");
        User.findAll({}).then(
            function(err,user){
                if(err) throw err;


                //console.log(" Connected");
                //console.log(user.AccessRights_User);
               client.emit('output',oluser);
            });
    });
    */

    /*io.on('connection', function(client) {
        console.log('Client connected...');

        client.on('disconnect',function(){
            console.log('Client disconnected...');
        })

    });*/

    //

    /////////// MAGICAL PIECE OF CODE /////////////
    app.use(restful(sequelize));
    ///////////////////////////////////////////////



    function createJWT(user) {
        console.log("im here");
        return jwt.sign(_.omit(user, 'password'), conf.secret, { expiresInMinutes: 720 });
    }

    app.post('/auth/login', function(req, res) {
        User.findAll({where: {'UserName_User' : req.body.UserName_User, 'Password_User' : req.body.Password_User}}).then(
            function(user){
                if (user.length === 0) {
                    return res.status(401).send({ message: 'Wrong username and / or password' });
                }
                else {
                    res.send({token: createJWT(user)});
                }
            });

            /*user.comparePassword(req.body.password, function(err, isMatch) {
                if (!isMatch) {
                    return res.status(401).send({ message: 'Wrong email and/or password' });
                }
                res.send({ token: createJWT(user) });
            }); */
    });

    //to upload file
    app.route('/upload').put(function (req, res, next) {
            var fstream;
            req.pipe(req.busboy);
            req.busboy.on('file', function (fieldname, file, filename) {
                console.log("Uploading: " + filename);

                //Path where image will be uploaded
                fstream = fs.createWriteStream(__dirname + '/../public/assets/img/' + filename);

                file.pipe(fstream);

                fstream.on('close', function () {
                    console.log("Upload Finished of " + filename);
                    res.redirect('back');				//where to go next
                });
            });
        });
    /////////// LAUNCH THE SERVER /////////////////
    server.listen(port);

    //var server = http.createServer(app);

    //var io = socket.init(server);

    console.log('Listening to port ' + port);
    ////////////////////////////////////////////////


};