import { NextResponse } from 'next/server';
import { addUserLanguage, getUser } from '../../../lib/db';

export async function POST(request: Request) {
  try {
    const { language } = await request.json();
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    await addUserLanguage(user.id, language);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding language:', error);
    return NextResponse.json(
      { error: 'Failed to add language' },
      { status: 500 }
    );
  }
}
