import { useLayoutEffect } from 'react';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../components/Feed/ProductForm';

const Write = () => {
  const { id } = useParams();
  const { pathname } = useLocation();

  return (
    <div>
      <ProductForm id={id || ''} pathname={pathname || ''} />
    </div>
  );
};

export default Write;
