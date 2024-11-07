// app/api/sendMessage/route.js
import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export async function POST(request) {
  try {
    // Parse the request body
    const { to, message } = await request.json();

    // Send an SMS using the Twilio client
    const twilioResponse = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to,
    });

    // Return a success response with the message SID
    return NextResponse.json({ success: true, sid: twilioResponse.sid });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
