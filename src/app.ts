import {
  SQSEvent,
} from 'aws-lambda';
import { MailEventGenerator } from './MailEventGenerator';

export const handler = async (
  event: SQSEvent
): Promise<string> => {
  console.log('mail-poller-event-received:', event);
  await new MailEventGenerator(event).generateDBEvents();

  return `Successfully processed ${event.Records.length} messages.`;
}
