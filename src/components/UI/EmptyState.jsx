import React from 'react'

export default function EmptyState({ icon, title, description, actionText, actionLink }) {
  return (
    <div className="text-center p-8">
      <div className="mx-auto h-16 w-16 text-gray-400">{icon}</div>
      <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
      {actionText && (
        <a
          href={actionLink}
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {actionText}
        </a>
      )}
    </div>
  )
}
