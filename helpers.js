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

// Check if input url exists in URL database
const urlExists = (url, database) => {
  if (Object.keys(database).includes(url)) return true;
  return false;
};

// Check if user owns url
const userOwnsURL = (id, url, database) => {
  const userURLs = urlsForUser(id, database);
  if (urlExists(url, userURLs)) return true;
  return false;
};

module.exports = { emailExists, getUserByEmail, urlsForUser, urlExists, userOwnsURL };