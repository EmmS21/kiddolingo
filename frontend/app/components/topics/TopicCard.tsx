'use client';

import { useState } from 'react';
import { TopicCardProps } from '../../lib/types';
import { ProgressBar } from './ProgressBar';
import { SubtopicsList } from './SubtopicsList';
import LoadingSpinner from '../ui/LoadingSpinner';

export function TopicCard({ topic, xpPoints }: TopicCardProps) {
  const [subtopics, setSubtopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleExpand = async () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    
    // Only fetch if expanding and we don't have subtopics yet
    if (newExpanded && subtopics.length === 0) {
      setLoading(true);
      try {
        const response = await fetch(`/api/topics/${topic.id}/subtopics`);
        if (!response.ok) throw new Error('Failed to fetch subtopics');
        const data = await response.json();
        setSubtopics(data);
      } catch (error) {
        console.error('Failed to fetch subtopics:', error);
        // Optionally show an error message to the user
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={handleExpand}
      >
        <div>
          <h3 className="text-xl font-semibold">{topic.title}</h3>
          <ProgressBar progress={topic.progress} className="mt-2 w-64" />
        </div>
        <div className="bg-purple-100 px-3 py-1 rounded-full">
          {xpPoints} XP
        </div>
      </div>
      
      {expanded && (
        <div className="mt-4">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <SubtopicsList subtopics={subtopics} />
          )}
        </div>
      )}
    </div>
  );
}
