/**
 * Refactor the code
 *  - helper functions
 *      - responses (success, fail) in ./libs/response-lib.js
 *      - dynambodb in ./libs/dynamodb-lib.js
 *  - We are also using the async/await pattern here to refactor our Lambda function. This allows us to return once we are done processing; instead of using the callback function.
 */
// import uuid from "uuid"; // “TypeError: Cannot read property ‘v1’ of undefined”
import { v1 as uuidv1 } from "uuid"; // Fix: for v7+
// import AWS from "aws-sdk";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

// const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event, context, callback) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.tableName,
    // 'Item' contains the attributes of the item to be created
    // - 'userId': user identities are federated through the
    //             Cognito Identity Pool, we will use the identity id
    //             as the user id of the authenticated user
    // - 'noteId': a unique uuid
    // - 'content': parsed from request body
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timestamp
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
    //   noteId: uuid.v1(), // “TypeError: Cannot read property ‘v1’ of undefined”
      noteId: uuidv1(), // Fix: for v7+
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };

  try {
      await dynamoDbLib.call("put", params);
      return success(params.Item);
  } catch(err) {
      return failure({status: false});
  }
}