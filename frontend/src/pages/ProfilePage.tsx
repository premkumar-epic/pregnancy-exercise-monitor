import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { User, Heart, Stethoscope, FileText, Phone, ArrowLeft, Camera, Save, X } from 'lucide-react'
import apiClient from '../utils/api'
import { toast } from '../components/Toast'

interface UserProfile {
    id: number
    username: string
    email: string
    role: string
    // Personal
    full_name: string
    date_of_birth: string
    phone_number: string
    profile_picture: string | null
    // Pregnancy
    lmp_date: string
    doctor_name: string
    hospital: string
    // Health
    height: number | null
    weight: number | null
    pre_pregnancy_weight: number | null
    blood_type: string
    // Medical
    medical_conditions: string
    allergies: string
    medications: string
    previous_pregnancies: number
    // Emergency
    emergency_contact_name: string
    emergency_contact_relationship: string
    emergency_contact_phone: string
    // Auto-calculated
    age: number | null
    bmi: number | null
    due_date: string | null
    pregnancy_week: number | null
    trimester: number | null
    days_until_due: number | null
}

export default function ProfilePage() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('personal')
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const response = await apiClient.get('/profile/')
            setProfile(response.data)
            if (response.data.profile_picture) {
                // Construct full image URL
                const imageUrl = response.data.profile_picture
                const fullUrl = imageUrl.startsWith('http')
                    ? imageUrl
                    : `http://localhost:8000${imageUrl}`
                setImagePreview(fullUrl)
            }
            setLoading(false)
        } catch (error) {
            console.error('Error fetching profile:', error)
            toast.error('Failed to load profile')
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!profile) return

        setSaving(true)
        try {
            // Exclude profile_picture from the update (it's handled separately)
            const { profile_picture, ...profileData } = profile

            const response = await apiClient.put('/profile/', profileData)
            setProfile(response.data)
            toast.success('Profile updated successfully!')
        } catch (error: any) {
            console.error('Error saving profile:', error)
            toast.error(error.response?.data?.message || 'Failed to save profile')
        } finally {
            setSaving(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB')
            return
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

        const formData = new FormData()
        formData.append('profile_picture', file)

        try {
            const response = await apiClient.post('/profile/picture/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setProfile(response.data)

            // Construct full image URL
            const imageUrl = response.data.profile_picture
            if (imageUrl) {
                // If it's a relative URL, prepend the API base URL
                const fullUrl = imageUrl.startsWith('http')
                    ? imageUrl
                    : `http://localhost:8000${imageUrl}`
                setImagePreview(fullUrl)
            }

            toast.success('Profile picture updated!')
        } catch (error) {
            console.error('Error uploading image:', error)
            toast.error('Failed to upload image')
        }
    }

    const handleDeleteImage = async () => {
        try {
            await apiClient.delete('/profile/picture/delete/')
            setProfile(prev => prev ? { ...prev, profile_picture: null } : null)
            setImagePreview(null)
            toast.success('Profile picture removed')
        } catch (error) {
            console.error('Error deleting image:', error)
            toast.error('Failed to delete image')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        )
    }

    if (!profile) return null

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'pregnancy', label: 'Pregnancy', icon: Heart },
        { id: 'health', label: 'Health Metrics', icon: Stethoscope },
        { id: 'medical', label: 'Medical History', icon: FileText },
        { id: 'emergency', label: 'Emergency Contact', icon: Phone },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">My Profile</h1>
                            <p className="text-gray-600">{profile.username} • {profile.role}</p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </motion.div>

                {/* Profile Picture */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-lg p-6 mb-6"
                >
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-16 h-16 text-gray-400" />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700">
                                <Camera className="w-5 h-5 text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800">{profile.full_name || 'Add your name'}</h3>
                            <p className="text-gray-600">{profile.email}</p>
                            {imagePreview && (
                                <button
                                    onClick={handleDeleteImage}
                                    className="mt-2 text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                                >
                                    <X className="w-4 h-4" />
                                    Remove Picture
                                </button>
                            )}
                        </div>
                        {profile.age && (
                            <div className="text-right">
                                <p className="text-3xl font-bold text-purple-600">{profile.age}</p>
                                <p className="text-sm text-gray-600">years old</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Auto-Calculated Info */}
                {profile.lmp_date && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 mb-6 text-white"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-purple-100 text-sm">Week</p>
                                <p className="text-3xl font-bold">{profile.pregnancy_week}</p>
                            </div>
                            <div>
                                <p className="text-purple-100 text-sm">Trimester</p>
                                <p className="text-3xl font-bold">{profile.trimester}</p>
                            </div>
                            <div>
                                <p className="text-purple-100 text-sm">Days Until Due</p>
                                <p className="text-3xl font-bold">{profile.days_until_due}</p>
                            </div>
                            {profile.bmi && (
                                <div>
                                    <p className="text-purple-100 text-sm">BMI</p>
                                    <p className="text-3xl font-bold">{profile.bmi}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex border-b overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {/* Personal Info Tab */}
                        {activeTab === 'personal' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.full_name}
                                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                        <input
                                            type="date"
                                            value={profile.date_of_birth}
                                            onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={profile.phone_number}
                                            onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="+1 234 567 8900"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pregnancy Tab */}
                        {activeTab === 'pregnancy' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Menstrual Period (LMP)</label>
                                    <input
                                        type="date"
                                        value={profile.lmp_date}
                                        onChange={(e) => setProfile({ ...profile, lmp_date: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    {profile.due_date && (
                                        <p className="mt-2 text-sm text-gray-600">Due Date: {new Date(profile.due_date).toLocaleDateString()}</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Doctor's Name</label>
                                        <input
                                            type="text"
                                            value={profile.doctor_name}
                                            onChange={(e) => setProfile({ ...profile, doctor_name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="Dr. Smith"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Hospital/Clinic</label>
                                        <input
                                            type="text"
                                            value={profile.hospital}
                                            onChange={(e) => setProfile({ ...profile, hospital: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="City Hospital"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Previous Pregnancies</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={profile.previous_pregnancies}
                                        onChange={(e) => setProfile({ ...profile, previous_pregnancies: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Health Metrics Tab */}
                        {activeTab === 'health' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={profile.height || ''}
                                            onChange={(e) => setProfile({ ...profile, height: parseFloat(e.target.value) || null })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="165"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Weight (kg)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={profile.weight || ''}
                                            onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) || null })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="65"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Pre-Pregnancy Weight (kg)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={profile.pre_pregnancy_weight || ''}
                                            onChange={(e) => setProfile({ ...profile, pre_pregnancy_weight: parseFloat(e.target.value) || null })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="60"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                                    <select
                                        value={profile.blood_type}
                                        onChange={(e) => setProfile({ ...profile, blood_type: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="">Select blood type</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Medical History Tab */}
                        {activeTab === 'medical' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
                                    <textarea
                                        value={profile.medical_conditions}
                                        onChange={(e) => setProfile({ ...profile, medical_conditions: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="List any pre-existing conditions..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                                    <textarea
                                        value={profile.allergies}
                                        onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="List any allergies..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                                    <textarea
                                        value={profile.medications}
                                        onChange={(e) => setProfile({ ...profile, medications: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="List current medications..."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Emergency Contact Tab */}
                        {activeTab === 'emergency' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                                    <input
                                        type="text"
                                        value={profile.emergency_contact_name}
                                        onChange={(e) => setProfile({ ...profile, emergency_contact_name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                                        <input
                                            type="text"
                                            value={profile.emergency_contact_relationship}
                                            onChange={(e) => setProfile({ ...profile, emergency_contact_relationship: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="Spouse, Parent, etc."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={profile.emergency_contact_phone}
                                            onChange={(e) => setProfile({ ...profile, emergency_contact_phone: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="+1 234 567 8900"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
