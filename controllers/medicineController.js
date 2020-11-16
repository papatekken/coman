var Medicine = require('../models/medicine');
const { body,validationResult} = require('express-validator');
var async = require('async');



//for backend to add new medicine record
exports.medicineAddProcess = [
	
    // Convert the genre to an array
    (req, res, next) => {
        next();
    },
   
    // Validate fields.
    body('dateConsult', 'Medicine date must not be empty.').trim().isLength({ min: 1 }),
    body('timeConsult', 'Medicine time must not be empty.').trim().isLength({ min: 1 }),
    body('amount', 'amount must not be empty.').trim().isLength({ min: 1 }),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
		
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
			res.render('MedicineDetail', { title:"Add new Medicine",medicine:req.body, errors: errors.array() } );		
            return;
        }
        else {

			async.series({
				 patientLookup: function(callback) {
					 Patient.find({"_id": req.params.pid},callback);
				},		
			}, function(err, results) {
				if (err) { return next(err);}
				// Create a medicine object
	
				var medicine = new Medicine(
				  { dateConsult: req.body.dateConsult,
					timeConsult: req.body.timeConsult,
					amount: req.body.amount,
					patientref: req.params.pid,
					patientid: results.patientLookup[0].pid
				   });
					medicine.save(function (err) {
						if (err) { return next(err);}
						
						// Successful - redirect to new author record.
						res.redirect(medicine.url);
					});							
								
				
			});		
			


        }
    }
];

//for backend to update existing medicine record
exports.medicineUpdate = [
	
    // Convert the genre to an array
    (req, res, next) => {
        next();
    },
   
    // Validate fields.
    body('dateConsult', 'Medicine date must not be empty.').trim().isLength({ min: 1 }),
    body('timeConsult', 'Medicine time must not be empty.').trim().isLength({ min: 1 }),
    body('amount', 'amount must not be empty.').trim().isLength({ min: 1 }),
    

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a medicine object
        var medicine = new Medicine(
          { dateConsult: req.body.dateConsult,
            timeConsult: req.body.timeConsult,
            amount: req.body.amount,
            _id:req.params.id //This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
			res.render('MedicineDetail', { title:"Medicine No." +medicine[0].cid ,medicine: medicine[0], errors: errors.array() } );		
            return;
        }
        else {
            // Data from form is valid. Update the record.
			Medicine.findByIdAndUpdate(req.params.id, medicine, {}, function (err,thebook) {
                if (err) { return next(err); }
                res.redirect(thebook.url);
                });
        }
    }
];

//load medicine detail and render the page
exports.medicineDetail = function(req, res,next) {   
	async.parallel({
        medicine: function(callback) {
			Medicine.find({})
              .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Successful, so render.
        res.render('MedicineDetail', { medicineList: results.medicine} );		
	});


};

//render page for add new medicine record
exports.medicineAdd = function(req, res,next) {   
        // Successful, so render.
        res.render('MedicineDetail', { title:"Add new Medicine" } );		
};
