//Formula Detail schema

var mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const AutoIncrement = require('mongoose-sequence')(mongoose);

var Schema = mongoose.Schema;

var FormulaDetailSchema = new Schema(
  {
	  
    name: {type: String, required: true, maxlength: 100},
	dose:{type: number, required: true, max: 10},
	unit: {type: String, required: true, maxlength: 10},
	order:{type: number, required: true, max: 100},
	formularef: {type: Schema.Types.ObjectId, ref: 'Patient', required: true},
	formulaid: {type: Number , required: true}	
  }
);


FormulaDetailSchema.plugin(AutoIncrement, {inc_field: 'fdid'});

//Export model
module.exports = mongoose.model('FormulaDetail', FormulaDetailSchema);
