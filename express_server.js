//TODO
/*
  What would happen if a client requests a non-existent shortURL?
  What happens to the urlDatabase when the server is restarted?
  What type of status code do our redirects have? What does this status code mean?
  valid URL check from edit
  give buttons some class
  order server functions more properly
*/


const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; // default port 8080

const generateRandomString = function () {
  //returns a random-ish 6 character string
  let result = '';
  let chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  while (result.length < 6) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  console.log(result);
  return result;
}

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  //"test" : "http://www.example.com"
};

app.post("/login", (req, res) => {
  res.cookie("username", req.body.user);
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
})

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/id", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.editName;
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  // console.log(`delete ${req.params.shortURL}`)
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  let key = generateRandomString();
  urlDatabase[key] = req.body.longURL;
  res.redirect(`/urls/${key}`);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
