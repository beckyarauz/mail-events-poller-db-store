import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';

import * as AWS from 'aws-sdk';

const stepfunction = new AWS.StepFunctions();

interface StateMachineParams {
  input: string;
  stateMachineArn: string;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  event['event-data'].event = event['event-data'].event.toLowerCase();

  const params: StateMachineParams = {
    input: JSON.stringify(event),
    stateMachineArn: process.env.STATE_MACHINE_ARN || '',
  }

  let response;

  try {
    const result = await stepfunction.startExecution(params).promise();

    response = {
      statusCode: 200,
      body: result,
    };
  } catch (e) {
    console.error(e.message);
    response = {
      statusCode: 500,
      body: 'Something went wrong',
    };
  }

  return response;
}
