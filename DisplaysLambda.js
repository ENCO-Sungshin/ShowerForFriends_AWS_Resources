'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function powerDisplay(event){
    const params = {
        TableName: 'DisplaysTable-dev',
        Key: {
            "display_id" : JSON.parse(event.body).display_id
        },
        UpdateExpression: "set power = :p, user_id = :ui",
        ExpressionAttributeValues: {
            ":p" : JSON.parse(event.body).power,
            ":ui": JSON.parse(event.body).user_id
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

async function updateDisplay(event){
    const params = {
        TableName: 'UsersTable-dev',
        Key: {
            "user_id" : JSON.parse(event.body).user_id
        },
        UpdateExpression: "set display_id=:d",
        ExpressionAttributeValues: {
            ":d" : JSON.parse(event.body).display_id
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
        case 'POST':
            try {
                const data = await powerDisplay(event);
                return { body: JSON.stringify(data)};
            } catch (err) {
                return { error: err};
            }
        case 'PUT':
            try {
                const data = await updateDisplay(event);
                return { body: JSON.stringify(data)};
            } catch (err) {
                return { error: err};
            }
    }

};
