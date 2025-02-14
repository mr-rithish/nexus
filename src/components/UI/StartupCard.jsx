import React from 'react'

export default function StartupCard({ startup, onConnect }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-2">{startup.startupName}</h3>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
          {startup.industry || 'Uncategorized'}
        </span>
        <span className="px-3 py-1 bg-purple-100 text-purple-600 text-sm rounded-full">
          {startup.stage}
        </span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3 flex-1">{startup.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {startup.requiredSkills?.map((skill, index) => (
          <span 
            key={index}
            className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-auto space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>👥 Team: {startup.teamSize}</span>
          <span>📅 {startup.createdAt?.toDate().toLocaleDateString() || 'N/A'}</span>
        </div>
        
        <button
          onClick={onConnect}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mt-4"
        >
          Connect
        </button>
      </div>
    </div>
  )
}