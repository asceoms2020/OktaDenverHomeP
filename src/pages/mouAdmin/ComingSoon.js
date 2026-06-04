import React from 'react';
import { Card, CardHead, CardTitle, CardBody, Empty, Badge } from '../../styles/MouEventAdmin.styles';

const ComingSoon = ({ title, phase, desc }) => (
  <Card>
    <CardHead>
      <CardTitle>{title}</CardTitle>
      <Badge $bg="rgba(243,156,18,0.14)" $color="#b9770a">{phase} 예정</Badge>
    </CardHead>
    <CardBody>
      <Empty>
        <div style={{ fontSize: '1rem', marginBottom: 8 }}>{desc}</div>
        <div style={{ fontSize: '0.85rem' }}>
          이 기능은 {phase}에서 제공됩니다. (1단계: 현황·참가자·납부 먼저 사용)
        </div>
      </Empty>
    </CardBody>
  </Card>
);

export default ComingSoon;
