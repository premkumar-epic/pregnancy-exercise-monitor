import React, { useEffect, useState } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import { getExercises, createExercise, updateExercise, deleteExercise } from '../../services/adminApi';

interface Exercise {
    id: number;
    name: string;
    description: string;
    difficulty: string;
    target_joints: string;
}

const ExerciseManager: React.FC = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        difficulty: 'easy',
        target_joints: ''
    });

    useEffect(() => {
        loadExercises();
    }, []);

    const loadExercises = async () => {
        try {
            const data = await getExercises();
            setExercises(data);
        } catch (error) {
            console.error('Failed to load exercises:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log('Saving exercise:', formData);
            if (editingExercise) {
                const result = await updateExercise(editingExercise.id, formData);
                console.log('Update result:', result);
            } else {
                const result = await createExercise(formData);
                console.log('Create result:', result);
            }
            await loadExercises();
            resetForm();
            alert('Exercise saved successfully!');
        } catch (error: any) {
            console.error('Failed to save exercise:', error);
            const errorMessage = error?.message || 'Failed to save exercise. Please check the console for details.';
            alert(errorMessage);
        }
    };

    const handleEdit = (exercise: Exercise) => {
        setEditingExercise(exercise);
        setFormData({
            name: exercise.name,
            description: exercise.description,
            difficulty: exercise.difficulty,
            target_joints: exercise.target_joints
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this exercise?')) return;
        try {
            await deleteExercise(id);
            await loadExercises();
        } catch (error) {
            console.error('Failed to delete exercise:', error);
            alert('Failed to delete exercise');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', difficulty: 'easy', target_joints: '' });
        setEditingExercise(null);
        setShowForm(false);
    };

    return (
        <div className="admin-layout">
            <AdminNav />
            <div className="admin-content">
                <div className="page-header">
                    <div>
                        <h1>Exercise Manager</h1>
                        <p>Manage pregnancy-safe exercises</p>
                    </div>
                    <button className="btn-primary" onClick={() => setShowForm(true)}>
                        + Add Exercise
                    </button>
                </div>

                {showForm && (
                    <div className="modal-overlay" onClick={resetForm}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>{editingExercise ? 'Edit Exercise' : 'Add New Exercise'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Exercise Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description *</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Difficulty *</label>
                                    <select
                                        value={formData.difficulty}
                                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Target Joints *</label>
                                    <input
                                        type="text"
                                        value={formData.target_joints}
                                        onChange={(e) => setFormData({ ...formData, target_joints: e.target.value })}
                                        placeholder="e.g., knee,hip,ankle"
                                        required
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={resetForm}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        {editingExercise ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Difficulty</th>
                                <th>Target Joints</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exercises.map((exercise) => (
                                <tr key={exercise.id}>
                                    <td><strong>{exercise.name}</strong></td>
                                    <td>{exercise.description.substring(0, 100)}...</td>
                                    <td>
                                        <span className={`difficulty-badge ${exercise.difficulty}`}>
                                            {exercise.difficulty}
                                        </span>
                                    </td>
                                    <td>{exercise.target_joints}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-edit" onClick={() => handleEdit(exercise)}>
                                                Edit
                                            </button>
                                            <button className="btn-delete" onClick={() => handleDelete(exercise.id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <style>{`
          .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: transform 0.2s;
          }
          
          .btn-primary:hover {
            transform: translateY(-2px);
          }
          
          .btn-secondary {
            background: #f3f4f6;
            color: #374151;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
          }
          
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          
          .modal-content {
            background: white;
            padding: 32px;
            border-radius: 12px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
          }
          
          .modal-content h2 {
            margin: 0 0 24px 0;
            font-size: 24px;
            font-weight: 600;
          }
          
          .form-group {
            margin-bottom: 20px;
          }
          
          .form-group label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 8px;
          }
          
          .form-group input,
          .form-group textarea,
          .form-group select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
          }
          
          .form-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 24px;
          }
          
          .data-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .data-table thead {
            background: #f9fafb;
          }
          
          .data-table th {
            padding: 16px;
            text-align: left;
            font-size: 13px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
          }
          
          .data-table td {
            padding: 16px;
            border-top: 1px solid #f3f4f6;
            font-size: 14px;
            color: #374151;
          }
          
          .difficulty-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            display: inline-block;
          }
          
          .difficulty-badge.easy {
            background: #d1fae5;
            color: #065f46;
          }
          
          .difficulty-badge.medium {
            background: #fef3c7;
            color: #92400e;
          }
          
          .difficulty-badge.hard {
            background: #fee2e2;
            color: #991b1b;
          }
          
          .action-buttons {
            display: flex;
            gap: 8px;
          }
          
          .btn-edit {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            cursor: pointer;
          }
          
          .btn-delete {
            background: #ef4444;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            cursor: pointer;
          }
        `}</style>
            </div>
        </div>
    );
};

export default ExerciseManager;
