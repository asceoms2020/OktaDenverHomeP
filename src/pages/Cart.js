import React from 'react';
import styled from 'styled-components';

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Cart = () => {
  return (
    <CartContainer>
      <h1>장바구니</h1>
      <p>장바구니가 비어있습니다.</p>
    </CartContainer>
  );
};

export default Cart; 