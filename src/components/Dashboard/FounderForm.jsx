// src/components/Dashboard/FounderForm.jsx
import React, { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import StartupStats from '../UI/StartupStats'

export default function FounderForm() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    startupName: '',
    description: '',
    industry: '',
    stage: 'ideation',
    website: '',
    requiredSkills: [],
    teamSize: 1,
    businessModel: '',
    marketOpportunity: '',
    contactEmail: currentUser?.email || ''
  })
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tempSkill, setTempSkill] = useState('')

  const handleAddSkill = () => {
    if (tempSkill.trim() && formData.requiredSkills.length < 10) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, tempSkill.trim()]
      }))
      setTempSkill('')
    }
  }

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((_, i) => i !== index)
    }))
  }

  const validateStep = () => {
    switch(currentStep) {
      case 1:
        if (!formData.startupName.trim() || !formData.description.trim()) {
          toast.error('Please fill all required fields')
          return false
        }
        return true
      case 2:
        if (formData.requiredSkills.length === 0) {
          toast.error('Please add at least one required skill')
          return false
        }
        return true
      case 3:
        if (!formData.industry) {
          toast.error('Please select an industry')
          return false
        }
        return true
      default:
        return true
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep()) return
    
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1)
      return
    }

    setIsSubmitting(true)
    try {
      await addDoc(collection(db, 'startups'), {
        ...formData,
        founderId: currentUser.uid,
        createdAt: new Date(),
        applications: [],
        status: 'active',
        teamMembers: [],
        views: 0,
        matches: 0
      })
      toast.success('Startup listing created successfully!')
      navigate('/founder-dashboard')
    } catch (error) {
      console.error("Error creating startup:", error)
      toast.error('Failed to create startup listing')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-black rounded-xl shadow-sm p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-violet-100">Create Startup Listing</h2>
              <StartupStats
                teamSize={formData.teamSize}
                skillsCount={formData.requiredSkills.length}
              />
            </div>
            
            <div className="mt-4 flex gap-2">
              {[1, 2, 3].map(step => (
                <div 
                  key={step}
                  className={`h-2 w-8 rounded-full ${currentStep >= step ? 'bg-violet-400' : 'bg-violet-900'}`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xl text-violet-700 mb-2">
                    Startup Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-violet-300 bg-violet-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.startupName}
                    onChange={e => setFormData(prev => ({...prev, startupName: e.target.value}))}
                  />
                </div>

                <div>
                <label className="block text-xl text-violet-700 p-2 rounded">
                    Elevator Pitch (Max 200 characters) *
                </label>

                <textarea
                      required
                      maxLength={200}
                      className="w-full px-4 py-3 border border-violet-300 rounded-lg min-h-[120px] 
                      bg-violet-400 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-violet-700 mb-2">
                    Required Skills (Max 10)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-3 border border-violet-300 rounded-lg"
                      placeholder="Add a skill"
                      value={tempSkill}
                      onChange={e => setTempSkill(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.requiredSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-violet-100 rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="text-violet-400 hover:text-violet-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-violet-700 mb-2">
                    Team Size *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    className="w-full px-4 py-3 border border-violet-300 rounded-lg"
                    value={formData.teamSize}
                    onChange={e => setFormData(prev => ({...prev, teamSize: e.target.value}))}
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-violet-700 mb-2">
                    Industry *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-violet-300 rounded-lg"
                    value={formData.industry}
                    onChange={e => setFormData(prev => ({...prev, industry: e.target.value}))}
                  >
                    <option value="">Select Industry</option>
                    <option value="fintech">Fintech</option>
                    <option value="healthtech">Healthtech</option>
                    <option value="edtech">Edtech</option>
                    <option value="saas">SaaS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-violet-700 mb-2">
                    Business Model
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-violet-300 rounded-lg min-h-[100px]"
                    placeholder="Describe your revenue model"
                    value={formData.businessModel}
                    onChange={e => setFormData(prev => ({...prev, businessModel: e.target.value}))}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-6 py-2 text-violet-600 hover:text-violet-800"
                >
                  Back
                </button>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-auto px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {currentStep === 3 ? 
                  (isSubmitting ? 'Submitting...' : 'Create Listing') : 
                  'Next Step'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}