//Patient schema

var mongoose = require('mongoose');
var async = require('async');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const AutoIncrement = require('mongoose-sequence')(mongoose);
var Consultation = require('../models/consultation');

var Schema = mongoose.Schema;

var PatientSchema = new Schema(
  {
    cName: {type: String, maxlength: 100},
    eName: {type: String, maxlength: 100},
	idDocNo:{type: String,maxlength:100},
	gender:{type:String, maxlength:1},
    dob : { type : Date },
	age: {type: Number, max: 120},
	phone: {type: String, maxlength: 100},
	email: {type: String, maxlength: 100},
	address: {type: String, maxlength: 150},
	occupation: {type: String, maxlength: 100},
	referral: {type: String, maxlength: 100},
	remarks: {type: String, maxlength: 500},
	archive:{type:Number, max:1}
	
  }
);

// Virtual for Patient's URL
PatientSchema
.virtual('url')
.get(function () {
  return '/patient/' + this._id;
});

//get 
PatientSchema
.virtual('consultationCount',{
  ref: 'Consultation', // The model to use
  localField: 'pid', // Find people where `localField`
  foreignField: 'patientid', // is equal to `foreignField`
  count: true // And only get the number of docs
});


PatientSchema
.virtual('LastConsultation',{
  ref: 'Consultation', // The model to use
  localField: 'pid', // Find people where `localField`
  foreignField: 'patientid', // is equal to `foreignField`
  options: { sort: { datetimeConsult: 'desc' } }
  
});





PatientSchema.plugin(AutoIncrement, {inc_field: 'pid'});

PatientSchema
    .set('toObject', { getters: true });
//Export model
module.exports = mongoose.model('Patient', PatientSchema);
