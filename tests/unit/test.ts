import 'mocha';
import { handler } from '../../src/app';
import { expect } from 'chai';
import * as AWSMock from 'aws-sdk-mock';
import * as snsEvent from '../data/snsMessage.json';
import * as sqsEvent from '../data/sqsEvent.json';
import * as unsubscribedEvent from '../data/unsubcribed.json';

describe('Mail State Executer Function', async () => {
  let sqsEventObject;
  let snsEventObject;
  before(() => {
    snsEventObject = JSON.parse(JSON.stringify(snsEvent));
    snsEventObject.Message = JSON.stringify(unsubscribedEvent);
    sqsEventObject = JSON.parse(JSON.stringify(sqsEvent));
    sqsEventObject.Records[0].body = JSON.stringify(snsEventObject);

    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params) => {
      expect(params).to.have.property('TableName', 'mail-events');
      expect(params.Item).to.have.property('id', sqsEventObject.Records[0].messageId);
      expect(params.Item).to.have.property('type', snsEventObject.Subject);
      expect(params.Item).to.have.property('eventId', unsubscribedEvent['event-data'].id);
      expect(params.Item.meta).to.eql({
        headers: unsubscribedEvent['event-data'].message.headers,
        storage: undefined
      });
      return Promise.resolve({});
    });
  })

  it('should return accepted response', async () => {
    const result = await handler(sqsEventObject);
    expect(result).to.equal(`Successfully processed 1 messages.`);
  });

  after(() => {
    AWSMock.restore('DynamoDB');
  })
});
