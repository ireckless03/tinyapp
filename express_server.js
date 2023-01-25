const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

var cookies = require("cookie-parser"); 

app.use(express.urlencoded({ extended: true }));

app.use(cookies());

const users = {
  Kilua: {
    id: 'Kilua',
    email: "Kilua@example.com",
    password: "hmmmmmmm",
  },
  Gon: {
    id: "Gon",
    email: "Gon1@example.com",
    password: "sniffsniff",
  },
};


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


const generateRandomString = () => {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var string_length = 6;
  var string = '';
  for (var i = 0; i < string_length; i++) {
    var number = Math.floor(Math.random() * chars.length);
    string += chars.substring(number, number + 1);
  }
  return string;
}

app.get("/", (req, res) => {
  return res.redirect('/urls');
});

app.get("/urls", (req, res) => {
  let loggedInUser = req.cookies.user_id
  const templateVars = {
    urls: urlDatabase, 
    user: loggedInUser 
  };
  return res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  let loggedInUser = req.cookies.user_id
  const templateVars = { 
    urls: urlDatabase, 
    user: loggedInUser 
  };
  return res.render("url_register", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  let loggedInUser = req.cookies.user_id
  const templateVars = { 
    urls: urlDatabase, 
    users: loggedInUser
  };
  return res.render("urls_new", templateVars)
});


app.get("/urls/:id", (req, res) => {
  let loggedInUser = req.cookies.user_id
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    users: loggedInUser
  };
  return res.render('urls_show',templateVars);
});

// if short url entered in path, redirect to long url
app.get(`/u/:id`, (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  return res.redirect(longURL);
});

// generate short url and save short & long to database
app.post("/urls", (req, res) => {
  console.log(req.body); 
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  return res.redirect(`/urls/${id}`);
});

// gets user id and creates a cookie, redirect to main url page
// app.post('/login', (req, res) => {
//   res.cookie('userName', req.body.userName);
//   return res.redirect(`/urls`);
// })

app.post('/logout', (req, res) => {
  res.clearCookie('userName');
  return res.redirect(`/urls`);
})

// Delete a URL, redirect to main url page
app.post('/urls/:id/delete', (req, res) => {
  const shortID = req.params.id;
  delete urlDatabase[shortID];
  return res.redirect('/urls');
})

// to eddit long url, redirects to urlshort page
app.post('/urls/:id/edit', (req, res) => {
  const shortID = req.params.id;
 // urlDatabase[shortID] = 
  return res.redirect(`/urls/${shortID}/`);
})

// after clicking submit to update url, redirect to main url page
app.post('/urls/:id/update', (req, res) => {
  console.log(req.body);
  const shortID = req.params.id;
  urlDatabase[shortID] = req.body.longURL;
  return res.redirect(`/urls`);
})

/*end point to handle the registration submission
// this endpoint should add a new user object to the global users object. THe user object should include the user's id,email and password.
// 1. To generate a random user is use the same function you use to gneerate randoom ids for urls

// after adding the user set a user_id coookie contaiing the users snewly generated id

//3 redirect the user to the urls page

// 4 test that the users object is proplerly being appendded to. You can insert a console.log or debugger prior to the redirect logic

// also test the user_id cookie is being set correctly upon redirection. You alrdy did it earlier

IN: email, password
OUT: user object containing id, email, password
*/
// email and passsword returning 
// addded random generated user id, and added email and password to users object

app.post('/register', (req, res) => {
  const newUser = { 
    user_id: generateRandomString(), 
    email: req.body.email,
    password: req.body.password
  };
  users[newUser.user_id] = newUser;
  res.cookie('user_id', newUser.user_id);
  return res.redirect(`/urls`);
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// postman and rested curl
// form tag or anchor to link to another page

// why is delete route a post request? - trying to change data in backend 
// 
// Get - request doesnt alter anything

// C
// R
// D - app.delete 