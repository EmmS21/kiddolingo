'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface UserProfile {
  id: number;
  name: string;
  age: number;
  profile_picture: string | null;
  interests: string[];
  languages: string[];
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to load user profile');
        }
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error loading user profile:', error);
        toast.error('Failed to load profile');
        router.push('/'); // Redirect to onboarding if we can't load the user
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Router will handle redirect
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Centered Profile Section */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="relative mb-4 group">
            <div className="w-32 h-32 rounded-full border-4 border-purple-200 overflow-hidden">
              {user.profile_picture ? (
                <Image
                  src={`data:image/jpeg;base64,${user.profile_picture}`}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                  <span className="text-2xl text-purple-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {/* Level Badge - Hidden on group hover */}
              <div className="absolute bottom-0 right-0 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-medium group-hover:opacity-0 transition-opacity">
                Lvl 5
              </div>
              {/* Camera Button - Only shows on group hover */}
              <button 
                className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-all opacity-0 group-hover:opacity-100"
                onClick={() => {
                  toast.success('Profile picture upload coming soon!');
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            👑 Explorer
          </div>
        </div>

        {/* Topics Grid */}
        <div className="mt-12 space-y-4">
          {user.interests.map((interest) => (
            <div 
              key={interest}
              className="p-6 bg-white rounded-lg border border-purple-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {interest === 'Anime' && '🎭'}
                  {interest === 'Science Fiction' && '🚀'}
                  <h3 className="text-xl font-semibold text-gray-900">{interest}</h3>
                </div>
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
