// This is pretty much the same as our get.js except we only pass in the userId in the DynamoDB query call.
import * as dynamoDbLib from './libs/dynamodb-lib.js';
import { success, failure } from './libs/response-lib.js';

export async function main(event, context){
    const params = {
        TableName: process.env.tableName,
        // 'KeyConditionExpression' defines the condition for the query
        // - 'userId = :userId': only return items with matching 'userId'
        //   partition key
        // 'ExpressionAttributeValues' defines the value in the condition
        // - ':userId': defines 'userId' to be Identity Pool identity id
        //   of the authenticated user
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": event.requestContext.identity.cognitoIdentityId
        }
    };

    try {
        const result = await dynamoDbLib.call('query', params);
        // Return the matching list of items in the response body
        return success(result.Items);
    } catch(e) {
        return failure({status: false});
    }
}