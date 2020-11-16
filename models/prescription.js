//Prescription schema

var mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const AutoIncrement = require('mongoose-sequence')(mongoose);

var Schema = mongoose.Schema;

var PrescriptionSchema = new Schema(
  {
	  
    name: {type: String, required: true, maxlength: 100},
	dose:{type: Number, required: true},
	unit: {type: String, required: true, maxlength: 10},
	order:{type: Number, required: true},
	consultationref: {type: Schema.Types.ObjectId, ref: 'Consultation', required: true},
	consultationid: {type: Number , required: true}	
  }
);


PrescriptionSchema.plugin(AutoIncrement, {inc_field: 'psid'});

//Export model
module.exports = mongoose.model('Prescription', PrescriptionSchema);
