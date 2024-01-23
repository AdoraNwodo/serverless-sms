import { APIGatewayEvent, APIGatewayProxyResult, SQSEvent, SQSHandler } from 'aws-lambda';
import { processSnsRequest, sendSmsMessage } from '../services/sns-service';

export const handleHttpPost: AWSLambda.Handler<APIGatewayEvent, APIGatewayProxyResult> = async (event, context) => {
    try
    {
        if (event.body !== null && typeof event.body === 'string')
        {
            const response = await processHttpRequest(event.body);
            return response;
        }
        else
        {
            return handleError('Inputs to the server are invalid');
        }
    }
    catch (error)
    {
        if (error instanceof Error)
        {
            return handleError(error.message);
        }
        else
        {
            return handleError(error);
        }
    }
};

export const handleSqsMessages: SQSHandler = async (event, context) => {
    try
    {
        for (const record of event.Records) {
            const messageBody = JSON.parse(record.body);
            const phoneNumber = messageBody.phoneNumber;
  
            await sendSmsMessage(phoneNumber, messageBody.messageBody);
        }
    }
    catch (error)
    {
      console.error('Error processing SQS messages:', error);
    }
};

async function processHttpRequest(body: string)
{
    const requestBody = JSON.parse(body);

    // Validate that phone number is not empty
    if (isNullOrEmpty(requestBody.phoneNumber))
    {
        throw new Error('Phone number should not be empty');
    }

    // Validate that message body is not empty
    if (isNullOrEmpty(requestBody.messageBody))
    {
        throw new Error('Message body should not be empty');
    }
    
    await processSnsRequest(requestBody.phoneNumber, requestBody.messageBody);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Request processed successfully' }),
    };
}

function isNullOrEmpty(value: string | null | undefined): boolean {
    return value === null || value === undefined || value.trim() === '';
}

function handleError(error: string | any) {
    console.error('Error processing HTTP request:', error);
    return {
        statusCode: 500,
        body: JSON.stringify({ 
            error: 'Internal Server Error',
            message: error
        }),
    };
}