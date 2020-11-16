var Patient = require('../models/patient');
var Consultation = require('../models/consultation');

const { body,check, validationResult, oneOf} = require('express-validator');


var async = require('async');

//for backend to add new patient record
exports.patientAddProcess = [
	
    // Convert the genre to an array
    (req, res, next) => {
        next();
    },
   
    // Validate fields.
	oneOf([
			body('cname').trim().isLength({ min: 1 }),
			body('ename').trim().isLength({ min: 1 })
			],__('Either Chinese Name or English Name need to be filled'))
    ,
	
	oneOf([
			body('dob').isDate(),
			body('dob').trim().isLength({ max: 0 })
			],__('Date of birth is an invalid date'))
	,    

    // Sanitize fields.
    check('cname').escape(),
    check('ename').escape(),
    check('idDocNo').escape(),
	check('gender').escape(),
	check('phone').escape(),
	check('email').escape(),
	check('address').escape(),
	check('occupation').escape(),
	check('referral').escape(),
	check('remarks').escape(),
	
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
			res.render('PatientDetail', { outTitle:0,patient:req.body, errors: errors.array() } );		
            return;
        }
        else {

        // Create a patient object with escaped/trimmed data
        var patient = new Patient(
          { eName: req.body.ename,
            cName: req.body.cname,
            idDocNo: req.body.idDocNo,
			gender: req.body.gender,
			phone: req.body.phone,
			email: req.body.email,
			dob: (req.body.dob==''?null:new Date(req.body.dob)),
			age: req.body.age,			
			address: req.body.address,			
			occupation: req.body.occupation,	
			referral: req.body.referral,	
			remarks: req.body.remarks,
           });
			
			patient.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(patient.url);
            });			

        }
    }
];

//for backend to update existing patient record
exports.patientUpdate = [
	
    // Convert the genre to an array
    (req, res, next) => {
        next();
    },
   
    // Validate fields.
	oneOf([
			body('cname').trim().isLength({ min: 1 }),
			body('ename').trim().isLength({ min: 1 })
			],__('Either Chinese Name or English Name need to be filled'))
    ,
	
	oneOf([
			body('dob').isDate(),
			body('dob').trim().isLength({ max: 0 })
			],__('Date of birth is an invalid date'))	
	,    

    // Sanitize fields.
    check('cname').escape(),
    check('ename').escape(),
    check('idDocNo').escape(),
	check('gender').escape(),
	check('phone').escape(),
	check('email').escape(),
	check('address').escape(),
	check('occupation').escape(),
	check('referral').escape(),
	check('remarks').escape(),
	
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        // Create a patient object with escaped/trimmed data and old id.
        var patient = new Patient(
          { eName: req.body.ename,
            cName: req.body.cname,
            idDocNo: req.body.idDocNo,
			gender: req.body.gender,
			phone: req.body.phone,
			email: req.body.email,
			dob: new Date(req.body.dob),
			age: req.body.age,			
			address: req.body.address,			
			occupation: req.body.occupation,	
			referral: req.body.referral,	
			remarks: req.body.remarks,	
            _id:req.params.id //This is required, or a new ID will be assigned!
           });
		   
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
			res.render('PatientDetail', { outTitle:req.body.pid ,patient: patient, errors: errors.array() } );		
            return;
        }
        else {
            // Data from form is valid. Update the record.
			Patient.findByIdAndUpdate(req.params.id, patient, {}, function (err,thepatient) {
                if (err) { return next(err); } 
                res.render('PatientDetail', { outTitle:req.body.pid ,patient: patient, errors: [{ value: '', msg: __('Record updated'), param: '', location: 'body' }] } );		
                });
        }
    }
];

//render search page with patient count only
exports.index = function(req, res) {   
    async.parallel({
        patient_count: function(callback) {
            Patient.countDocuments({}, callback); // find all documents of this collection
        },

    }, function(err, results) {
        res.render('index', { error: err, data: results });
    });

};

//render search page with patient count and search result
exports.search = function(req, res,next) {   
	
	
    async.parallel({
        patient_count: function(callback) {
            Patient.countDocuments({}, callback); // find all documents of this collection
        },		
		 patientList: function(callback) {
			 //Patient.find({"eName": {$regex: ".*"+req.query.FindString, $options:"i"}}).populate('consultationCount').populate('LastConsultation').exec(callback);
			Patient.find({$or:[{"eName": {$regex: ".*"+req.query.FindString, $options:"i"}},{"cName": {$regex: ".*"+req.query.FindString, $options:"i"}}]}).populate('consultationCount').populate('LastConsultation').exec(callback);			 
		},		

    }, function(err, results) {
		
        res.render('index', { error: err, data: results, findString:req.query.FindString, action:'FIND'});
    });

};

//load patient detail and render the patient detail page
exports.patientDetail = function(req, res,next) {   
	async.parallel({
        patient: function(callback) {
			Patient.find({"_id": req.params.id})
              .exec(callback);
        },
        consultation: function(callback) {
			Consultation.find({"patientref": req.params.id})
              .exec(callback);
        },		
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.patient==null) { // No results.
            var err = new Error(__('Patient not found'));
            err.status = 404;
            return next(err);
        }
		
		
        // Successful, so render.
        res.render('PatientDetail', { outTitle:results.patient[0].pid ,patient: results.patient[0], consultationList: results.consultation} );		
	});

};


//render page for add new patient record
exports.patientAdd = function(req, res,next) {   
        // Successful, so render.
        res.render('PatientDetail', { outTitle:0 } );		
};

