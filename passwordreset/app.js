const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jwt-simple');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/forgotpassword', function (req, res) {
    res.send('<form action="/passwordreset" method="POST">' + '<input type="email" name="email" value="" placeholder="Enter your email address..." />' + '<input type="submit" value="Reset Password" />' + '</form>'
    );
});

app.post('/passwordreset', function (req, res) {
    if (req.body.email !== undefined) {
        var emailAddress = req.body.email;

        // TODO: Using email, find user from your database. 
        var payload = {
            id: 1, // User ID from database
            email: emailAddress
        };

        // TODO: Make this a one-time-use token by using the users's 
        // current password hash from the databas, and combine it
        // with the user's created date to make a very unique secret key!
        // For example:
        // var secret = user.password + '-' + user.created.getTime();
        var secret = 'fe1a1915a379f3be5394b64d14794932-1506868106675';

        var token = jwt.encode(payload, secret);

        // TODO: Send email containing link to reset password.
        // In our case, will just return a link to click.
        res.send('<a href="/resetpassword/' + payload.id + '/' + token + '"> Reset password</a>');
    } else {
        res.send('Email address is missing.');
    }
});

app.get('/resetpassword/:id/:token', function(req, res) {
    // TODO: Fetch user from database using
    // req.params.id
    // TODO: Decrypt one-time-use token using the user's
    // current password hash from the database and combine it 
    // with the user's created date to make a very unique secret key!
    // For example, 
    // var secret = user.password + '-' + user.created.getTime();
    var secret = 'fe1a1915a379f3be5394b64d14794932-1506868106675';
    var payload = jwt.decode(req.params.token, secret);

    // TODO: Gracefully handle decoding issues. 
    // Create form to reset passwrod. 
    res.send('<form action="/resetpassword" method="POST">' + 
    '<input type="hidden" name="id" value="' + payload.id + '" />' +
    '<input type="hidden" name="token" value="' + req.params.token + '" />' + 
    '<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
    '<input type="submit" value="Reset Password" />' +
    '</form>');
});
app.post('/resetpassword', function(req, res) {
    // TODO: Fetch user from database using
    // req.body.id
    // TODO: Decrypt one-time-use token using the user's
    // current password hash from the database and combining it
    // with the user's created date to make a very unique secret key!
    // For example,
    // var secret = user.password + ‘-' + user.created.getTime();
    var secret = 'fe1a1915a379f3be5394b64d14794932-1506868106675';

    var payload = jwt.decode(req.body.token, secret);

    // TODO: Gracefully handle decoding issues.
    // TODO: Hash password from
    // req.body.password
    res.send('Your password has been successfully changed.');
});

app.listen(3000, function() {
    console.log('Node started on port 3000!')
});