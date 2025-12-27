import React, { useEffect, useState } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import {
    getGuidanceArticles, createGuidanceArticle, updateGuidanceArticle, deleteGuidanceArticle,
    getFAQs, createFAQ, updateFAQ, deleteFAQ
} from '../../services/adminApi';
import './admin.css';

interface Article {
    id: number;
    title: string;
    content: string;
    trimester: string;
    category: string;
}

interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: string;
}

const GuidanceManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'articles' | 'faqs'>('articles');
    const [articles, setArticles] = useState<Article[]>([]);
    const [faqs, setFAQs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        try {
            if (activeTab === 'articles') {
                const data = await getGuidanceArticles();
                setArticles(data);
            } else {
                const data = await getFAQs();
                setFAQs(data);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (activeTab === 'articles') {
                if (editingItem) {
                    await updateGuidanceArticle(editingItem.id, formData);
                } else {
                    await createGuidanceArticle(formData);
                }
            } else {
                if (editingItem) {
                    await updateFAQ(editingItem.id, formData);
                } else {
                    await createFAQ(formData);
                }
            }
            await loadData();
            resetForm();
            alert('Saved successfully!');
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save');
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setFormData(item);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this?')) return;
        try {
            if (activeTab === 'articles') {
                await deleteGuidanceArticle(id);
            } else {
                await deleteFAQ(id);
            }
            await loadData();
        } catch (error) {
            console.error('Failed to delete:', error);
            alert('Failed to delete');
        }
    };

    const resetForm = () => {
        setFormData({});
        setEditingItem(null);
        setShowForm(false);
    };

    const openNewForm = () => {
        if (activeTab === 'articles') {
            setFormData({ title: '', content: '', trimester: 'all', category: 'general' });
        } else {
            setFormData({ question: '', answer: '', category: 'general' });
        }
        setShowForm(true);
    };

    return (
        <div className="admin-layout">
            <AdminNav />
            <div className="admin-content">
                <div className="page-header">
                    <div>
                        <h1>Guidance Manager</h1>
                        <p>Manage pregnancy guidance articles and FAQs</p>
                    </div>
                    <button className="btn-primary" onClick={openNewForm}>
                        + Add {activeTab === 'articles' ? 'Article' : 'FAQ'}
                    </button>
                </div>

                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'articles' ? 'active' : ''}`}
                        onClick={() => setActiveTab('articles')}
                    >
                        Articles
                    </button>
                    <button
                        className={`tab ${activeTab === 'faqs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('faqs')}
                    >
                        FAQs
                    </button>
                </div>

                {showForm && (
                    <div className="modal-overlay" onClick={resetForm}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>{editingItem ? 'Edit' : 'Add'} {activeTab === 'articles' ? 'Article' : 'FAQ'}</h2>
                            <form onSubmit={handleSubmit}>
                                {activeTab === 'articles' ? (
                                    <>
                                        <div className="form-group">
                                            <label>Title *</label>
                                            <input
                                                type="text"
                                                value={formData.title || ''}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Content *</label>
                                            <textarea
                                                value={formData.content || ''}
                                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                rows={6}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Trimester</label>
                                            <select
                                                value={formData.trimester || 'all'}
                                                onChange={(e) => setFormData({ ...formData, trimester: e.target.value })}
                                            >
                                                <option value="all">All</option>
                                                <option value="first">First</option>
                                                <option value="second">Second</option>
                                                <option value="third">Third</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Category</label>
                                            <input
                                                type="text"
                                                value={formData.category || 'general'}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="form-group">
                                            <label>Question *</label>
                                            <input
                                                type="text"
                                                value={formData.question || ''}
                                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Answer *</label>
                                            <textarea
                                                value={formData.answer || ''}
                                                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                                rows={5}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Category</label>
                                            <input
                                                type="text"
                                                value={formData.category || 'general'}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={resetForm}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        {editingItem ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="loading">Loading {activeTab}...</div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    {activeTab === 'articles' ? (
                                        <>
                                            <th>Title</th>
                                            <th>Trimester</th>
                                            <th>Category</th>
                                            <th>Content Preview</th>
                                            <th>Actions</th>
                                        </>
                                    ) : (
                                        <>
                                            <th>Question</th>
                                            <th>Category</th>
                                            <th>Answer Preview</th>
                                            <th>Actions</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {activeTab === 'articles' ? (
                                    articles.map((article) => (
                                        <tr key={article.id}>
                                            <td><strong>{article.title}</strong></td>
                                            <td>{article.trimester}</td>
                                            <td>{article.category}</td>
                                            <td>{article.content.substring(0, 60)}...</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="btn-edit" onClick={() => handleEdit(article)}>
                                                        Edit
                                                    </button>
                                                    <button className="btn-delete" onClick={() => handleDelete(article.id)}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    faqs.map((faq) => (
                                        <tr key={faq.id}>
                                            <td><strong>{faq.question}</strong></td>
                                            <td>{faq.category}</td>
                                            <td>{faq.answer.substring(0, 60)}...</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="btn-edit" onClick={() => handleEdit(faq)}>
                                                        Edit
                                                    </button>
                                                    <button className="btn-delete" onClick={() => handleDelete(faq.id)}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {(activeTab === 'articles' ? articles.length === 0 : faqs.length === 0) && (
                            <div className="no-data">No {activeTab} found. Add your first one!</div>
                        )}
                    </div>
                )}

                <style>{`
          .tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 24px;
            border-bottom: 2px solid #e5e7eb;
          }
          
          .tab {
            padding: 12px 24px;
            background: none;
            border: none;
            border-bottom: 3px solid transparent;
            font-size: 15px;
            font-weight: 500;
            color: #6b7280;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .tab:hover {
            color: #374151;
          }
          
          .tab.active {
            color: #667eea;
            border-bottom-color: #667eea;
          }
        `}</style>
            </div>
        </div>
    );
};

export default GuidanceManager;
