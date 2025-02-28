import React from 'react';
import styled from 'styled-components';

const NewsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const News = () => {
  return (
    <NewsContainer>
      <h1>News</h1>
      <p>News</p>
    </NewsContainer>
  );
};

export default News; 