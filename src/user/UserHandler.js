const User = require('./User');

/**
 * Functions
 */

module.exports.getUsers = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return User.getUsers()
    .then(users => ({
      statusCode: 200,
      body: JSON.stringify(users)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ message: err.message })
    }));
};

/**
 * Helpers
 */