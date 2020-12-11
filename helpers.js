// Check if input email exists in users object
const emailExists = (email, database) => {
  for (let user in database) {
    if (database[user].email === email) return true;
  }
  return false;
};

// Return user's id associated with their email
const getUserByEmail = (email, database) => {
  for (let user in database) {
    if (database[user].email === email) return database[user].id;
  }
  return null;
};

// Return object containing only URL objects associated with user ID
const urlsForUser = (id, database) => {
  let returnObj = {};
  for (let key in database) {
    if (database[key].userID === id) {
      returnObj[key] = database[key];
    }
  }
  return returnObj;
};

module.exports = { emailExists, getUserByEmail, urlsForUser };