var Consultation = require('../models/consultation');
var Medicine = require('../models/medicine');
var Patient = require('../models/patient');
var Prescription = require('../models/prescription');

const { check,body,validationResult } = require('express-validator');
var async = require('async');



//for backend to add new consultation record
exports.consultationAddProcess = [
	
    // Convert the genre to an array
    (req, res, next) => {
        next();
    },
   
    // Validate fields.
    body('dateConsult', __('Consultation date must not be empty.')).trim().isLength({ min: 1 }),
	body('chiefComplaint', __('Chief complaint must not be empty.')).trim().isLength({ min: 1 }),
	body('symptom', __('Symptom must not be empty.')).trim().isLength({ min: 1 }),
    body('amount', __('Charge amount must not be empty.')).trim().isLength({ min: 1 }),
    

    // Sanitize fields.
	check('chiefComplaint').escape(),
	check('symptom').escape(),
    check('amount').escape(),
	check('remarks').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
		
		async.parallel({
			 medicine: function(callback) {
				 Medicine.find({}).exec(callback);
			},		

		}, function(err, results) {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

		
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
			res.render('ConsultationDetail', { outTitle:0,consultation:req.body, errors: errors.array(),medicine: results.medicine , prescription: JSON.parse(req.body.prescription),dataSource:1 } );		
            return;
        }
        else {

			async.series({
				 patientLookup: function(callback) {
					 Patient.find({"_id": req.params.pid},callback);
				},		
			}, function(err, results) {
				if (err) { return next(err);}
				// Create a consultation object
				var consultation = new Consultation(
				  { datetimeConsult: req.body.dateConsult + ' ' + req.body.hourConsult+':'+req.body.minuteConsult,
				    chiefComplaint: req.body.chiefComplaint,
					symptom: req.body.symptom,
					amount: req.body.amount,
					remarks: req.body.remarks,
					patientref: req.params.pid,
					patientid: results.patientLookup[0].pid
				   });
				   
				//check any prescription come back from the page
				if(IsJsonString(req.body.prescription))
					var prescriptionlist = JSON.parse(req.body.prescription);
				else
					var prescriptionlist = null;
					
				consultation.save(function (err) {
					if (err) { return next(err);}
					Prescription.deleteMany({ consultationid: consultation.cid }, function(err, result) {
						if (err) { return next(err);}
						
						//save prescription one by one
						async.eachSeries(prescriptionlist, function(pItem, asyncdone) {
						  var prescription= new Prescription(
						  {  name: pItem.name,
							dose:pItem.dose,
							unit: pItem.unit,
							order:-1,
							consultationref: consultation._id,
							consultationid:  consultation.cid
						  });
						   prescription.save(asyncdone);
						}, function(err) {
						  if (err) { return next(err); }
						  res.redirect(consultation.url);
						});							
					  });
				});							
			});		
        }			
		});

    }
];

//for backend to update existing consultation record
exports.consultationUpdate = [
	
    // Convert the genre to an array
    (req, res, next) => {
        next();
    },
   
    // Validate fields.
    body('dateConsult', __('Consultation date must not be empty.')).trim().isLength({ min: 1 }),
	body('chiefComplaint', __('Chief complaint must not be empty.')).trim().isLength({ min: 1 }),
	body('symptom', __('Symptom must not be empty.')).trim().isLength({ min: 1 }),
    body('amount', __('Charge amount must not be empty.')).trim().isLength({ min: 1 }),

    // Sanitize fields.
	check('chiefComplaint').escape(),
	check('symptom').escape(),
    check('amount').escape(),
	check('remarks').escape(),
	
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
		
			async.parallel({
				 medicine: function(callback) {
					 Medicine.find({}).exec(callback);
				},		
				prescription: function(callback){
					Prescription.find({"consultationref": req.params.id}).select('name dose unit -_id').exec(callback);
				},

			}, function(err, results) {
				var consultation = new Consultation(
				  { datetimeConsult: req.body.dateConsult + ' ' + req.body.hourConsult+':'+req.body.minuteConsult,
					chiefComplaint: req.body.chiefComplaint,
					symptom: req.body.symptom,
					amount: req.body.amount,
					remarks: req.body.remarks,
					_id:req.params.id //This is required, or a new ID will be assigned!
				   });
						   
				if (!errors.isEmpty()) {
					// There are errors. Render form again with sanitized values/error messages.
					res.render('ConsultationDetail', { outTitle:req.body.cid ,consultation: req.body, errors: errors.array(),medicine: results.medicine , prescription:req.body.prescription,dataSource:1} );		
					return;
				}
				else {
					//check if any prescription come from page
					if(IsJsonString(req.body.prescription))
						var prescriptionlist = JSON.parse(req.body.prescription);
					else
						var prescriptionlist = null;			
					// Data from form is valid. Update the record.
					Consultation.findByIdAndUpdate(req.params.id, consultation, {new: true}, function (err,updatedConsultation) {
						if (err) { return next(err); }
						//clear existing prescription
						Prescription.deleteMany({ consultationid: updatedConsultation.cid }, function(err, result) {
								if (err) { return next(err);}
								//save all updated prescription one by one again
								async.each(prescriptionlist, function(pItem, asyncdone) {
								  var prescription= new Prescription(
								  { name: pItem.name,
									dose:pItem.dose,
									unit: pItem.unit,
									order:-1,
									consultationref: updatedConsultation._id,
									consultationid:  updatedConsultation.cid
								  });
								prescription.save(asyncdone);
							   }, function(err) {
								if (err) { return next(err); }
								async.parallel({
									prescriptionNew: function(callback){
										Prescription.find({"consultationref": req.params.id}).select('name dose unit -_id').exec(callback);
									},

								}, function(err, results2) {								
									if (err) { return next(err); }
									res.render('ConsultationDetail', { outTitle:req.body.cid ,consultation: req.body, medicine: results.medicine , prescription: "["+results2.prescriptionNew+"]" , errors: [{ value: '', msg: __('Record updated'), param: '', location: 'body' }] } );		
								})								
								
							});							
						  });				
						});
				}				
			});				
    }
];

//load consultation detail and render the detail page
exports.consultationDetail = function(req, res,next) {   
	async.parallel({
        consultation: function(callback) {
			Consultation.find({"_id": req.params.id})
              .exec(callback);
        },
		 medicine: function(callback) {
			 Medicine.find({}).exec(callback);
		},		
		prescription: function(callback){
			Prescription.find({"consultationref": req.params.id}).select('name dose unit -_id').exec(callback);
		},
		
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.consultation==null) { // No results.
            var err = new Error('Consultation not found');
            err.status = 404;
            return next(err);
        }
		
	
        // Successful, so render.
        res.render('ConsultationDetail', { outTitle:results.consultation[0].cid ,consultation: results.consultation[0],medicine: results.medicine, prescription: "["+results.prescription+"]"} );		
	});


};


//render page for add new consultation record
exports.consultationAdd = function(req, res,next) {   
    async.parallel({
		 medicine: function(callback) {
			 Medicine.find({}).exec(callback);
		},		
    }, function(err, results) {
		res.render('ConsultationDetail', { outTitle:0,medicine: results.medicine} );		
    });
};


//function to check string is JSON or not 
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

