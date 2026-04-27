import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/admin.css';

const BASE_URL = 'https://men-style-shop.onrender.com/api/products';

const colorPrimary = '#333A40';
const colorSecondary = '#A67C52';
const colorDanger = '#D9534F';
const colorSuccess = '#5CB85C';
const colorBackground = '#F7F7F7';
const colorText = '#555';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    },
    modalHeader: {
        fontSize: '1.8em',
        fontWeight: 'bold',
        color: colorPrimary,
        marginBottom: '25px',
        borderBottom: `2px solid ${colorSecondary}`,
        paddingBottom: '10px',
    },
    modalCloseButton: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'none',
        border: 'none',
        fontSize: '1.8em',
        cursor: 'pointer',
        color: colorPrimary,
    },
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '50px auto',
        padding: '30px',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        color: colorPrimary,
        marginBottom: '40px',
        borderBottom: `2px solid ${colorSecondary}`,
        paddingBottom: '10px',
        fontSize: '2em',
    },
    searchBar: {
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        padding: '12px',
        border: `1px solid ${colorSecondary}`,
        borderRadius: '5px',
        fontSize: '1em',
        transition: 'border-color 0.3s',
    },
    buttonPrimary: {
        padding: '12px 25px',
        backgroundColor: colorPrimary,
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
    },
    buttonSecondary: {
        padding: '8px 15px',
        backgroundColor: colorSecondary,
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'background-color 0.3s ease',
        marginLeft: '5px',
    },
    buttonDelete: {
        padding: '8px 15px',
        backgroundColor: colorDanger,
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'background-color 0.3s ease',
        marginLeft: '5px',
    },
    productTableContainer: {
        overflowX: 'auto',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    },
    productTable: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableHeader: {
        backgroundColor: colorPrimary,
        color: 'white',
        padding: '15px',
        textAlign: 'left',
        fontWeight: '600',
        borderBottom: `2px solid ${colorSecondary}`,
    },
    tableCell: {
        padding: '15px',
        borderBottom: '1px solid #eee',
        color: colorText,
    },
    input: {
        width: '100%',
        padding: '12px',
        margin: '8px 0',
        border: '1px solid #ddd',
        borderRadius: '5px',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s',
        fontSize: '0.95em',
    },
    errorMessage: {
        textAlign: 'center',
        marginTop: '50px',
        color: colorDanger,
        padding: '20px',
        backgroundColor: '#fdd',
        borderRadius: '8px',
    },
    submitButton: {
        padding: '12px 25px',
        backgroundColor: colorSuccess,
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        width: '100%',
        marginTop: '20px',
        transition: 'background-color 0.3s ease',
    },
    cancelButton: {
        padding: '12px 25px',
        backgroundColor: '#999',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        width: '100%',
        marginTop: '10px',
        transition: 'background-color 0.3s ease',
    },
    statsBar: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px',
    },
    statCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        borderLeft: `4px solid ${colorSecondary}`,
    },
    statValue: {
        fontSize: '2em',
        fontWeight: 'bold',
        color: colorSecondary,
    },
    statLabel: {
        fontSize: '0.9em',
        color: '#666',
        marginTop: '5px',
    },
};

