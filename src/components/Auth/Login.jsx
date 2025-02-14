//login-page 
import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import { useNavigate } from 'react-router-dom';

//if login is successful move to choose-role page else return login-failed
export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/choose-role');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Section */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl font-bold text-white leading-tight font-sans">
              Elevate Your Vision with
              <span className="text-purple-400 block mt-2 font-extrabold text-6xl tracking-wide uppercase">Startup Nexus</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-lg font-light">
              Where visionary founders meet passionate talent. The future starts here.
            </p>
            <button
              onClick={handleGoogleLogin}
              className="bg-purple-600 px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-4 w-fit text-white font-semibold text-lg transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Right Section */}
          <div className="hidden lg:block relative">
            <div className="bg-gray-900 rounded-2xl p-8 aspect-square transform rotate-2 shadow-md">
              <div className="bg-gray-800 rounded-xl p-6 transform -rotate-2 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-white font-sans">Explore Opportunities</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-gray-700 p-2 rounded-md hover:bg-gray-600 transition-all">
                    <span className="font-medium text-gray-300 font-sans">Founder Listings</span>
                    <span className="text-sm text-gray-500">🚀 20+ Startups</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-700 p-2 rounded-md hover:bg-gray-600 transition-all">
                    <span className="font-medium text-gray-300 font-sans">Job Seeker Profiles</span>
                    <span className="text-sm text-gray-500">💼 100+ Talents</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-12 -right-12 bg-purple-600 rounded-2xl p-6 w-64 shadow-md text-white transform hover:scale-105 transition-all">
              <h3 className="text-lg font-semibold mb-4 font-sans">Success Stories</h3>
              {/* for stories box on right with star which adds when each story is added */}
              <div className="space-y-2">
                {[
                  "AI Innovators Thriving",
                  "Fintech Scaling Fast",
                  "Creative Teams Succeeding",
                ].map((story, index) => (
                  <div key={index} className="text-sm font-light">
                    <span>⭐ {story}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}