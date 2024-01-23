import { createMockSqsEvent, createMockContext} from './mocks';
import { handleSqsMessages } from '../src/lambda/function';

const mockContext = createMockContext();
const mockError = new Error("This is an error message");

jest.mock('../src/services/sns-service', () => ({
    sendSmsMessage: jest.fn(() => {
        throw mockError;
    }),
}));

describe('SQS Message Lambda Function with bad SNS Service', () => {
    test('handleSqsMessages should throw expected error', async () => {
        const mockEvent = createMockSqsEvent();
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        await handleSqsMessages(mockEvent, mockContext, () => {});
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error processing SQS messages:", mockError);
        consoleErrorSpy.mockRestore();
    });
});

jest.clearAllMocks();
