import { APIGatewayProxyResult } from 'aws-lambda';
import { createMockAPIGatewayProxyEvent, createMockContext} from './mocks';
import { handleHttpPost } from '../src/lambda/function';

const mockContext = createMockContext();

jest.mock('../src/services/sns-service', () => ({
    processSnsRequest: jest.fn(() => {
        throw new Error("This is an error message");
    }),
}));

describe('HTTP Handler Lambda Function with bad SNS Service', () => {
    test('handleHttpPost should return expected failure response on error', async () => {
        const mockEvent = createMockAPIGatewayProxyEvent('POST', '{"phoneNumber": "123456789", "messageBody": "Hello"}');
        const response = await handleHttpPost(mockEvent, mockContext, () => {}) as APIGatewayProxyResult;
        const responseBody = JSON.parse(response.body);
        expect(responseBody.message).toContain('This is an error message');
    });
});

jest.clearAllMocks();
