import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, where, updateDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../hooks/useAuth'
import StartupCard from '../UI/StartupCard'
import { toast } from 'react-toastify'
import EmptyState from '../UI/EmptyState'

export default function JobSeekerDashboard() {
  const { currentUser } = useAuth()
  const [startups, setStartups] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStartup, setSelectedStartup] = useState(null)
  const [applicationText, setApplicationText] = useState('')
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    industry: '',
    stage: ''
  })

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const q = query(collection(db, 'startups'), where('status', '==', 'active'))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const startupsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setStartups(startupsData.length > 0 ? startupsData : sampleStartups)
          setLoading(false)
        })
        return unsubscribe
      } catch (error) {
        console.error("Error fetching startups:", error)
        toast.error('Failed to load startups')
        setStartups(sampleStartups)
        setLoading(false)
      }
    }
    fetchStartups()
  }, [])

  const handleConnect = async () => {
    if (!applicationText.trim()) {
      toast.error('Please explain your qualifications')
      return
    }

    try {
      const startupRef = doc(db, 'startups', selectedStartup.id)
      await updateDoc(startupRef, {
        applications: [...(selectedStartup.applications || []), {
          userId: currentUser?.uid,
          userEmail: currentUser?.email,
          applicationText,
          status: 'pending',
          appliedAt: new Date()
        }]
      })
      setSelectedStartup(null)
      setApplicationText('')
      toast.success('Application submitted successfully!')
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error('Failed to submit application')
    }
  }

  const filteredStartups = startups.filter(startup => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      startup.startupName?.toLowerCase().includes(searchLower) ||
      startup.description?.toLowerCase().includes(searchLower) ||
      startup.industry?.toLowerCase().includes(searchLower)

    const matchesIndustry = filters.industry ? 
      startup.industry === filters.industry : true
      
    const matchesStage = filters.stage ? 
      startup.stage === filters.stage : true

    return matchesSearch && matchesIndustry && matchesStage
  })

  return (
    <div className="bg-black max-w-6xl  mx-auto p-6">
      <div className="mb-8 bg-black space-y-4">
        <input
          type="text"
          placeholder="Search startups by name, description, or industry..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="p-2 border rounded-lg"
            value={filters.industry}
            onChange={(e) => setFilters({...filters, industry: e.target.value})}
          >
            <option value="">All Industries</option>
            <option value="fintech">Fintech</option>
            <option value="healthtech">Healthtech</option>
            <option value="edtech">Edtech</option>
            <option value="saas">SaaS</option>
          </select>

          <select
            className="p-2 border rounded-lg"
            value={filters.stage}
            onChange={(e) => setFilters({...filters, stage: e.target.value})}
          >
            <option value="">All Stages</option>
            <option value="ideation">Ideation</option>
            <option value="mvp">MVP Development</option>
            <option value="scaling">Scaling</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading startups...</div>
      ) : (
        <>
          {filteredStartups.length === 0 ? (
            <EmptyState 
              message="No startups found matching your criteria"
              subMessage="Here are some example listings:"
              action={
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleStartups.map(startup => (
                    <StartupCard
                      key={startup.id}
                      startup={startup}
                      onConnect={() => toast.info('This is an example listing')}
                    />
                  ))}
                </div>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStartups.map(startup => (
                <StartupCard
                  key={startup.id}
                  startup={startup}
                  onConnect={() => setSelectedStartup(startup)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {selectedStartup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-black rounded-xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Apply to {selectedStartup.startupName}</h3>
            <div className="mb-4">
              <p className="font-medium">Required Skills:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedStartup.requiredSkills?.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <textarea
              className="w-full p-3 border rounded-lg mb-4 h-32 focus:ring-2 focus:ring-blue-500"
              placeholder="Explain why you're a good fit for this startup..."
              value={applicationText}
              onChange={(e) => setApplicationText(e.target.value)}
            />
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedStartup(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConnect}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}