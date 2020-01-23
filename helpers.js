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

module.exports = {getUserByEmail, emailTaken};