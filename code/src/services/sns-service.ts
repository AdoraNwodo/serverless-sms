import { SNS } from 'aws-sdk';

const sns = new SNS();

export const processSnsRequest = async (phoneNumber: string, messageBody: string) => {
    await sns.publish({
        TopicArn: process.env.SNS_TOPIC_ARN,
        Message: JSON.stringify({ phoneNumber, messageBody }),
    }).promise();
};

export const sendSmsMessage = async (phoneNumber: string, messageBody: string) => {
  await sns.publish({
    PhoneNumber: phoneNumber,
    Message: messageBody,
  }).promise();
};