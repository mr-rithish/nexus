import React from 'react'

export default function TeamMemberCard({ member }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-600">{member.name?.[0]?.toUpperCase() || 'U'}</span>
        </div>
        <div>
          <h4 className="font-semibold">{member.name || 'Unnamed Member'}</h4>
          <p className="text-sm text-gray-600">{member.role || 'Team Member'}</p>
        </div>
      </div>
    </div>
  )
}