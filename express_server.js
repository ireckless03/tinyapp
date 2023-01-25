const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");


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

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect('/urls');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_new", templateVars)
});


app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render('urls_show',templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/${id}`);
});

app.get(`/u/:id`, (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});

app.post('/urls/:id/delete', (req, res) => {
  const shortID = req.params.id;
  delete urlDatabase[shortID];
  res.redirect('/urls');
})

app.post('/urls/:id/edit', (req, res) => {
  const shortID = req.params.id;
 // urlDatabase[shortID] = 
  res.redirect(`/urls/${shortID}/`);
})


app.post('/urls/:id/update', (req, res) => {
  console.log(req.body);
  const shortID = req.params.id;
  urlDatabase[shortID] = req.body.longURL;
  res.redirect(`/urls`);
})

app.post('/login', (req, res) => {
  console.log(req.body);
  const username = req.cookie
  res.redirect(`/urls`);
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