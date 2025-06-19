'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function HomePage() {
  const [displayedText, setDisplayedText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const codeLines = [
    '> Initializing future_tech.py',
    '> Loading quantum algorithms',
    '> Connecting to server..',
    '> System ready! Welcome to Coding Club',
    '> >>> import innovation',
    '> >>> innovation.transform_future'
  ];

  // Typewriter effect
  useEffect(() => {
    if (currentLineIndex < codeLines.length) {
      const currentLine = codeLines[currentLineIndex];
      
      if (currentCharIndex < currentLine.length) {
        const timer = setTimeout(() => {
          setDisplayedText(prev => prev + currentLine[currentCharIndex]);
          setCurrentCharIndex(prev => prev + 1);
        }, 50);
        
        return () => clearTimeout(timer);
      } else {
        // Move to next line
        const timer = setTimeout(() => {
          setDisplayedText(prev => prev + '\n');
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, 300);
        
        return () => clearTimeout(timer);
      }
    }
  }, [currentCharIndex, currentLineIndex, codeLines]);

  const stats = [
    { number: '40+', label: 'Active Members' },
    { number: '3+', label: 'Projects & Courses' },
    { number: '5+', label: 'Workshops Held' }
  ];

  const techTags = [
    'Machine Learning',
    'Web Development', 
    'AI Research'
  ];

  return (
    <DashboardLayout>
      <div className="h-full relative">
        <div className="relative z-10 h-full flex items-center justify-center p-8">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
          
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-purple-400">Innovate</span>{' '}
                <span className="text-white">with</span>{' '}
                <span className="text-blue-400">Code</span>
              </h1>
              
              <p className="text-lg text-gray-100 leading-relaxed max-w-lg">
                Join the coding revolution at IISER Thiruvananthapuram. We build solutions that{' '}
                <span className="text-blue-400 font-semibold underline decoration-blue-400/50">transform</span>{' '}
                the world through AI, machine learning, and cutting-edge tech.
              </p>
            </div>

            {/* Tech Tags */}
            <div className="flex flex-wrap gap-3">
              {techTags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center space-x-2">
                <span>🚀</span>
                <span>Join Our Community</span>
              </button>
              
              <button className="group bg-white/10 hover:bg-white/20 border border-white/20 hover:border-purple-400/50 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm flex items-center justify-center space-x-2">
                <span>{'</>'}</span>
                <span>Explore Tech</span>
              </button>
            </div>
          </div>

          {/* Right Content - Terminal */}
          <div className="relative">
            <div className="bg-black/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
              {/* Terminal Header */}
              <div className="flex items-center space-x-2 pb-4 border-b border-purple-400/30">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-purple-300 text-sm ml-4">codingclub@iisertvm:~</div>
              </div>
              
              {/* Terminal Content */}
              <div className="mt-4 font-mono text-sm h-48 overflow-hidden">
                <pre className="text-blue-300 whitespace-pre-wrap leading-relaxed">
                  {displayedText}
                  <span className="animate-pulse text-purple-400">_</span>
                </pre>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg shadow-purple-500/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    {stat.number}
                  </div>
                  <div className="text-gray-200 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}