'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { INTEREST_ICONS, AVAILABLE_LANGUAGES } from '../lib/constants';
import { SubtopicsList } from '../components/topics/SubtopicsList';
import { ProgressBar } from '../components/topics/ProgressBar';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showAddLanguages, setShowAddLanguages] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

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

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/users/profile-picture', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload profile picture');
      }

      // Refresh user data to show new profile picture
      const updatedUserResponse = await fetch('/api/users');
      const updatedUser = await updatedUserResponse.json();
      setUser(updatedUser);

      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to update profile picture');
    }
  };

  const handleAddLanguage = async (language: string) => {
    try {
      const response = await fetch('/api/users/languages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language }),
      });

      if (!response.ok) throw new Error('Failed to add language');

      // Refresh user data
      const updatedUserResponse = await fetch('/api/users');
      const updatedUserData = await updatedUserResponse.json();
      setUser(updatedUserData);
      setShowAddLanguages(false); // Close the dropdown after adding
    } catch (error) {
      console.error('Failed to add language:', error);
    }
  };

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
      {/* Language Selector aligned with profile picture */}
      {user && user.languages.length > 0 && (
        <div className="absolute top-12 right-8 lg:right-[calc(50%-35rem)]">
          <button 
            onClick={() => setShowLanguages(!showLanguages)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <span>🌐</span>
            <span>{user.languages[0]}</span>
          </button>
          
          {showLanguages && (
            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100">
              {user.languages.map((language: string) => (
                <button
                  key={language}
                  className="block w-full px-4 py-2 text-left hover:bg-purple-50 text-gray-700"
                >
                  {language}
                </button>
              ))}
              
              <div className="my-2 border-t border-gray-100" />
              
              <button
                onClick={() => setShowAddLanguages(!showAddLanguages)}
                className="block w-full px-4 py-2 text-left hover:bg-purple-50 text-purple-600 font-medium"
              >
                + Add Language
              </button>

              {showAddLanguages && (
                <div className="absolute left-full ml-2 top-0 py-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100">
                  {AVAILABLE_LANGUAGES
                    .filter(lang => !user.languages.includes(lang))
                    .map(language => (
                      <button
                        key={language}
                        onClick={() => handleAddLanguage(language)}
                        className="block w-full px-4 py-2 text-left hover:bg-purple-50 text-gray-700"
                      >
                        {language}
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Centered Profile Section */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="relative mb-4 group">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleProfilePictureUpload}
            />
            <div className="w-32 h-32 rounded-full border-4 border-purple-200 overflow-hidden">
              {user.profile_picture ? (
                <Image
                  src={`data:image/jpeg;base64,${Buffer.from(user.profile_picture).toString('base64')}`}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  priority
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
                onClick={() => fileInputRef.current?.click()}
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

        {/* Topics Section - Only changed to use database interests */}
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Topics</h2>
          <div className="space-y-4">
            {user.interests.map((interest: string) => (
              <div 
                key={interest}
                className="p-6 bg-white rounded-lg border border-purple-100 hover:shadow-md transition-shadow"
              >
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedTopic(expandedTopic === interest ? null : interest)}
                >
                  <div className="flex items-center gap-2">
                    {INTEREST_ICONS[interest] || '❔'}
                    <h3 className="text-xl font-semibold text-gray-900">{interest}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <ProgressBar progress={75} className="w-32" />
                    <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      75 XP
                    </div>
                    <svg className={`w-6 h-6 text-purple-600 transition-transform ${
                      expandedTopic === interest ? 'transform rotate-180' : ''
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                <SubtopicsList 
                  topicId={interest}
                  isVisible={expandedTopic === interest}
                  selectedLanguage={user.languages[0]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
