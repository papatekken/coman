const i18n = require('i18n');


i18n.configure({
  // setup some locales - other locales default to en silently
  locales:['en', 'zh'],

  // where to store json files - defaults to './locales' relative to modules directory
  directory: __dirname + '/locales',
  
  defaultLocale: 'zh',
  register: global,
  // sets a custom cookie name to parse locale settings from  - defaults to NULL
  cookie: 'lang',
});


module.exports = function(req, res, next) {

  i18n.init(req, res);
  res.local('__', res.__);

  var current_locale = i18n.getLocale();

  return next();
};

module.exports.set = function(lang){
   i18n.setLocale(lang);
   
}