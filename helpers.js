//HELPER FUNCTIONS FOR EXPRESS_SERVER.JS

const getUserByEmail = function(email, database) {
  for (let element in database) {
    if (database[element].email === email) {
      return database[element];
    }
  }
};

const emailTaken = function(email, database) {
  for (let element in database) {
    if (email === database[element].email) {
      return true;
    }
  }
  return false;
};

const generateRandomString = function() {
  //returns a random-ish 6 character string
  let result = '';
  let chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  while (result.length < 6) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

const urlsForUser = function(id, database) {
  let result = {};
  for (let element in database) {
    if (database[element].userID === id) {
      result[element] = database[element];
    }
  }
  console.log(result)
  return result;
};

module.exports = {getUserByEmail, emailTaken, generateRandomString, urlsForUser};