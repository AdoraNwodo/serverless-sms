import { APIGatewayProxyResult } from 'aws-lambda';
import { createMockAPIGatewayProxyEvent, createMockContext} from './mocks';
import { handleHttpPost } from '../src/lambda/function';

const mockContext = createMockContext();

jest.mock('../src/services/sns-service', () => ({
    processSnsRequest: jest.fn(() => {
        return true;
    }),
}));

describe('HTTP Handler Lambda Function with good SNS Service', () => {

    test('handleHttpPost should return expected success response', async () => {
        const mockEvent = createMockAPIGatewayProxyEvent('POST', '{"phoneNumber": "123456789", "messageBody": "Hello"}');
        const response = await handleHttpPost(mockEvent, mockContext, () => {}) as APIGatewayProxyResult;
        const responseBody = JSON.parse(response.body);
        expect(responseBody.message).toContain('Request processed successfully');
    });

    test('handleHttpPost should return expected failure response on null input', async () => {
        const mockEvent = createMockAPIGatewayProxyEvent('POST', null);
        const response = await handleHttpPost(mockEvent, mockContext, () => {}) as APIGatewayProxyResult;
        const responseBody = JSON.parse(response.body);
        expect(responseBody.message).toContain('Inputs to the server are invalid');
    });

    test('handleHttpPost should return expected failure response when theres no phone number', async () => {
        const mockEvent = createMockAPIGatewayProxyEvent('POST', '{"messageBody": "Hello"}');
        const response = await handleHttpPost(mockEvent, mockContext, () => {}) as APIGatewayProxyResult;
        const responseBody = JSON.parse(response.body);
        expect(responseBody.message).toContain('Phone number should not be empty');
    });

    test('handleHttpPost should return expected failure response when theres no message body', async () => {
        const mockEvent = createMockAPIGatewayProxyEvent('POST', '{"phoneNumber": "123456789"}');
        const response = await handleHttpPost(mockEvent, mockContext, () => {}) as APIGatewayProxyResult;
        const responseBody = JSON.parse(response.body);
        expect(responseBody.message).toContain('Message body should not be empty');
    });
});

jest.clearAllMocks();


