import { AttributeValue, BinarySetAttributeValue, PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';

export interface MailMessageHeaders extends BinarySetAttributeValue {
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
  storage?: StorageObject;
}

export interface StorageObject {
  url: AttributeValue;
  key: AttributeValue;
}

export interface MetaData extends AttributeValue {
  headers: MailMessageHeaders;
  storage: StorageObject
}

export interface EventData {
  message: {
    headers: MailMessageHeaders
  };
  storage?: StorageObject;
  timestamp: number;
  eventId: string;
}

export interface MailEventDocument extends PutItemInputAttributeMap {
  eventId: AttributeValue;
  meta: MetaData;
  id: AttributeValue;
  type: AttributeValue;
  timestamp: AttributeValue
}
