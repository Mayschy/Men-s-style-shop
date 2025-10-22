import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const BASE_URL = 'https://men-style-shop.onrender.com/api/products';


const colorPrimary = '#333A40'; 
const colorSecondary = '#A67C52';
const colorDanger = '#D9534F'; 
const colorBackground = '#F7F7F7'; 

const styles = {
    container: {
        maxWidth: '900px',
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
    card: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        marginBottom: '30px',
    },
    input: {
        width: '100%',
        padding: '12px',
        margin: '8px 0',
        border: '1px solid #ddd',
        borderRadius: '5px',
        boxSizing: 'border-box',
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
        marginTop: '15px',
        transition: 'background-color 0.3s ease',
        width: '100%',
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
        marginLeft: '10px',
    },
    productItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 0',
        borderBottom: '1px solid #eee',
    },
    errorMessage: {
        textAlign: 'center',
        marginTop: '50px',
        color: colorDanger,
        padding: '20px',
        backgroundColor: '#fdd',
        borderRadius: '8px',
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
        stock: 0,
        styleTags: '',
    });

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(BASE_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data);
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

    const handleAddProduct = async (e) => {
        e.preventDefault();
        
        const dataToSend = {
            ...productData,
            price: Number(productData.price),
            stock: Number(productData.stock),
            styleTags: productData.styleTags.split(',').map(tag => tag.trim()).filter(tag => tag),
        };

        if (!token) {
            alert("Authentication token missing. Please log in as Admin.");
            return;
        }

        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to add product: ${errorData.message || response.statusText}`);
            }

            const newProduct = await response.json();
            setProducts(prev => [...prev, newProduct]);
            
            setProductData({ name: '', price: '', category: 't-shirts', imageUrl: '', description: '', stock: 0, styleTags: '' }); 
            alert(`Product ${newProduct.name} added successfully!`);

        } catch (error) {
            console.error("Error adding product:", error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleDeleteProduct = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
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
                    throw new Error(`Failed to delete product: ${errorData.message || response.statusText}`);
                }

                setProducts(prev => prev.filter(p => p._id !== id));
                alert(`Product ${name} successfully deleted.`);

            } catch (error) {
                console.error("Error deleting product:", error);
                alert(`Error: ${error.message}`);
            }
        }
    };

    if (isLoading) {
        return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading products for management...</p>;
    }
    
    if (error) {
        return <p style={styles.errorMessage}>Error loading data: {error}</p>;
    }

    if (!user || user.role !== 'admin') {
        return <p style={styles.errorMessage}>❌ Access Denied. You must be an **administrator** to view this page.</p>;
    }


    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>🛍️ Admin Dashboard: Product Management</h1>
            
            <div style={styles.card}>
                <h2 style={{ marginBottom: '20px', fontSize: '1.4em', color: colorPrimary }}>Add New Product</h2>
                <form onSubmit={handleAddProduct} style={{ display: 'grid', gap: '10px' }}>
                    <input type="text" name="name" placeholder="Product Name" value={productData.name} onChange={handleChange} style={styles.input} required />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input type="number" name="price" placeholder="Price (USD)" value={productData.price} onChange={handleChange} style={styles.input} required min="0.01" step="0.01" />
                        <input type="number" name="stock" placeholder="Stock Quantity" value={productData.stock} onChange={handleChange} style={styles.input} required min="0" />
                    </div>

                    <select name="category" value={productData.category} onChange={handleChange} style={styles.input}>
                        <option value="t-shirts">T-Shirts</option>
                        <option value="jackets">Jackets</option>
                        <option value="jeans">Jeans</option>
                        <option value="accessories">Accessories</option>
                    </select>
                    
                    <input type="text" name="imageUrl" placeholder="Image URL" value={productData.imageUrl} onChange={handleChange} style={styles.input} required />
                    <textarea name="description" placeholder="Description" value={productData.description} onChange={handleChange} style={styles.input} rows="3" required />
                    <input type="text" name="styleTags" placeholder="Style Tags (comma separated: casual, summer, slim-fit)" value={productData.styleTags} onChange={handleChange} style={styles.input} />
                    
                    <button 
                        type="submit" 
                        style={styles.buttonPrimary}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colorSecondary}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colorPrimary}
                    >
                        ➕ Add Product
                    </button>
                </form>
            </div>
            
            <div style={{ ...styles.card, backgroundColor: colorBackground }}>
                <h2 style={{ marginBottom: '20px', fontSize: '1.4em', color: colorPrimary }}>Remove/View Products ({products.length})</h2>
                {products.length === 0 ? (
                    <p style={{ color: '#666' }}>No products found in the database.</p>
                ) : (
                    products.map(product => (
                        <div key={product._id} style={styles.productItem}>
                            <span style={{ fontWeight: '600', color: colorPrimary }}>{product.name}</span>
                            <span style={{ fontSize: '0.9em', color: '#666' }}>({product.category}) - ${product.price}</span>
                            <button 
                                style={styles.buttonDelete} 
                                onClick={() => handleDeleteProduct(product._id, product.name)}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B0413C'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colorDanger}
                            >
                                Delete 🗑️
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminProductManager;