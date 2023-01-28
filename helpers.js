//const {urlDatabase, users} = require('./express_server')
// Helper functions

// generates random ID for user
const generateRandomString = () => {
  let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  let stringLength = 6;
  let string = '';
  for (let i = 0; i < stringLength; i++) {
    let number = Math.floor(Math.random() * chars.length);
    string += chars.substring(number, number + 1);
  }
  return string;
};

// checks if logged in user owns url
const isUserOwner = (shortURL, user, urlDatabase) => {
  if (urlDatabase[shortURL].userID === user){
    return true
  }
    return false
  }

// gets user by email
const getUserByEmail = (email, users) => {
  console.log('userss',users)
  for (const user in users) {
    console.log('user',user)
    console.log('email', users[user].email)
    if (users[user].email === email) {
      return user;
    }
  }
}

// shows user only urls they've made
const urlsForUser = (userID, urlDatabase) => {
  let filteredData = {}
  for (const urls in urlDatabase) {
    if (urlDatabase[urls].userID === userID) {
      filteredData[urls] = urlDatabase[urls]
    }
  }
 return filteredData
}

module.exports = {generateRandomString, isUserOwner, getUserByEmail, urlsForUser}