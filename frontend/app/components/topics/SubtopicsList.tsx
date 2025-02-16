'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';
import { PracticeWord } from '@/app/lib/types';
import { VoiceChat } from '../chat/VoiceChat';

interface Subtopic {
  id: string;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  is_completed: boolean;
  practice_words: PracticeWord[];
}

interface SubtopicsListProps {
  topicId: string;
  isVisible: boolean;
  selectedLanguage: string;
  mainTopic: string;
  userAge: number;
}

export function SubtopicsList({ topicId, isVisible, selectedLanguage, mainTopic, userAge }: SubtopicsListProps) {
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubtopics() {
      if (!isVisible) return;
      
      try {
        // Get userId from localStorage (set during onboarding)
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('User not found');
          return;
        }

        const response = await fetch(`/api/topics/${encodeURIComponent(topicId)}/subtopics?language=${encodeURIComponent(selectedLanguage)}`);
        if (!response.ok) throw new Error('Failed to fetch subtopics');
        
        const data = await response.json();
        setSubtopics(data);
      } catch (err) {
        console.error('Error fetching subtopics:', err);
        setError('Failed to load subtopics');
      } finally {
        setLoading(false);
      }
    }

    if (isVisible) {
      fetchSubtopics();
    }
  }, [topicId, isVisible, selectedLanguage]);

  const handleStartChat = (subtopicId: string) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No user ID found');
      return;
    }

    console.log('handleStartChat called with:', {
      userId,
      subtopicId,
      currentActiveChat: activeChat,
      selectedLanguage,
      mainTopic: topicId, // Use topicId instead of mainTopic
      userAge
    });
    
    setActiveChat(subtopicId);
  };

  console.log('SubtopicsList render:', {
    subtopics,
    activeChat,
    isVisible
  });

  if (!isVisible) return null;
  
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="mt-4 space-y-4">
      {subtopics.map((subtopic) => (
        <div
          key={subtopic.id}
          className="p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">{subtopic.title}</h4>
              <span className="text-sm text-purple-600">
                {subtopic.difficulty.charAt(0) + subtopic.difficulty.slice(1).toLowerCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {subtopic.is_completed ? (
                <span className="text-green-600">✓ Completed</span>
              ) : (
                <button
                  onClick={() => {
                    console.log('Button clicked!');
                    handleStartChat(subtopic.id);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    Start Chat
                    <svg 
                      className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  </span>
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-2">
            <h5 className="text-sm font-medium text-gray-700 mb-1">Practice Words:</h5>
            <div className="flex flex-wrap gap-2">
              {subtopic.practice_words.map((word, index) => (
                <div
                  key={index}
                  className="px-3 py-1 bg-white rounded-full text-sm text-gray-700"
                >
                  {word.original} = {word.translation}
                </div>
              ))}
            </div>
          </div>

          {activeChat === subtopic.id && (
            <div className="mt-4 border-t pt-4">
              <VoiceChat
                language={selectedLanguage}
                topic={topicId}
                userAge={Number(localStorage.getItem('userAge'))}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
