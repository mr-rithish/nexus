import React from 'react'
export default function StartupStats({ connections, stage, teamSize }) {
    const stageLabels = {
      ideation: '🚀 Ideation',
      mvp: '🛠️ MVP Development',
      scaling: '📈 Scaling'
    }
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="dashboard-card">
          <h3 className="text-sm font-medium text-gray-500">Connection Requests</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">{connections}</p>
        </div>
        <div className="dashboard-card">
          <h3 className="text-sm font-medium text-gray-500">Current Stage</h3>
          <p className="text-xl font-semibold mt-2 text-green-600">
            {stageLabels[stage] || 'Not specified'}
          </p>
        </div>
        <div className="dashboard-card">
          <h3 className="text-sm font-medium text-gray-500">Team Members</h3>
          <p className="text-xl font-semibold mt-2 text-purple-600">
            {teamSize || '0'}
          </p>
        </div>
      </div>
    )
  }