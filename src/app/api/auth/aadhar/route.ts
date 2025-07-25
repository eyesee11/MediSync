import { NextRequest, NextResponse } from 'next/server';

// Mock Aadhar OTP API
// In production, this would integrate with the actual Aadhar authentication service

export async function POST(request: NextRequest) {
  try {
    const { aadharNumber } = await request.json();

    // Validate Aadhar number format
    const aadharRegex = /^\d{12}$/;
    if (!aadharRegex.test(aadharNumber)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid Aadhar number format. Please enter a 12-digit number.' 
        },
        { status: 400 }
      );
    }

    // Mock implementation - in production, you would:
    // 1. Call the official Aadhar authentication API
    // 2. Handle the response and transaction ID
    // 3. Store the transaction details temporarily
    
    const mockTxnId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your registered mobile number',
      txnId: mockTxnId
    });

  } catch (error) {
    console.error('Aadhar OTP API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send OTP. Please try again.' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { aadharNumber, otp, txnId } = await request.json();

    // Validate inputs
    const aadharRegex = /^\d{12}$/;
    const otpRegex = /^\d{6}$/;

    if (!aadharRegex.test(aadharNumber)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid Aadhar number format.' 
        },
        { status: 400 }
      );
    }

    if (!otpRegex.test(otp)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid OTP format. Please enter a 6-digit OTP.' 
        },
        { status: 400 }
      );
    }

    // Mock OTP verification - in production, you would:
    // 1. Call the official Aadhar verification API
    // 2. Verify the OTP with the transaction ID
    // 3. Return user details if verification is successful

    // For demo purposes, accept OTP "123456"
    if (otp !== "123456") {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid OTP. For demo, use 123456.' 
        },
        { status: 400 }
      );
    }

    // Mock user data that would come from Aadhar API
    const mockUserData = {
      aadharNumber,
      name: `User ${aadharNumber.slice(-4)}`,
      verified: true
    };

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      userData: mockUserData
    });

  } catch (error) {
    console.error('Aadhar verification API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to verify OTP. Please try again.' 
      },
      { status: 500 }
    );
  }
}
