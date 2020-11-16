//Formula schema

var mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const AutoIncrement = require('mongoose-sequence')(mongoose);

var Schema = mongoose.Schema;

var FormulaSchema = new Schema(
  {
    name: {type: String, required: true, maxlength: 100},
  }
);


FormulaSchema.plugin(AutoIncrement, {inc_field: 'fid'});

//Export model
module.exports = mongoose.model('Formula', FormulaSchema);
