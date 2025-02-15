import { NextResponse } from 'next/server';
import { saveUserData } from '../../lib/db';
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
