import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { identifier, otp } = await req.json();

    if (!identifier || !otp) {
      return NextResponse.json(
        { error: 'Email/mobile and OTP are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');

    const isEmail = identifier.includes('@');

    let user;
    if (isEmail) {
      user = await usersCollection.findOne({ 'Email ID': identifier });
    } else {
      const mobileNumber = parseInt(identifier);
      user = await usersCollection.findOne({ 'Mobile': mobileNumber });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.otp || !user.otpExpiry) {
      return NextResponse.json(
        { error: 'No OTP found. Please request a new OTP.' },
        { status: 400 }
      );
    }

    if (new Date() > new Date(user.otpExpiry)) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new OTP.' },
        { status: 400 }
      );
    }

    if (user.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      );
    }

    await usersCollection.updateOne(
      { _id: user._id },
      {
        $unset: { otp: '', otpExpiry: '' }
      }
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user['Full Name'],
        email: user['Email ID'],
        mobile: user['Mobile'],
        registrationNumber: user['Registration Number'],
        certUrl: user['cert_url']
      }
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
