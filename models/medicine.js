//Medicine schema

var mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


var Schema = mongoose.Schema;

var MedicineSchema = new Schema(
  {
    name: {type: String, required: true, maxlength: 100},
	defaultUnit:{type: String, required: true, maxlength: 10}
  }
);


//Export model
module.exports = mongoose.model('Medicine', MedicineSchema);
