var express = require('express');
var router = express.Router();
var patientController = require('../controllers/patientController');
var consultationController = require('../controllers/consultationController');
var medicineController = require('../controllers/medicineController');
var i18n = require('../i18n');

//handle change locale
router.get('*', function(req, res, next) {
  var url = require('url');
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  if(query['lng']=="en"||query['lng']=="zh"){
	i18n.set(query['lng']);
	res.redirect('/');
  }else
	next();
});







//default goto patient page
router.get('/', patientController.index);  
router.get('/patient', patientController.index);
router.get('/patient/search', patientController.search);

router.get('/patient/add', patientController.patientAdd);
router.post('/patient/add', patientController.patientAddProcess);

router.get('/patient/:id', patientController.patientDetail);
router.post('/patient/:id', patientController.patientUpdate);


router.get('/consultation/add/:pid', consultationController.consultationAdd);
router.post('/consultation/add/:pid', consultationController.consultationAddProcess);

router.get('/consultation/:id', consultationController.consultationDetail);
router.post('/consultation/:id', consultationController.consultationUpdate);

router.get('/patient', patientController.index);

router.get('/medicine', medicineController.medicineDetail);

router.get('/setting',function (req, res) {res.render('setting');});  
	
module.exports = router;
