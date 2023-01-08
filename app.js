const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();


app.use(express.static("public"));

app.use(bodyparser.urlencoded({extended:true}));

//when people go to our home route, send back the signup.html page
app.get("/", function (req, res) {
res.sendFile(__dirname + "/signup.html");
})



app.post("/", function(req, res) {

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const emailAddress = req.body.emailAddress;

  const data = {
    members: [
      {
        email_address: emailAddress,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  var jsonData = JSON.stringify(data);

  const url = "https://us11.api.mailchimp.com/3.0/lists/dae79dfa24";

  const options = {
    method: "POST",
    auth: "csocash1:52c36bdc86631825064cb4dde78b89fb-us11"
  };

  const request = https.request(url, options, function(response) {

    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    }

    else {
     res.sendFile(__dirname + "/failure.html");
    }

    //picking apart the response
    response.on("data", function(data) {
      console.log(JSON.parse(data));
      console.log(response.statusCode);
    })
  })
  request.write(jsonData);
  request.end();
  //res.send("You have entered" + firstName + lastName + emailAddress);
})


// when people on the failure screen click the Try again button, send back the signup.htm page
app.post("/failure", function (req, res) {
res.redirect("/");
})

// when people on the failure screen click the Go Back to Home button, send back the signup.htm page
app.post("/success", function (req, res) {
res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log('The server has started on port 3000');
})

// API key for Mailchimp
//52c36bdc86631825064cb4dde78b89fb-us11

//Audience ID
//dae79dfa24
