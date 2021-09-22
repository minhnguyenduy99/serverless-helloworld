// const mongoose = require('mongoose');  
// const UserSchema = new mongoose.Schema({  
//   name: String,
//   email: String,
//   password: String
// });
// mongoose.model('User', UserSchema);

// module.exports = mongoose.model('User');

const crypto = require("crypto");
const AWS = require("aws-sdk");
const USER_TABLE = process.env.USER_TABLE_NAME;

const dbClient = new AWS.DynamoDB.DocumentClient({
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
  secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
});

const User = {
  async register(userDto) {
    const params = {
      Item: {
        id: generateUserId(),
        ...userDto,
      },
      TableName: USER_TABLE
    };
    try {
      const result = await dbClient.put(params).promise();
      return {
        success: !result.$response.error,
        error: result.$response.error
      };
    } catch (err) {
      return {
        success: false,
        err
      };
    }
  },
  async getUsers() {
    const result = await dbClient.scan({ TableName: USER_TABLE }).promise();
    return result.Items;
  },
  async getById(userId) {
    const result = await dbClient.get({ TableName: USER_TABLE, Key: { id: userId } }).promise();
    return result.Item;
  },
  async getUserByEmail(email) {
    const params = {
      KeyConditionExpression: "email = :v1",
      ExpressionAttributeValues: {
        ":v1": email
      },
      TableName: USER_TABLE,
      IndexName: "user_email"
    }
    try {
      const result = await dbClient.query(params).promise();
      console.log(result);
      return result.Items[0];
    } catch (err) {
      console.error("error");
      return null;
    }
  }
}

function generateUserId() {
  return crypto.randomBytes(16).toString("hex");
}

module.exports = User;