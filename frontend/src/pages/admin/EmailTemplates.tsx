import React, { useState } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import RichTextEditor from '../../components/admin/RichTextEditor';
import './admin.css';

interface EmailTemplate {
    id: number;
    name: string;
    subject: string;
    body: string;
    variables: string[];
    category: 'welcome' | 'reminder' | 'alert' | 'campaign';
    created_at: string;
    updated_at: string;
}

const EmailTemplates: React.FC = () => {
    const [templates, setTemplates] = useState<EmailTemplate[]>([
        {
            id: 1,
            name: 'Welcome Email',
            subject: 'Welcome to Pregnancy Exercise Monitor, {{name}}!',
            body: '# Welcome {{name}}!\n\nWe\'re excited to have you join our community.\n\n## Getting Started\n- Complete your profile\n- Browse exercises\n- Track your progress\n\nBest regards,\nThe Team',
            variables: ['name'],
            category: 'welcome',
            created_at: '2024-01-15',
            updated_at: '2024-01-15'
        },
        {
            id: 2,
            name: 'Exercise Reminder',
            subject: 'Time for your daily exercise, {{name}}!',
            body: '# Hi {{name}},\n\nDon\'t forget your scheduled exercise for today: **{{exercise_name}}**\n\nScheduled time: {{time}}\n\nStay healthy!',
            variables: ['name', 'exercise_name', 'time'],
            category: 'reminder',
            created_at: '2024-01-16',
            updated_at: '2024-01-16'
        }
    ]);

    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        body: '',
        category: 'campaign' as EmailTemplate['category']
    });

    const handleEdit = (template: EmailTemplate) => {
        setSelectedTemplate(template);
        setFormData({
            name: template.name,
            subject: template.subject,
            body: template.body,
            category: template.category
        });
        setIsEditing(true);
    };

    const handleNew = () => {
        setSelectedTemplate(null);
        setFormData({
            name: '',
            subject: '',
            body: '',
            category: 'campaign'
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        if (selectedTemplate) {
            // Update existing template
            setTemplates(templates.map(t =>
                t.id === selectedTemplate.id
                    ? { ...t, ...formData, updated_at: new Date().toISOString().split('T')[0] }
                    : t
            ));
        } else {
            // Create new template
            const newTemplate: EmailTemplate = {
                id: Math.max(...templates.map(t => t.id)) + 1,
                ...formData,
                variables: extractVariables(formData.subject + formData.body),
                created_at: new Date().toISOString().split('T')[0],
                updated_at: new Date().toISOString().split('T')[0]
            };
            setTemplates([...templates, newTemplate]);
        }
        setIsEditing(false);
        alert('Template saved successfully!');
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this template?')) {
            setTemplates(templates.filter(t => t.id !== id));
        }
    };

    const extractVariables = (text: string): string[] => {
        const regex = /\{\{(\w+)\}\}/g;
        const matches = text.matchAll(regex);
        return Array.from(new Set(Array.from(matches, m => m[1])));
    };

    const getCategoryBadgeClass = (category: string) => {
        const classes: Record<string, string> = {
            welcome: 'badge-welcome',
            reminder: 'badge-reminder',
            alert: 'badge-alert',
            campaign: 'badge-campaign'
        };
        return classes[category] || 'badge-campaign';
    };

    return (
        <div className="admin-layout">
            <AdminNav />
            <div className="admin-content">
                <div className="page-header">
                    <div>
                        <h1>📧 Email Templates</h1>
                        <p>Create and manage reusable email templates with variables</p>
                    </div>
                    <button className="btn-primary" onClick={handleNew}>
                        ➕ New Template
                    </button>
                </div>

                {!isEditing ? (
                    <div className="templates-grid">
                        {templates.map(template => (
                            <div key={template.id} className="template-card">
                                <div className="template-header">
                                    <h3>{template.name}</h3>
                                    <span className={`category-badge ${getCategoryBadgeClass(template.category)}`}>
                                        {template.category}
                                    </span>
                                </div>
                                <div className="template-subject">
                                    <strong>Subject:</strong> {template.subject}
                                </div>
                                <div className="template-variables">
                                    <strong>Variables:</strong>
                                    {template.variables.map(v => (
                                        <span key={v} className="variable-tag">{'{{' + v + '}}'}</span>
                                    ))}
                                </div>
                                <div className="template-meta">
                                    Updated: {new Date(template.updated_at).toLocaleDateString()}
                                </div>
                                <div className="template-actions">
                                    <button className="btn-edit" onClick={() => handleEdit(template)}>
                                        ✏️ Edit
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDelete(template.id)}>
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="template-editor">
                        <div className="editor-header">
                            <h2>{selectedTemplate ? 'Edit Template' : 'New Template'}</h2>
                            <div className="editor-actions">
                                <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                                <button className="btn-primary" onClick={handleSave}>
                                    💾 Save Template
                                </button>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Template Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Welcome Email"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as EmailTemplate['category'] })}
                                >
                                    <option value="welcome">Welcome</option>
                                    <option value="reminder">Reminder</option>
                                    <option value="alert">Alert</option>
                                    <option value="campaign">Campaign</option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label>Email Subject</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    placeholder="Use {{variable}} for dynamic content"
                                    required
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Email Body (Markdown supported)</label>
                                <RichTextEditor
                                    value={formData.body}
                                    onChange={(value) => setFormData({ ...formData, body: value })}
                                    placeholder="Use {{variable}} for dynamic content. Markdown formatting is supported."
                                />
                            </div>

                            <div className="variables-info">
                                <h4>💡 Available Variables</h4>
                                <p>Use double curly braces to insert variables: <code>{'{{variable_name}}'}</code></p>
                                <p>Common variables: <code>{'{{name}}'}</code>, <code>{'{{email}}'}</code>, <code>{'{{date}}'}</code></p>
                                <p>Detected variables in this template:</p>
                                <div className="detected-variables">
                                    {extractVariables(formData.subject + formData.body).map(v => (
                                        <span key={v} className="variable-tag">{'{{' + v + '}}'}</span>
                                    ))}
                                    {extractVariables(formData.subject + formData.body).length === 0 && (
                                        <span className="no-variables">No variables detected</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <style>{`
          .templates-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 24px;
          }
          
          .template-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            transition: all 0.2s;
          }
          
          .template-card:hover {
            box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          }
          
          .template-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }
          
          .template-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
          }
          
          .category-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
          }
          
          .badge-welcome {
            background: #dbeafe;
            color: #1e40af;
          }
          
          .badge-reminder {
            background: #fef3c7;
            color: #92400e;
          }
          
          .badge-alert {
            background: #fee2e2;
            color: #991b1b;
          }
          
          .badge-campaign {
            background: #e0e7ff;
            color: #3730a3;
          }
          
          .template-subject {
            margin-bottom: 12px;
            font-size: 14px;
            color: #374151;
          }
          
          .template-variables {
            margin-bottom: 12px;
            font-size: 13px;
            color: #6b7280;
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            align-items: center;
          }
          
          .variable-tag {
            padding: 2px 8px;
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: #667eea;
          }
          
          .template-meta {
            font-size: 12px;
            color: #9ca3af;
            margin-bottom: 16px;
          }
          
          .template-actions {
            display: flex;
            gap: 8px;
          }
          
          .template-editor {
            background: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          
          .editor-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
          }
          
          .editor-header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
          }
          
          .editor-actions {
            display: flex;
            gap: 12px;
          }
          
          .form-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          
          .form-group.full-width {
            grid-column: 1 / -1;
          }
          
          .form-group label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 8px;
          }
          
          .form-group input,
          .form-group select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
          }
          
          .variables-info {
            grid-column: 1 / -1;
            padding: 20px;
            background: #f9fafb;
            border-radius: 8px;
            border-left: 4px solid #667eea;
          }
          
          .variables-info h4 {
            margin: 0 0 12px 0;
            font-size: 14px;
            font-weight: 600;
            color: #1f2937;
          }
          
          .variables-info p {
            margin: 8px 0;
            font-size: 13px;
            color: #6b7280;
          }
          
          .variables-info code {
            padding: 2px 6px;
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: #667eea;
          }
          
          .detected-variables {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
          }
          
          .no-variables {
            color: #9ca3af;
            font-style: italic;
            font-size: 13px;
          }
        `}</style>
            </div>
        </div>
    );
};

export default EmailTemplates;
