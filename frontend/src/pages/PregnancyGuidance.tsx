import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import apiClient from '../utils/api'
import { toast } from '../components/Toast'

interface GuidanceArticle {
    id: number
    title: string
    content: string
    category: string
    trimester: number | null
    trimester_display: string
    week_number: number | null
    icon: string
    order: number
}

interface FAQ {
    id: number
    question: string
    answer: string
    category: string
    category_display: string
    order: number
}

export default function PregnancyGuidance() {
    const navigate = useNavigate()
    const [articles, setArticles] = useState<GuidanceArticle[]>([])
    const [weeklyContent, setWeeklyContent] = useState<GuidanceArticle | null>(null)
    const [faqs, setFaqs] = useState<FAQ[]>([])
    const [groupedFaqs, setGroupedFaqs] = useState<Record<string, FAQ[]>>({})
    const [loading, setLoading] = useState(true)
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
    const [currentTrimester, setCurrentTrimester] = useState<number | null>(null)
    const [currentWeek, setCurrentWeek] = useState<number | null>(null)

    useEffect(() => {
        fetchGuidanceData()
    }, [])

    const fetchGuidanceData = async () => {
        try {
            const [guidanceRes, faqsRes] = await Promise.all([
                apiClient.get('/guidance/'),
                apiClient.get('/faqs/')
            ])

            setArticles(guidanceRes.data.articles || [])
            setWeeklyContent(guidanceRes.data.weekly_content)
            setCurrentTrimester(guidanceRes.data.current_trimester)
            setCurrentWeek(guidanceRes.data.current_week)

            setFaqs(faqsRes.data.faqs || [])
            setGroupedFaqs(faqsRes.data.grouped || {})
            setLoading(false)
        } catch (error) {
            console.error('Error fetching guidance:', error)
            toast.error('Failed to load guidance content')
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading guidance...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
            <div className="max-w-7xl mx-auto">
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

                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">Pregnancy Guidance</h1>
                            <p className="text-gray-600">
                                {currentTrimester && currentWeek
                                    ? `Trimester ${currentTrimester} • Week ${currentWeek}`
                                    : 'Your pregnancy journey companion'}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Weekly Content */}
                {weeklyContent && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                            <div className="flex items-start gap-4">
                                <div className="text-4xl">{weeklyContent.icon}</div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">This Week: {weeklyContent.title}</h3>
                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-purple-50">{weeklyContent.content.substring(0, 200)}...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Guidance Articles */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Helpful Guides</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {articles.map((article, idx) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * idx }}
                                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-5xl">{article.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{article.title}</h3>
                                        {article.trimester && (
                                            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full mb-3">
                                                {article.trimester_display}
                                            </span>
                                        )}
                                        <div className="prose max-w-none">
                                            <p className="text-gray-600 text-sm line-clamp-3">
                                                {article.content.substring(0, 150)}...
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                // Show full content in modal or expand
                                                toast.info('Full article view coming soon!')
                                            }}
                                            className="mt-4 text-purple-600 hover:text-purple-700 font-semibold text-sm"
                                        >
                                            Read More →
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* FAQs */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <HelpCircle className="w-6 h-6 text-purple-600" />
                        <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq) => (
                            <motion.div
                                key={faq.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-xl shadow-md overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start gap-3 flex-1 text-left">
                                        <span className="text-purple-600 font-bold text-lg">Q:</span>
                                        <span className="font-semibold text-gray-800">{faq.question}</span>
                                    </div>
                                    {expandedFaq === faq.id ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    )}
                                </button>

                                {expandedFaq === faq.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="px-6 pb-4 border-t border-gray-100"
                                    >
                                        <div className="flex items-start gap-3 pt-4">
                                            <span className="text-pink-600 font-bold text-lg">A:</span>
                                            <p className="text-gray-700">{faq.answer}</p>
                                        </div>
                                        <span className="inline-block mt-3 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                            {faq.category_display}
                                        </span>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
