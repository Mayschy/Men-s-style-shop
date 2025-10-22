import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams(); 

  return (
    <div className="page-content">
      <h1>Product Details for Item #{id}</h1>
      <p>Full description, size selection, and "Add to Cart" button will go here.</p>
    </div>
  );
};

export default ProductDetail;