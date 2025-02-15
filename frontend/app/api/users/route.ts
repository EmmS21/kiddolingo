import { NextResponse } from 'next/server';
import { saveUserData, getUser } from '../../lib/db';
import type { UserData } from '../../lib/types';

export async function POST(request: Request) {
  try {
    const userData: UserData = await request.json();
    const userId = await saveUserData(userData);
    
    return NextResponse.json({ userId });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Failed to save user data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userData = await getUser();
    
    if (!userData) {
      return NextResponse.json(
        { error: 'No user found' },
        { status: 404 }
      );
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
