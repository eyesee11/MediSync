// Aadhar Authentication Service
// Mock service for demo purposes - in production this would integrate with official Aadhar APIs

interface AadharVerificationResponse {
  success: boolean;
  message: string;
  data?: {
    name: string;
    dateOfBirth: string;
    gender: string;
    address: string;
  };
}

interface OTPResponse {
  success: boolean;
  message: string;
  txnId?: string;
}

export class AadharAuthService {
  private static baseURL = '/api/auth/aadhar';

  /**
   * Send OTP to the mobile number registered with Aadhar
   */
  static async sendOTP(aadharNumber: string): Promise<OTPResponse> {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aadharNumber }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending Aadhar OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please check your connection and try again.',
      };
    }
  }

  /**
   * Verify OTP and get Aadhar details
   */
  static async verifyOTP(aadharNumber: string, otp: string): Promise<AadharVerificationResponse> {
    try {
      const response = await fetch(this.baseURL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aadharNumber, otp }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error verifying Aadhar OTP:', error);
      return {
        success: false,
        message: 'Failed to verify OTP. Please try again.',
      };
    }
  }

  /**
   * Validate Aadhar number format
   */
  static validateAadharNumber(aadharNumber: string): boolean {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadharNumber);
  }

  /**
   * Validate OTP format
   */
  static validateOTP(otp: string): boolean {
    const otpRegex = /^\d{6}$/;
    return otpRegex.test(otp);
  }
}
