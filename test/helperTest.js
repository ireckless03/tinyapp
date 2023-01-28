const { assert } = require('chai');

const {isUserOwner, getUserByEmail, urlsForUser} = require('../helpers.js');

const users = {
  "Kilua": {
    id: "Kilua",
    email: "Kilua@example.com",
    password: "dd"
  },
  "Gon": {
    id: "Gon",
    email: "Gon@example.com",
    password: "HereTodayGonTomorrow"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("Kilua@example.com", users);
    const expectedUserID = "Kilua";
    assert.equal(user, expectedUserID);
  });
});



// urlsForUser Test
const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "Kilua",
  },
  s4m5xK: {
    longURL: "http://www.google.com",
    userID: "Gon",
  },
};

describe('urlsForUser', () => {
  it('should return the urls for owner', () => {
    const userUrls = urlsForUser('Kilua', urlDatabase);
    const expectedResult = {
      b2xVn2: {
        longURL: "http://www.lighthouselabs.ca",
        userID: "Kilua",
      },
    };

    assert.deepEqual(userUrls, expectedResult);
  });

  it('should return an empty object for an invalid/non existant', () => {
    const userUrls = urlsForUser('Mel', urlDatabase);
    assert.deepEqual(userUrls, {});
  });
});

describe('isUserOwner', () => {
  it('Checks if url was created by user', () => {
    const owner = isUserOwner('b2xVn2','Kilua', urlDatabase);
    const expectedResult = true;
    assert.equal(owner, expectedResult);
  });
});