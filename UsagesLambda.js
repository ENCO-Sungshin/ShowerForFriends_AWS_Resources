/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_USAGETABLE_ARN
	STORAGE_USAGETABLE_NAME
	STORAGE_USAGETABLE_STREAMARN
Amplify Params - DO NOT EDIT */

/*exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  }, 
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
*/

'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function listItems(){
  const params = {
        TableName : 'UsageTable-dev'
        
};
  try {
    const data = await docClient.scan(params).promise();
    return data;
  } catch (err) {
    return err;
  }
}
async function getItem(event){
    const params = {
        TableName: "UsageTable-dev",
        KeyConditionExpression: "#user_id = :uid",
        ExpressionAttributeNames: {
            "#user_id": "user_id"
        },
        ExpressionAttributeValues: {
            ":uid": JSON.parse(event.body).user_id
        }

    };
    
    try {
        const data = await docClient.query(params).promise(); /*.get(params).promise();*/
        return data;
    } catch (err) {
        return err;
    }
}
async function updateItem(event){
    /*const params = {
        TableName: 'UsageTable-dev',
        Key: {
            "user_id" : JSON.parse(event.body).user_id
        },
        UpdateExpression: "set display_id = :d",
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
    }*/
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
        case 'POST':
            try {
                const data = await getItem(event);
                return { body: JSON.stringify(data)};
            } catch (err) {
                return { error: err};
            }
        case 'PUT':
            try {
                const data = await updateItem(event);
                return { body: JSON.stringify(data)};
            } catch (err) {
                return { error: err};
            }
    }
    // // TODO implement
    // const response = {
    //     statusCode: 200,
    // //  Uncomment below to enable CORS requests
    // //  headers: {
    // //      "Access-Control-Allow-Origin": "*",
    // //      "Access-Control-Allow-Headers": "*"
    // //  }, 
    //     body: JSON.stringify('Hello from Lambda!'),
    // };
    // return response;
};
