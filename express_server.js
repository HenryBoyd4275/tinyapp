
//SETUP
const express = require("express");
const cookieSession = require('cookie-session');
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const {getUserByEmail, emailTaken, generateRandomString, urlsForUser} = require('./helpers.js');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}));

//SAMPLE DATA
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca", 
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com", 
    userID: "userRandomID"
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};

//SERVER LOGIC
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    let templateVars = { user: users[req.session.user_id]};
    res.render("urls_new", templateVars);
  }
});

app.post("/urls/:shortURL/id", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    urlDatabase[req.params.shortURL].longURL = req.body.editName;
    res.redirect("/urls");
  } else {
    if (req.session.user_id) {
      res.status(400);
      res.send("you do not own a url by that ID");
    } else {
      res.status(400);
      res.send("please log in");
    }
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.send("access denied");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID) {
    if (req.session.user_id) {
      if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
        let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.session.user_id]};
        res.render("urls_show", templateVars);
      } else {
        res.status(400);
        res.status("you do not own a url by that ID");
      }
    } else {
      res.status(400);
      res.send("Plese log in");
    }
  } else {
    res.status(400);
    res.send("There is no URL with that ID");
  }
});

app.get("/urls", (req, res) => {
  if (req.session.user_id) {
    let templateVars = { urls: urlsForUser(req.session.user_id, urlDatabase), user: users[req.session.user_id]};
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.post("/urls", (req, res) => {
  if (req.session.user_id) {
    let key = generateRandomString();
    urlDatabase[key] = {longURL: req.body.longURL, userID: req.session.user_id };
    res.redirect(`/urls/${key}`);
  } else {
    res.status(400);
    res.send("please log in");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL.longURL);
  } else {
    res.status(400);
    res.send("there is no URL by that ID");
  }
});

app.get("/register", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    let templateVars = { user: users[req.session.user_id]};
    res.render("register", templateVars);
  }
});

app.post("/register", (req, res) => {
  let {email, password} = req.body;
  if (!email || !password) {
    res.status(400);
    res.send("invalid input");
  } else if (emailTaken(email, users)) {
    res.status(400);
    res.send("Email already in use");
  } else {
    password = bcrypt.hashSync(password, 10);
    let id = generateRandomString();
    users[id] = {id, email, password};
    req.session.user_id = id;
    res.redirect("/urls");
  }
});

app.get("/login", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    let templateVars = { user: users[req.session.user_id]};
    res.render("login", templateVars);
  }
});

app.post("/login", (req, res) => {
  const {email, password} = req.body;
  if (!email) {
    res.status(400);
    res.send("Please enter an Email");
  } else if (!password) {
    res.status(400);
    res.send("Please enter a password");
  }
  let currentUser = getUserByEmail(email, users);
  if (currentUser) {
    if (bcrypt.compareSync(password, currentUser.password)) {
      req.session.user_id = currentUser.id;
      res.redirect("/urls");
    } else {
      res.status(403);
      res.send("invalid password");
    }
  } else {
    res.status(403);
    res.send("That account email does not exist");
    res.redirect("/login");
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});