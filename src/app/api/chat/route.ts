import { NextRequest, NextResponse } from 'next/server';
import { patientChat } from '@/ai/flows/patient-chat-flow';

export async function POST(request: NextRequest) {
  try {
    const { message, location } = await request.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Prepare input for the AI flow
    const input = {
      query: message.trim(),
      latitude: location?.lat,
      longitude: location?.lng,
    };

    // Call the patient chat flow
    const response = await patientChat(input);

    return NextResponse.json({
      message: response.response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Return a safe fallback response
    return NextResponse.json({
      message: "I apologize, but I'm experiencing technical difficulties right now. For immediate medical concerns, please contact your healthcare provider or emergency services. You can try asking your question again in a moment.",
      timestamp: new Date().toISOString(),
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
