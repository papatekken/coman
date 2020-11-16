//Consultation schema

var mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const AutoIncrement = require('mongoose-sequence')(mongoose);

var Schema = mongoose.Schema;

var ConsultationSchema = new Schema(
  {
	datetimeConsult:{type: Date},
	chiefComplaint:{type: String, required: true, maxlength:1000},
	symptom:{type: String, required: true, maxlength:1000},
    amount: {type: Number, max: 10000},
	remarks: {type: String, maxlength: 500},
	patientref: {type: Schema.Types.ObjectId, ref: 'Patient', required: true},
	patientid: {type: Number , required: true}
	
  }
);

// Virtual for consultation's URL
ConsultationSchema
.virtual('url')
.get(function () {
  return '/consultation/' + this._id;
});

ConsultationSchema.plugin(AutoIncrement, {inc_field: 'cid'});

//Export model
module.exports = mongoose.model('Consultation', ConsultationSchema);


