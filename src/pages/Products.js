import React from 'react';
import styled from 'styled-components';

const ProductsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Products = () => {
  return (
    <ProductsContainer>
      <h1>상품 목록</h1>
      <p>준비중이 아닙니다...</p>
    </ProductsContainer>
  );
};

export default Products; 