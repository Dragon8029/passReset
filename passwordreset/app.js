var jwt = require('jwt-simple');

var payload = { userId: 1 };
var secret = 'fe1a1915a379f3be5394b64d14794932';
var token = jwt.encode(payload, secret);

console.log(token);

var decode = jwt.decode(token, secret);

console.log(decode);