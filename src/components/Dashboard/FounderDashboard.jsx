import React, { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../hooks/useAuth'
import ConnectionRequest from '../UI/ConnectionRequest'
import StartupStats from '../UI/StartupStats'
import NotificationBell from '../UI/NotificationBell'
import { ChartPieIcon, UserGroupIcon, BriefcaseIcon, SparklesIcon } from '@heroicons/react/24/outline'
import EmptyState from '../UI/EmptyState'
import TeamMemberCard from '../UI/TeamMemberCard'
import { toast } from 'react-toastify'

export default function FounderDashboard() {
  const { currentUser } = useAuth()
  const [startup, setStartup] = useState(null)
  const [connections, setConnections] = useState([])
  const [activeTab, setActiveTab] = useState('requests')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribeConnections = () => {}

    const fetchStartup = async () => {
      try {
        const startupsQuery = query(
          collection(db, 'startups'),
          where('founderId', '==', currentUser.uid)
        )

        const unsubscribe = onSnapshot(startupsQuery, (snapshot) => {
          if (!snapshot.empty) {
            const startupData = snapshot.docs[0].data()
            const startupId = snapshot.docs[0].id
            const enhancedData = {
              id: startupId,
              ...startupData,
              teamSize: startupData.team?.length || 0
            }
            setStartup(enhancedData)

            const connectionsQuery = query(
              collection(db, 'connections'),
              where('startupId', '==', startupId)
            )
            unsubscribeConnections = onSnapshot(connectionsQuery, (snapshot) => {
              setConnections(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                userRef: doc.data().userId
              })))
            })
          }
          setLoading(false)
        })

        return () => {
          unsubscribe()
          unsubscribeConnections()
        }
      } catch (error) {
        console.error('Error loading startup:', error)
        toast.error('Failed to load startup data')
        setLoading(false)
      }
    }

    if (currentUser) fetchStartup()

    return () => {
      unsubscribeConnections()
    }
  }, [currentUser])

  // dashboard for startups listed and for founder

  const handleResponse = async (connectionId, accepted) => {
    try {
      await updateDoc(doc(db, 'connections', connectionId), {
        status: accepted ? 'accepted' : 'rejected',
        respondedAt: new Date()
      })
      toast.success(`Request ${accepted ? 'accepted' : 'rejected'} successfully`)
    } catch (error) {
      console.error('Error updating connection:', error)
      toast.error('Failed to update request')
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'team':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {startup.team?.map(member => (
              <TeamMemberCard key={member.userId} member={member} />
            ))}
            <button className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-gray-400 transition-colors">
              <span className="text-gray-600">Add Team Member</span>
            </button>
          </div>
        )
      case 'analytics':
        return (
          <div className="bg-black rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-600">Total Views</h4>
                <p className="text-3xl font-bold mt-2">1,234</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-600">Connection Rate</h4>
                <p className="text-3xl font-bold mt-2">23%</p>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="bg-black rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Connection Requests ({connections.filter(c => c.status === 'pending').length})
              </h2>
              <div className="flex gap-2">
                <button className="text-sm text-gray-600 px-3 py-1 rounded-lg bg-gray-100">
                  Sort by Date
                </button>
                <button className="text-sm text-gray-600 px-3 py-1 rounded-lg bg-gray-100">
                  Filter by Role
                </button>
              </div>
            </div>

            {connections.filter(c => c.status === 'pending').length === 0 ? (
              <EmptyState
                icon={<SparklesIcon className="w-12 h-12 text-gray-400 mx-auto" />}
                title="No pending requests"
                description="Share your listing to attract more talent"
              />
            ) : (
              <div className="space-y-4">
                {connections
                  .filter(c => c.status === 'pending')
                  .map(connection => (
                    <ConnectionRequest
                      key={connection.id}
                      connection={connection}
                      onResponse={handleResponse}
                    />
                  ))}
              </div>
            )}
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  //when no startups are listed
  if (!startup) {
    return (
      <EmptyState
        title="No Startup Found"
        description="Get started by creating your startup profile"
        actionText="Create Startup Listing"
        actionLink="/founder-form"
        icon={<BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto" />}
      />
    )
  }

  return (
    <div className="min-h-screen bg-black-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 space-y-2">
            <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
              <h1 className="text-xl font-bold truncate">{startup.name}</h1>
              <p className="text-sm text-gray-500 mt-1 truncate">{startup.industry}</p>
            </div>
            
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('requests')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  activeTab === 'requests' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <BriefcaseIcon className="w-5 h-5" />
                <span>Requests</span>
                {connections.filter(c => c.status === 'pending').length > 0 && (
                  <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {connections.filter(c => c.status === 'pending').length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('team')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  activeTab === 'team' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <UserGroupIcon className="w-5 h-5" />
                <span>Team</span>
                <span className="ml-auto text-sm text-gray-500">
                  {startup.teamSize || 0}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  activeTab === 'analytics' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <ChartPieIcon className="w-5 h-5" />
                <span>Analytics</span>
              </button>
            </nav>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
                <p className="text-gray-600 mt-2">
                  {activeTab === 'requests' && 'Manage incoming connection requests'}
                  {activeTab === 'team' && 'View and manage your team members'}
                  {activeTab === 'analytics' && 'Track your startup performance'}
                </p>
              </div>
              <NotificationBell />
            </div>

            <StartupStats 
              connections={connections}
              stage={startup.stage}
              teamSize={startup.teamSize}
              funding={startup.funding}
              industry={startup.industry}
            />

            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}