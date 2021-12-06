'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function listItems(){
  const params = {
        TableName : 'UsersTable-dev'
    };
  try {
    const data = await docClient.scan(params).promise();
    return data;
  } catch (err) {
    return err;
  }
}
async function createUser(event){//회원가입 시 유저 정보 넣기
    const params = {
        TableName : 'UsersTable-dev',
        Item: {
            user_id: JSON.parse(event.body).user_id,
            user_name: JSON.parse(event.body).user_name,
            user_email: JSON.parse(event.body).user_email,
            user_height: 0,
            user_weight: 0,
            user_hair: 0,
            display_id:null
        }
    };
    try {
        const data = await docClient.put(params).promise();
        return data;
    } catch (err) {
        return err;
    }
}
async function updateUserInfo(event){
    const params = {
        TableName: 'UsersTable-dev',
        Key: {
            "user_id" : JSON.parse(event.body).user_id
        },
        UpdateExpression: "set user_hair = :ha, user_height = :he, user_weight = :w",
        ExpressionAttributeValues: {
            ":ha" : JSON.parse(event.body).user_hair,
            ":he" : JSON.parse(event.body).user_height,
            ":w" : JSON.parse(event.body).user_weight
        },
        ReturnValues: "UPDATED_NEW"
    };
    try {
        const data = await docClient.update(params).promise();
        return data;
    } catch (err) {
        return err;
    }
}
exports.handler = async (event) => {
    const operation = event.httpMethod;
    switch(operation){
        case 'GET':
           try {
                const data = await listItems();
                return { body: JSON.stringify(data) };
            } catch (err) {
                return { error: err};
            }
        case 'POST'://create user
            try {
                const data = await createUser(event);
                return { body: JSON.stringify(data)};
            } catch (err) {
                return { error: err};
            }
        case 'PUT'://update user info
            try {
                const data = await updateUserInfo(event);
                return { body: JSON.stringify(data)};
            } catch (err) {
                return { error: err};
            }
    }
};
