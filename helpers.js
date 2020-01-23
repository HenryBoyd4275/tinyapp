const getUserByEmail = function (email, database) {  
  // console.log(database);
  for (element in database) {
    if (database[element].email === email) {
      // console.log(database[element])
      return database[element];
    }
  }
}

const emailTaken = function (email, database) {
  for (element in database) {
    if (email === database[element].email) {
      return true;
    }
  }
  return false;
}

module.exports = {getUserByEmail, emailTaken};