const AdminProductManager = () => {
    const { user } = useAuth();
    const token = user?.token;

    const [productData, setProductData] = useState({
        name: '',
        price: '',
        category: 't-shirts',
        imageUrl: '',
        description: '',
        sizes: SIZES.map(s => ({ size: s, stock: 0 })),
        styleTags: '',
    });

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(BASE_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            const productArray = Array.isArray(data) ? data : (data.products || []);
            setProducts(productArray);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    const handleSizeStockChange = (size, stock) => {
        setProductData(prev => ({
            ...prev,
            sizes: prev.sizes.map(s =>
                s.size === size ? { ...s, stock: parseInt(stock) || 0 } : s
            )
        }));
    };

    const resetForm = () => {
        setProductData({
            name: '',
            price: '',
            category: 't-shirts',
            imageUrl: '',
            description: '',
            sizes: SIZES.map(s => ({ size: s, stock: 0 })),
            styleTags: '',
        });
        setIsEditMode(false);
        setEditingId(null);
        setModalMessage('');
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (product) => {
        const productSizes = product.sizes && product.sizes.length > 0
            ? product.sizes
            : SIZES.map(s => ({ size: s, stock: s === 'L' ? (product.stock || 0) : 0 }));

        setProductData({
            name: product.name,
            price: product.price,
            category: product.category,
            imageUrl: product.imageUrl,
            description: product.description,
            sizes: productSizes,
            styleTags: Array.isArray(product.styleTags) ? product.styleTags.join(', ') : '',
        });
        setEditingId(product._id);
        setIsEditMode(true);
        setModalMessage('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    const getTotalStock = (product) => {
        if (!product.sizes || product.sizes.length === 0) return 0;
        return product.sizes.reduce((sum, s) => sum + (s.stock || 0), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            ...productData,
            price: Number(productData.price),
            styleTags: productData.styleTags.split(',').map(tag => tag.trim()).filter(tag => tag),
        };

        if (!token) {
            setModalMessage('Authentication token missing. Please log in as Admin.');
            setMessageType('error');
            return;
        }

        try {
            let response;
            if (isEditMode) {
                response = await fetch(`${BASE_URL}/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(dataToSend),
                });
            } else {
                response = await fetch(BASE_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(dataToSend),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`${errorData.message || response.statusText}`);
            }

            const updatedProduct = await response.json();

            if (isEditMode) {
                setProducts(prev => prev.map(p => p._id === editingId ? updatedProduct : p));
                setModalMessage(`✓ Product "${updatedProduct.name}" updated successfully!`);
            } else {
                setProducts(prev => [...prev, updatedProduct]);
                setModalMessage(`✓ Product "${updatedProduct.name}" added successfully!`);
            }

            setMessageType('success');
            setTimeout(() => {
                closeModal();
            }, 1500);

        } catch (error) {
            console.error("Error:", error);
            setModalMessage(`Error: ${error.message}`);
            setMessageType('error');
        }
    };

    const handleDeleteProduct = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            if (!token) {
                alert("Authentication token missing. Please log in as Admin.");
                return;
            }

            try {
                const response = await fetch(`${BASE_URL}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`${errorData.message || response.statusText}`);
                }

                setProducts(prev => prev.filter(p => p._id === id));
                alert(`✓ Product "${name}" deleted successfully!`);

            } catch (error) {
                console.error("Error deleting product:", error);
                alert(`Error: ${error.message}`);
            }
        }
    };

    const handleMigrate = async () => {
        if (!token) {
            alert("Authentication token missing. Please log in as Admin.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/migrate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Migration failed');
            }

            const result = await response.json();
            alert(`✓ ${result.message}`);
            fetchProducts();

        } catch (error) {
            console.error("Migration error:", error);
            alert(`Migration error: ${error.message}`);
        }
    };

    const filteredProducts = Array.isArray(products)
        ? products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    if (isLoading) {
        return <p style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2em' }}>Loading products for management...</p>;
    }

    if (error) {
        return <p style={styles.errorMessage}>Error loading data: {error}</p>;
    }

    if (!user || user.role !== 'admin') {
        return <p style={styles.errorMessage}>❌ Access Denied. You must be an **administrator** to view this page.</p>;
    }

    return (
        <div style={styles.container} className="admin-product-manager">
            <h1 style={styles.heading}>🛍️ Admin Dashboard: Product Management</h1>

            {/* Stats Section */}
            <div style={styles.statsBar} className="admin-stats-bar">
                <div style={styles.statCard} className="admin-stat-card">
                    <div style={styles.statValue} className="admin-stat-value">{products.length}</div>
                    <div style={styles.statLabel}>Total Products</div>
                </div>
                <div style={styles.statCard} className="admin-stat-card">
                    <div style={styles.statValue} className="admin-stat-value">{filteredProducts.length}</div>
                    <div style={styles.statLabel}>Filtered Results</div>
                </div>
            </div>

            {/* Search, Add Button, and Migrate */}
            <div style={styles.searchBar} className="admin-search-bar">
                <input
                    type="text"
                    placeholder="🔍 Search products by name or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
                <button
                    onClick={handleMigrate}
                    style={{ ...styles.buttonPrimary, backgroundColor: '#8B4513' }}
                    title="Migrate old products to sizes format"
                >
                    🔄 Migrate
                </button>
                <button
                    onClick={openAddModal}
                    style={styles.buttonPrimary}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colorSecondary}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colorPrimary}
                >
                    ➕ Add New Product
                </button>
            </div>

            {/* Products Table — desktop view */}
            <div style={styles.productTableContainer} className="admin-table-container admin-table-desktop">
                {filteredProducts.length === 0 ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#999' }}>
                        <p style={{ fontSize: '1.1em' }}>
                            {searchTerm ? '❌ No products found matching your search.' : '❌ No products in the database.'}
                        </p>
                    </div>
                ) : (
                    <table style={styles.productTable}>
                        <thead>
                            <tr>
                                <th className="admin-table-desktop-header" style={styles.tableHeader}>Product Name</th>
                                <th className="admin-table-desktop-header" style={styles.tableHeader}>Category</th>
                                <th className="admin-table-desktop-header" style={styles.tableHeader}>Price</th>
                                <th className="admin-table-desktop-header" style={styles.tableHeader}>Stock by Size</th>
                                <th className="admin-table-desktop-header" style={styles.tableHeader}>Total</th>
                                <th className="admin-table-desktop-header" style={styles.tableHeader}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => {
                                const totalStock = getTotalStock(product);
                                return (
                                    <tr key={product._id}>
                                        <td style={styles.tableCell}>
                                            <strong>{product.name}</strong>
                                        </td>
                                        <td style={styles.tableCell}>
                                            <span style={{
                                                backgroundColor: colorSecondary,
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.85em'
                                            }}>
                                                {product.category}
                                            </span>
                                        </td>
                                        <td style={styles.tableCell}>${product.price.toFixed(2)}</td>
                                        <td style={styles.tableCell}>
                                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                {SIZES.map(size => {
                                                    const sizeData = product.sizes?.find(s => s.size === size);
                                                    const stock = sizeData?.stock || 0;
                                                    return (
                                                        <span
                                                            key={size}
                                                            style={{
                                                                backgroundColor: stock > 0 ? '#E8F5E9' : '#FFEBEE',
                                                                color: stock > 0 ? '#2E7D32' : colorDanger,
                                                                padding: '2px 6px',
                                                                borderRadius: '3px',
                                                                fontSize: '0.75em',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            {size}:{stock}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td style={styles.tableCell}>
                                            <span style={{
                                                backgroundColor: totalStock > 0 ? '#E8F5E9' : '#FFEBEE',
                                                color: totalStock > 0 ? '#2E7D32' : colorDanger,
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.85em',
                                                fontWeight: 'bold'
                                            }}>
                                                {totalStock}
                                            </span>
                                        </td>
                                        <td style={styles.tableCell}>
                                            <div className="admin-action-buttons">
                                                <button
                                                    style={styles.buttonSecondary}
                                                    onClick={() => openEditModal(product)}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8B6239'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colorSecondary}
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    style={styles.buttonDelete}
                                                    onClick={() => handleDeleteProduct(product._id, product.name)}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B0413C'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colorDanger}
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Products Cards — mobile view */}
            <div className="admin-products-list admin-cards-mobile">
                {filteredProducts.length === 0 ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#999' }}>
                        <p style={{ fontSize: '1.1em' }}>
                            {searchTerm ? '❌ No products found matching your search.' : '❌ No products in the database.'}
                        </p>
                    </div>
                ) : (
                    filteredProducts.map(product => {
                        const totalStock = getTotalStock(product);
                        return (
                            <div key={product._id} className="admin-product-card">
                                <div className="admin-product-card-header">
                                    <span className="admin-product-card-name">{product.name}</span>
                                    <span className="admin-product-card-category">{product.category}</span>
                                </div>

                                {product.imageUrl && (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="admin-product-card-image admin-product-thumb"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                )}

                                <div className="admin-product-card-details">
                                    <div className="admin-product-card-row">
                                        <span className="admin-product-card-label">Price</span>
                                        <span className="admin-product-card-value">${product.price.toFixed(2)}</span>
                                    </div>
                                    <div className="admin-product-card-row">
                                        <span className="admin-product-card-label">Stock by Size</span>
                                        <div className="admin-stock-sizes">
                                            {SIZES.map(size => {
                                                const sizeData = product.sizes?.find(s => s.size === size);
                                                const stock = sizeData?.stock || 0;
                                                return (
                                                    <span
                                                        key={size}
                                                        className={`admin-stock-badge ${stock === 0 ? 'zero' : ''}`}
                                                    >
                                                        {size}:{stock}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="admin-product-card-row">
                                        <span className="admin-product-card-label">Total Stock</span>
                                        <span className={`admin-stock-badge ${totalStock === 0 ? 'zero' : ''}`}>
                                            {totalStock}
                                        </span>
                                    </div>
                                </div>

                                <div className="admin-action-buttons">
                                    <button
                                        style={styles.buttonSecondary}
                                        onClick={() => openEditModal(product)}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8B6239'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colorSecondary}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        style={styles.buttonDelete}
                                        onClick={() => handleDeleteProduct(product._id, product.name)}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B0413C'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colorDanger}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div style={modalStyles.overlay} className="admin-modal-overlay" onClick={closeModal}>
                    <div style={modalStyles.modal} className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            style={modalStyles.modalCloseButton}
                            onClick={closeModal}
                        >
                            ✕
                        </button>

                        <h2 style={modalStyles.modalHeader} className="admin-modal-header">
                            {isEditMode ? '✏️ Edit Product' : '➕ Add New Product'}
                        </h2>

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Product Name"
                                value={productData.name}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />

                            <div className="admin-form-grid-2col">
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Price (USD)"
                                    value={productData.price}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                    min="0.01"
                                    step="0.01"
                                />
                                <select
                                    name="category"
                                    value={productData.category}
                                    onChange={handleChange}
                                    style={styles.input}
                                >
                                    <option value="t-shirts">T-Shirts</option>
                                    <option value="jackets">Jackets</option>
                                    <option value="jeans">Jeans</option>
                                    <option value="accessories">Accessories</option>
                                </select>
                            </div>

                            {/* Size Stock Inputs */}
                            <div style={{ margin: '15px 0' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: colorPrimary }}>
                                    Stock by Size:
                                </label>
                                <div className="admin-size-grid">
                                    {SIZES.map(size => {
                                        const sizeData = productData.sizes.find(s => s.size === size);
                                        return (
                                            <div key={size} style={{ textAlign: 'center' }}>
                                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9em' }}>
                                                    {size}
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={sizeData?.stock || 0}
                                                    onChange={(e) => handleSizeStockChange(size, e.target.value)}
                                                    style={{ ...styles.input, textAlign: 'center', padding: '8px' }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <input
                                type="text"
                                name="imageUrl"
                                placeholder="Image URL"
                                value={productData.imageUrl}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />

                            <textarea
                                name="description"
                                placeholder="Product Description"
                                value={productData.description}
                                onChange={handleChange}
                                style={styles.input}
                                rows="3"
                                required
                            />

                            <input
                                type="text"
                                name="styleTags"
                                placeholder="Style Tags (comma separated: casual, summer, slim-fit)"
                                value={productData.styleTags}
                                onChange={handleChange}
                                style={styles.input}
                            />

                            {modalMessage && (
                                <div style={{
                                    padding: '12px',
                                    backgroundColor: messageType === 'success' ? '#E8F5E9' : '#FFEBEE',
                                    color: messageType === 'success' ? '#2E7D32' : colorDanger,
                                    borderRadius: '5px',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    marginBottom: '10px'
                                }}>
                                    {modalMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                style={styles.submitButton}
                                className="admin-submit-btn"
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45A049'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colorSuccess}
                            >
                                {isEditMode ? '💾 Update Product' : '➕ Add Product'}
                            </button>

                            <button
                                type="button"
                                onClick={closeModal}
                                style={styles.cancelButton}
                                className="admin-cancel-btn"
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#777'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#999'}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductManager;