import { SNSMessage, SQSEvent } from 'aws-lambda';
import { EventData, MailEventData, MailEventDocument, MailMessageHeaders } from './interfaces';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { AttributeValue, PutItemInput, PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';
import *  as AWS from 'aws-sdk';

export class MailEventGenerator {
  private event: SQSEvent;
  private tableName: string;
  private db: DocumentClient;

  constructor(event: SQSEvent) {
    this.event = event;
    this.tableName = 'mail-events';
    this.db = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION_TEST });
  }

  static extractSnSMessageData(body) {
    const { Subject: type, Message: eventMessage } : SNSMessage = JSON.parse(body);
    return { type, eventMessage };
  }

  static extractEventData(msg): EventData {
    const eventData = JSON.parse(msg)['event-data'] as MailEventData;
    const { message, storage, timestamp, id } = eventData;
    return { message, storage, timestamp, eventId: id };
  }

  async generateDBEvents() {
    for (const record of this.event.Records) {
      const { messageId, body } = record as unknown as PutItemInputAttributeMap;
      const document: MailEventDocument = MailEventGenerator.generateMailEventDocument(messageId, body);
      const params = this.generatePutParams(document);

      try {
        await this.writeEvent(params);
      } catch (e) {
        console.error('mail-poller-write-event-to-db-error', e);
        throw e;
      }
    }
  }

  generatePutParams(document: PutItemInputAttributeMap): PutItemInput {
    return {
      TableName: this.tableName,
      Item: document,
    };
  }

  static generateMailEventDocument(id: AttributeValue, body: AttributeValue): MailEventDocument {
    const snsMessageData = MailEventGenerator.extractSnSMessageData(body);
    const { message, storage, timestamp, eventId } = MailEventGenerator.extractEventData(snsMessageData.eventMessage) as EventData;
    const headers = message.headers as MailMessageHeaders;

    return <MailEventDocument>{
      id,
      type: snsMessageData.type as AttributeValue,
      timestamp: new Date(timestamp).toISOString() as AttributeValue,
      eventId: eventId as AttributeValue,
      meta: {
        headers,
        storage: storage || { url: '' as AttributeValue, key: '' as AttributeValue },
      },
    };
  }

  async writeEvent(params: PutItemInput): Promise<object> {
    return this.db.put(params).promise();
  };
}
