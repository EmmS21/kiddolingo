import { getSubtopics, saveSubtopics } from '@/app/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: { topicId: string } }
) {
  try {
    const topicId = decodeURIComponent(context.params.topicId);
    // Get the selected language from the URL search params
    const searchParams = request.nextUrl.searchParams;
    const targetLanguage = searchParams.get('language') || 'English';
    console.log('Target Language:', targetLanguage);
    
    const subtopics = await getSubtopics(topicId);
    
    // If we have cached subtopics, return them
    if (subtopics && subtopics.length > 0) {
      return NextResponse.json(subtopics.map(s => ({
        ...s,
        practice_words: JSON.parse(s.practice_words)
      })));
    }

    // Otherwise fetch from the backend
    const response = await fetch(`http://localhost:8000/api/topics/${topicId}/subtopics/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_age: 10, // TODO: Get from user profile
        target_language: targetLanguage
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from backend');
    }

    const newSubtopics = await response.json();
    await saveSubtopics(topicId, newSubtopics);

    return NextResponse.json(newSubtopics);
  } catch (error) {
    console.error('Error in subtopics route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subtopics' },
      { status: 500 }
    );
  }
}
