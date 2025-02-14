import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../hooks/useAuth';
import { UserIcon } from '@heroicons/react/24/solid';

export default function ChooseRole() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [userStartups, setUserStartups] = useState([]);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'startups'), where('founderId', '==', currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const startups = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserStartups(startups);
    });
    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      {/* Profile Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="relative group p-2 hover:bg-gray-800 rounded-full transition-colors"
        >

          {/* display startups registered by user */}

          <UserIcon className="w-8 h-8 text-violet-400" />
          {userStartups.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-violet-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {userStartups.length}
            </span>
          )}
        </button>
        {showProfile && (
          <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-semibold mb-2 text-violet-400">Your Startups</h3>
            {userStartups.length === 0 ? (
              <p className="text-sm text-gray-400">No registered startups yet</p>
            ) : (
              <div className="space-y-2">
                {userStartups.map((startup) => (
                  <div
                    key={startup.id}
                    className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer"
                    onClick={() => navigate(`/founder-dashboard`)}
                  >
                    <p className="font-medium text-sm text-white">{startup.startupName}</p>
                    <p className="text-xs text-gray-400 truncate">{startup.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-violet-400">{startup.teamSize} members</span>
                      <span className="text-xs text-gray-400">
                        {new Date(startup.createdAt?.toDate()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {/* choosing options  */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-violet-400 mb-4">Join the Innovation Ecosystem</h1>
          <p className="text-lg text-gray-300">Select your path to begin your startup journey</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Founder Card */}
          <div
            onClick={() => navigate('/founder-form')}
            className="group bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
          >
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-violet-500 rounded-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Founder</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Launch your vision and build your dream team.  Unlock new possibilities and turn ideas into reality with the right team by your side.
              </p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Startup profile builder</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Collaboration tools for team-building</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Project management tools for startup team</span>
                </li>
              </ul>
              <div className="mt-8">
                <button className="w-full bg-violet-600 text-white py-3 rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 group-hover:bg-violet-700">
                  Launch Startup
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* job-seeker Card */}
          <div
            onClick={() => navigate('/job-seeker-dashboard')}
            className="group bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
          >
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-purple-500 rounded-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Talent</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Join innovative teams and grow with early-stage startups. Find projects matching your skills and ambitions.
              </p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Smart matching system</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Real-time collaboration dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Skill development tracker</span>
                </li>
              </ul>
              <div className="mt-8">
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 group-hover:bg-purple-700">
                  Find Startups
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}