define("src/interfaces", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/app", ["require", "exports", "aws-sdk"], function (require, exports, AWS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.handler = void 0;
    const db = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });
    const writeEvent = (data) => {
        const params = {
            TableName: 'mail-events',
            Item: data,
        };
        return db.put(params).promise();
    };
    const handler = async (event) => {
        console.log('Records Received: ', event);
        for (const { messageId: id, body } of event.Records) {
            const { Subject: type, Message: eventMessage } = JSON.parse(body);
            const eventData = JSON.parse(eventMessage)['event-data'];
            const { message, storage, timestamp } = eventData;
            const params = {
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
            }
            catch (e) {
                console.error('write-event-to-db-error', e);
                throw e;
            }
        }
        return `Successfully processed ${event.Records.length} messages.`;
    };
    exports.handler = handler;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW50ZXJmYWNlcy50cyIsIi4uL3NyYy9hcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7SUNPQSxNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztJQUUvRSxNQUFNLFVBQVUsR0FBRyxDQUFDLElBQXVCLEVBQW1CLEVBQUU7UUFDOUQsTUFBTSxNQUFNLEdBQUc7WUFDYixTQUFTLEVBQUUsYUFBYTtZQUN4QixJQUFJLEVBQUUsSUFBSTtTQUNYLENBQUM7UUFFRixPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbEMsQ0FBQyxDQUFDO0lBRUssTUFBTSxPQUFPLEdBQUcsS0FBSyxFQUMxQixLQUFlLEVBQ0UsRUFBRTtRQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLEtBQUssTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRTtZQUNuRCxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0UsTUFBTSxTQUFTLEdBQWtCLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDeEUsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEdBQUcsU0FBUyxDQUFDO1lBRWxELE1BQU0sTUFBTSxHQUFzQjtnQkFDaEMsRUFBRTtnQkFDRixJQUFJO2dCQUNKLFNBQVMsRUFBRSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLEVBQUU7Z0JBQzVDLE9BQU8sRUFBRSxTQUFTLENBQUMsRUFBRTtnQkFDckIsSUFBSSxFQUFFO29CQUNKLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztvQkFDeEIsT0FBTztpQkFDUjthQUNGLENBQUM7WUFFRixJQUFJO2dCQUNGLE1BQU0sVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzFCO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDNUMsTUFBTSxDQUFDLENBQUM7YUFDVDtTQUNGO1FBRUQsT0FBTywwQkFBMEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLFlBQVksQ0FBQztJQUNwRSxDQUFDLENBQUE7SUE3QlksUUFBQSxPQUFPLFdBNkJuQiJ9