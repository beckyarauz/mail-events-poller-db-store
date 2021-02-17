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
