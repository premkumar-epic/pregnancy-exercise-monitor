import React, { useEffect, useState } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import { getNutritionFoods, createNutritionFood, updateNutritionFood, deleteNutritionFood } from '../../services/adminApi';
import './admin.css';

interface NutritionFood {
    id: number;
    name: string;
    category: string;
    description: string;
    benefits: string;
    trimester_specific: string;
}

const NutritionManager: React.FC = () => {
    const [foods, setFoods] = useState<NutritionFood[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingFood, setEditingFood] = useState<NutritionFood | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'fruits',
        description: '',
        benefits: '',
        trimester_specific: 'all'
    });

    useEffect(() => {
        loadFoods();
    }, []);

    const loadFoods = async () => {
        try {
            const data = await getNutritionFoods();
            setFoods(data);
        } catch (error) {
            console.error('Failed to load nutrition foods:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingFood) {
                await updateNutritionFood(editingFood.id, formData);
            } else {
                await createNutritionFood(formData);
            }
            await loadFoods();
            resetForm();
            alert('Nutrition food saved successfully!');
        } catch (error) {
            console.error('Failed to save food:', error);
            alert('Failed to save nutrition food');
        }
    };

    const handleEdit = (food: NutritionFood) => {
        setEditingFood(food);
        setFormData({
            name: food.name,
            category: food.category,
            description: food.description,
            benefits: food.benefits,
            trimester_specific: food.trimester_specific
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this food?')) return;
        try {
            await deleteNutritionFood(id);
            await loadFoods();
        } catch (error) {
            console.error('Failed to delete food:', error);
            alert('Failed to delete food');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', category: 'fruits', description: '', benefits: '', trimester_specific: 'all' });
        setEditingFood(null);
        setShowForm(false);
    };

    return (
        <div className="admin-layout">
            <AdminNav />
            <div className="admin-content">
                <div className="page-header">
                    <div>
                        <h1>Nutrition Manager</h1>
                        <p>Manage nutrition foods and recommendations</p>
                    </div>
                    <button className="btn-primary" onClick={() => setShowForm(true)}>
                        + Add Food
                    </button>
                </div>

                {showForm && (
                    <div className="modal-overlay" onClick={resetForm}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>{editingFood ? 'Edit Food' : 'Add New Food'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Food Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Category *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="fruits">Fruits</option>
                                        <option value="vegetables">Vegetables</option>
                                        <option value="proteins">Proteins</option>
                                        <option value="dairy">Dairy</option>
                                        <option value="grains">Grains</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Description *</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Benefits *</label>
                                    <textarea
                                        value={formData.benefits}
                                        onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Trimester *</label>
                                    <select
                                        value={formData.trimester_specific}
                                        onChange={(e) => setFormData({ ...formData, trimester_specific: e.target.value })}
                                    >
                                        <option value="all">All Trimesters</option>
                                        <option value="first">First Trimester</option>
                                        <option value="second">Second Trimester</option>
                                        <option value="third">Third Trimester</option>
                                    </select>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={resetForm}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        {editingFood ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="loading">Loading nutrition foods...</div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Trimester</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {foods.map((food) => (
                                    <tr key={food.id}>
                                        <td><strong>{food.name}</strong></td>
                                        <td><span className="category-badge">{food.category}</span></td>
                                        <td>{food.trimester_specific}</td>
                                        <td>{food.description.substring(0, 80)}...</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-edit" onClick={() => handleEdit(food)}>
                                                    Edit
                                                </button>
                                                <button className="btn-delete" onClick={() => handleDelete(food.id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {foods.length === 0 && (
                            <div className="no-data">No nutrition foods found. Add your first food!</div>
                        )}
                    </div>
                )}

                <style>{`
          .category-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            background: #e0e7ff;
            color: #3730a3;
            text-transform: capitalize;
          }
        `}</style>
            </div>
        </div>
    );
};

export default NutritionManager;
