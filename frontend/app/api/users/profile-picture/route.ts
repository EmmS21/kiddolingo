import { NextResponse } from 'next/server';
import { updateProfilePicture, getUser } from '../../../lib/db';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    console.log('Image buffer size:', buffer.length);

    // Get the user directly from the database
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update profile picture in database
    await updateProfilePicture(user.id, buffer);

    // Verify the update
    const updatedUser = await getUser();
    console.log('Updated profile picture size:', updatedUser?.profile_picture?.length);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return NextResponse.json(
      { error: 'Failed to upload profile picture' },
      { status: 500 }
    );
  }
}
