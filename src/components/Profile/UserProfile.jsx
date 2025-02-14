import React from 'react'
import { useState, useEffect } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../hooks/useAuth'

export default function UserProfile() {
  const { currentUser } = useAuth()
  const [profile, setProfile] = useState({
    bio: '',
    skills: '',
    experience: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(db, 'users', currentUser.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setProfile(docSnap.data())
      }
    }
    if (currentUser) fetchProfile()
  }, [currentUser])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), profile)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            className="input-field h-32"
            placeholder="Tell us about yourself..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Skills</label>
          <input
            type="text"
            value={profile.skills}
            onChange={(e) => setProfile({...profile, skills: e.target.value})}
            className="input-field"
            placeholder="Separate skills with commas (e.g., React, Node.js)"
          />
        </div>
        
        <button
          type="submit"
          className="btn-primary bg-blue-600 hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  )
}