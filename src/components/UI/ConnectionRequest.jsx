import React from 'react'
import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'

export default function ConnectionRequest({ connection, onResponse }) {
  const [applicant, setApplicant] = useState(null)
  
  useEffect(() => {
    const fetchApplicant = async () => {
      const docRef = doc(db, 'users', connection.jobSeekerId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setApplicant(docSnap.data())
      }
    }
    fetchApplicant()
  }, [connection.jobSeekerId])

  return (
    <div className="bg-black rounded-lg p-4 shadow-md mb-4">
      {applicant && (
        <>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <h4 className="font-semibold">{applicant.displayName || 'Anonymous User'}</h4>
              <p className="text-sm text-gray-500">{applicant.email}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              connection.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              connection.status === 'accepted' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {connection.status}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">"{connection.description}"</p>
          
          {connection.status === 'pending' && (
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => onResponse(connection.id, true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={() => onResponse(connection.id, false)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}