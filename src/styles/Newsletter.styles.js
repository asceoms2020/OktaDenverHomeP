import styled from 'styled-components';

// Newsletter 전용 컨테이너
export const NewsletterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// 웹진 카드 스타일
export const WebzineCard = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(52, 152, 219, 0.1);
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: #3498db;
  }
`;

export const WebzineImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
`;

export const WebzineContent = styled.div`
  padding: 2rem;
`;

export const WebzineDate = styled.div`
  font-size: 0.9rem;
  color: #3498db;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const WebzineTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

export const WebzineExcerpt = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 1.5rem;
`;

// 뉴스 카드 스타일
export const NewsCard = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid #3498db;
  
  &:hover {
    transform: translateX(10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
`;

export const NewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

export const NewsDate = styled.span`
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 500;
`;

export const NewsSource = styled.span`
  font-size: 0.9rem;
  color: #e74c3c;
  font-weight: 600;
  background: rgba(231, 76, 60, 0.1);
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
`;

export const NewsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

export const NewsContent = styled.div`
  margin-bottom: 1.5rem;
`;

export const NewsSummary = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: #555;
  margin-bottom: 1.5rem;
`;

// 이벤트 관련 스타일
export const EventCard = styled.div`
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
`;

export const EventImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

export const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const EventTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
`;

export const EventDate = styled.span`
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 500;
`;

// 공통 버튼 스타일
export const ReadMoreBtn = styled.button`
  background: linear-gradient(45deg, #3498db, #2ecc71);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
  
  &:hover {
    background: linear-gradient(45deg, #2980b9, #27ae60);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// 반응형 그리드 (웹진용)
export const WebzineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// 뉴스 섹션용 특별 스타일
export const NewsSection = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 3rem;
  border-radius: 20px;
  margin: 2rem 0;
`;

// 카테고리 태그
export const CategoryTag = styled.span`
  display: inline-block;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

// 이벤트 그리드 (4개씩 배치)
export const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// 더보기 버튼 섹션
export const ViewMoreSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3rem 0;
  padding: 2rem 0;
`;

// 더 많은 웹진 보기 버튼
export const ViewMoreWebzineBtn = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1.2rem 3rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%);
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.6);
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:active {
    transform: translateY(-2px) scale(1.02);
  }
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
`; 