import {
  SQSEvent,
  SNSMessage,
} from 'aws-lambda';
import * as AWS from 'aws-sdk';

export interface MailMessageHeaders {
  ['message-id']: string;
  to?: string;
  from?: string;
  subject?: string;
}

export interface MailEventData {
  id: string;
  timestamp: number;
  event: string;
  message: {
    headers: MailMessageHeaders
  };
  storage?: {
    url: string;
    key: string;
  };
}

export interface MailEventDocument {
  id: string;
  type: string;
  timestamp: string;
  eventId: string;
  meta: {
    headers: MailMessageHeaders;
    storage?: {
      url: string;
      key: string;
    };
  },
}

const db = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });

const writeEvent = (data: MailEventDocument): Promise<object> => {
  const params = {
    TableName: 'mail-events',
    Item: data,
  };

  return db.put(params).promise();
};

export const handler = async (
  event: SQSEvent
): Promise<string> => {
  console.log('Records Received: ', event);
  for (const { messageId: id, body } of event.Records) {
    const { Subject: type, Message: eventMessage } : SNSMessage = JSON.parse(body);
    const eventData: MailEventData = JSON.parse(eventMessage)['event-data'];
    const { message, storage, timestamp } = eventData;

    const params: MailEventDocument = {
      id,
      type,
      timestamp: new Date(timestamp).toISOString(),
      eventId: eventData.id,
      meta: {
        headers: message.headers,
        storage
      },
    };

    try {
      await writeEvent(params);
    } catch (e) {
      console.error('write-event-to-db-error', e);
      throw e;
    }
  }

  return `Successfully processed ${event.Records.length} messages.`;
}
