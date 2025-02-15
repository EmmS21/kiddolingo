'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { saveUserData } from './lib/db';
import type { Step } from './lib/types';
import { useRouter } from 'next/navigation';

type Step = 'name' | 'age' | 'interests' | 'language';

export default function Home() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('name');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    interests: [] as string[],
    languages: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const interests = [
    'Football',
    'Soccer',
    'Anime',
    'Science Fiction',
    'History'
  ];

  const languages = [
    'isiNdebele',
    'isiZulu',
    'Shona',
    'Igbo',
    'Yoruba',
    'Afrikaans'
  ];

  useEffect(() => {
    // Check if user exists
    const userId = localStorage.getItem('userId');
    if (userId) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (currentStep === 'language') {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to save user data');
        
        const { userId } = await response.json();
        localStorage.setItem('userId', userId.toString());
        toast.success('Profile saved successfully! Redirecting to dashboard...');
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        // Normal wizard progression
        if (currentStep === 'name') setCurrentStep('age');
        else if (currentStep === 'age') setCurrentStep('interests');
        else if (currentStep === 'interests') setCurrentStep('language');
      }
    } catch (error) {
      console.error('Failed to save user data:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'age') setCurrentStep('name');
    if (currentStep === 'interests') setCurrentStep('age');
    if (currentStep === 'language') setCurrentStep('interests');
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const steps = [
    { name: 'Name', status: currentStep === 'name' ? 'current' : currentStep === 'age' || currentStep === 'interests' ? 'completed' : 'upcoming' },
    { name: 'Age', status: currentStep === 'age' ? 'current' : currentStep === 'interests' ? 'completed' : 'upcoming' },
    { name: 'Interests', status: currentStep === 'interests' ? 'current' : 'upcoming' },
    { name: 'Language', status: currentStep === 'language' ? 'current' : 'upcoming' }
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 'name':
        return (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              What&apos;s your name?
            </h2>
            <p className="text-gray-600 mb-6">
              Let&apos;s start our adventure together! 🌟
            </p>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition duration-200 text-black bg-white"
              required
            />
          </>
        );
      case 'age':
        return (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              How old are you?
            </h2>
            <p className="text-gray-600 mb-6">
              This helps us personalize your learning experience 🎈
            </p>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              placeholder="Enter your age"
              min="1"
              max="100"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition duration-200 text-black bg-white"
              required
            />
          </>
        );
      case 'interests':
        return (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              What are you interested in?
            </h2>
            <p className="text-gray-600 mb-6">
              Pick as many as you like! 🎯
            </p>
            <div className="flex flex-wrap gap-3">
              {interests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full border transition-all duration-200 ${
                    formData.interests.includes(interest)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'border-gray-300 hover:border-purple-600'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </>
        );
      case 'language':
        return (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Choose your learning languages
            </h2>
            <p className="text-gray-600 mb-6">
              Select the languages you want to learn! 🌍
            </p>
            <div className="flex flex-wrap gap-3">
              {languages.map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => toggleLanguage(language)}
                  className={`px-4 py-2 rounded-full border transition-all duration-200 ${
                    formData.languages.includes(language)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'border-gray-300 hover:border-purple-600'
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-background font-[family-name:var(--font-geist-sans)]">
      <main className={`flex-1 flex flex-col transition-all duration-300 ${!isSidebarOpen ? 'w-screen' : ''}`}>
        {/* Progress Bar */}
        <div className="w-full bg-white shadow-sm px-8 py-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
              {steps.map((step, index) => (
                <div key={step.name} className="flex items-center">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === 'current' ? 'bg-purple-600 text-white' : 
                      step.status === 'completed' ? 'bg-green-500 text-black' : 'bg-gray-200'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="ml-2 text-sm font-medium">{step.name}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-12 h-0.5 mx-2 bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className={`max-w-2xl w-full px-4 ${isSidebarOpen ? 'mr-40' : ''}`}>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-8">
                The Talking Rabbit
              </h1>
            </div>

            <form onSubmit={handleNext} className="space-y-6">
              {renderStep()}
              
              <div className="flex gap-4">
                {currentStep !== 'name' && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 px-6 py-3 rounded-lg border border-purple-600 text-purple-600 font-semibold transition-all duration-200 hover:bg-purple-50 group"
                  >
                    <span className="inline-flex items-center">
                      <span className="mr-2 animate-bounce-horizontal group-hover:animate-bounce-horizontal-active">←</span>
                      Back
                    </span>
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting || 
                    (currentStep === 'name' && !formData.name.trim()) ||
                    (currentStep === 'age' && !formData.age) ||
                    (currentStep === 'interests' && formData.interests.length === 0) ||
                    (currentStep === 'language' && formData.languages.length === 0)
                  }
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    <span className="inline-flex items-center">
                      {currentStep === 'language' ? (
                        <>
                          Save
                          <svg 
                            className="ml-2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                            />
                          </svg>
                        </>
                      ) : (
                        <>
                          Next 
                          <span className="ml-2 animate-bounce-horizontal group-hover:animate-bounce-horizontal-active">→</span>
                        </>
                      )}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-2 rounded-l-lg shadow-lg z-50"
      >
        {isSidebarOpen ? '→' : '←'}
      </button>

      {/* Helper Sidebar */}
      <aside className={`fixed right-0 top-0 h-full w-80 bg-purple-600 text-white p-6 transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Help Guide</h2>
          <p className="text-sm opacity-90">This will take about 2 minutes...</p>
        </div>

        <div className="space-y-4">
          <div className={`flex items-start gap-2 ${currentStep === 'name' ? 'opacity-100' : 'opacity-50'} group`}>
            <div className="w-6 h-6 mt-0.5 rounded-full bg-white text-purple-600 flex items-center justify-center text-sm font-bold shrink-0">
              1
            </div>
            <div>
              <span className="font-semibold">Your Name</span>
              <p className="text-sm mt-1 h-0 group-hover:h-auto overflow-hidden transition-all duration-200 opacity-0 group-hover:opacity-100">
                We'll use this to make our conversations more personal and friendly.
              </p>
            </div>
          </div>

          <div className={`flex items-start gap-2 ${currentStep === 'age' ? 'opacity-100' : 'opacity-50'} group`}>
            <div className="w-6 h-6 mt-0.5 rounded-full bg-white text-purple-600 flex items-center justify-center text-sm font-bold shrink-0">
              2
            </div>
            <div>
              <span className="font-semibold">Your Age</span>
              <p className="text-sm mt-1 h-0 group-hover:h-auto overflow-hidden transition-all duration-200 opacity-0 group-hover:opacity-100">
                This helps us adjust the language complexity and choose age-appropriate topics for your learning journey.
              </p>
            </div>
          </div>

          <div className={`flex items-start gap-2 ${currentStep === 'interests' ? 'opacity-100' : 'opacity-50'} group`}>
            <div className="w-6 h-6 mt-0.5 rounded-full bg-white text-purple-600 flex items-center justify-center text-sm font-bold shrink-0">
              3
            </div>
            <div>
              <span className="font-semibold">Your Interests</span>
              <p className="text-sm mt-1 h-0 group-hover:h-auto overflow-hidden transition-all duration-200 opacity-0 group-hover:opacity-100">
                We'll create conversations around topics you love! Learning is more fun when you're talking about things that interest you.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 opacity-50 group">
            <div className="w-6 h-6 mt-0.5 rounded-full bg-white text-purple-600 flex items-center justify-center text-sm font-bold shrink-0">
              4
            </div>
            <div>
              <span className="font-semibold">Target Language</span>
              <p className="text-sm mt-1 h-0 group-hover:h-auto overflow-hidden transition-all duration-200 opacity-0 group-hover:opacity-100">
                Choose the languages you want to learn. We'll guide you through conversations in these languages.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/20">
          <h3 className="font-semibold mb-2">Current Step:</h3>
          <p className="text-sm">
            {currentStep === 'name' && "Let's start by getting to know your name. This helps make our conversations feel more natural and friendly!"}
            {currentStep === 'age' && "Your age helps us customize the learning experience. We'll adjust the content and language to match your level."}
            {currentStep === 'interests' && "Pick the topics you love! We'll use these to create engaging conversations that keep you motivated to learn."}
            {currentStep === 'language' && "Choose the languages you want to learn. We'll guide you through conversations in these languages."}
          </p>
        </div>
      </aside>
    </div>
  );
}
