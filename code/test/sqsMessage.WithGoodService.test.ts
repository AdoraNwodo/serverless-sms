import { createMockSqsEvent, createMockContext} from './mocks';
import { handleSqsMessages } from '../src/lambda/function';
import { SQSBatchResponse } from 'aws-lambda';

const mockContext = createMockContext();

jest.mock('../src/services/sns-service', () => ({
    sendSmsMessage: jest.fn(() => {
        return true;
    }),
}));

describe('SQS Message Lambda Function with good SNS Service', () => {
    test('handleSqsMessages should succeed and not throw any error', async () => {
        const mockEvent = createMockSqsEvent();
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        const sqsBatchResponse = await handleSqsMessages(mockEvent, mockContext, () => {}) as SQSBatchResponse;
        expect(consoleErrorSpy).not.toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });
});

jest.clearAllMocks();
