const MobiusTrader = require('mobius-trader-api');
const express = require("express")
const path = require('path')
const app = express()
const bodyParser = require('body-parser');
const {check, validationResult } = require('express-validator')
const urlencodedParser = (bodyParser.urlencoded({ extended: false }));

const config = {
    host: 'web.stonecoinfx.com',
    port: '17008',
    brokerId: '146',
    password: 'a38c06750750',
};

var email;
var name;
var lastName;
var phone;
var password;
var withdrawPassword ;
var agentAccount = null;

app.use('/', express.static('public'));
app.use('/public', express.static('public'));


// View Engine Setup
app.set("views", path.join(__dirname))
app.set("view engine", "ejs")
app.get("/", async function(req, res){

	res.render("RegisterForm",{
		name: name,
    lastName: lastName,
    email: email,
    phone: phone,
		password: password,
		withdrawPassword: withdrawPassword    
  });
});


app.post("/CreateAccount", urlencodedParser, async function(req,res){
  const mt7 = await MobiusTrader.getInstance(config);
  res.statusCode = 200;
    email =  req.body.email;
    name = req.body.name;
    lastName = req.body.lastName;
    password = req.body.password;
    withdrawPassword = req.body.withdrawPassword;
    agentAccount;
    res.end('Hello World! I am your new NodeJS app! \n');

  try {
    // Create account
    const account = await mt7.createAccount(
      email,
      name,
      agentAccount,
      lastName
    );

/*
    // Create an account using the universal "call" method
    const account = await mt7.call('AccountCreate', {
      Name: name,
      LastName: lastName,
      Email: email,
      AgentAccount: agentAccount,
      Country: country,
      City: city,
      Phone: phone,
      State: state,
      ZipCode: zipCode,
      Address: address,
      Comment: comment,
    });
*/

    // Set trader password
    await mt7.passwordSet(account.Id, email, password);

    // Set a password for withdrawal
    await mt7.withdrawPasswordSet(account.Id, withdrawPassword);

    mt7.log(account);
  } catch (e) {
    console.error(e);
  }

});

app.listen(function(error){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);

})
