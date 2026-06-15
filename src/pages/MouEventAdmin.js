import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchParticipants } from '../services/mouAdmin';
import {
  Page, PageHeader, Title, Subtitle, Tabs, Tab, Gate, Message,
} from '../styles/MouEventAdmin.styles';
import Dashboard from './mouAdmin/Dashboard';
import Participants from './mouAdmin/Participants';
import Rooms from './mouAdmin/Rooms';
import Transport from './mouAdmin/Transport';
import Golf from './mouAdmin/Golf';
import DayVehicles from './mouAdmin/DayVehicles';
import Tasks from './mouAdmin/Tasks';
import Schedule from './mouAdmin/Schedule';
import Lodging from './mouAdmin/Lodging';
import Seating from './mouAdmin/Seating';

const TABS = [
  { key: 'dashboard', label: '현황' },
  { key: 'participants', label: '참가자' },
  { key: 'rooms', label: '방 배정' },
  { key: 'transport', label: '공항 교통' },
  { key: 'golf', label: '골프 팀' },
  { key: 'train', label: '기차팀' },
  { key: 'garden', label: 'Garden of Gods' },
  { key: 'coors', label: 'Coors' },
  { key: 'seating', label: '개회식' },
  { key: 'tasks', label: '업무 지시' },
  { key: 'schedule', label: '일정표' },
  { key: 'lodging', label: '숙박 정산' },
];

const MouEventAdmin = () => {
  const { user, userProfile, isAdmin } = useAuth();
  const [tab, setTab] = useState('dashboard');
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const adminName =
    userProfile?.full_name_ko || userProfile?.full_name_en || user?.email || '관리자';

  const load = useCallback(async () => {
    try {
      setError('');
      const data = await fetchParticipants();
      setParticipants(data);
    } catch (e) {
      setError(`데이터를 불러오지 못했습니다: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && isAdmin) load();
  }, [user, isAdmin, load]);

  if (!user) {
    return (
      <Gate>
        <h1>로그인이 필요합니다</h1>
        <p>MOU 이벤트 관리 페이지는 로그인 후 이용할 수 있습니다.</p>
      </Gate>
    );
  }

  if (!isAdmin) {
    return (
      <Gate>
        <h1>접근 권한이 없습니다</h1>
        <p>이 페이지는 관리자만 접근할 수 있습니다.</p>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: 8 }}>
          현재 계정: {user.email}
        </p>
      </Gate>
    );
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <Title>MOU 이벤트 관리</Title>
          <Subtitle>2026 비즈니스 포럼 (6/24~28) · 운영 관리자 전용</Subtitle>
        </div>
      </PageHeader>

      <Tabs>
        {TABS.map((t) => (
          <Tab key={t.key} $active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </Tab>
        ))}
      </Tabs>

      {error && <Message $error>{error}</Message>}
      {loading && <Message>불러오는 중…</Message>}

      {!loading && tab === 'dashboard' && <Dashboard participants={participants} />}
      {!loading && tab === 'participants' && (
        <Participants participants={participants} adminName={adminName} reload={load} />
      )}
      {!loading && tab === 'rooms' && <Rooms participants={participants} />}
      {!loading && tab === 'transport' && <Transport participants={participants} />}
      {!loading && tab === 'golf' && (
        <>
          <Golf participants={participants} />
          <DayVehicles participants={participants} activity="golf" label="골프장 이동"
            presets={['밴1', '밴2', 'SUV']} badgeBg="rgba(46,204,113,0.12)" badgeColor="#1f7a3b" />
        </>
      )}
      {!loading && tab === 'train' && (
        <DayVehicles participants={participants} activity="train" label="기차(Pikes Peak)"
          presets={['VAN1', 'VAN2', 'SUV']} badgeBg="rgba(155,89,182,0.1)" badgeColor="#7d3c98" />
      )}
      {!loading && tab === 'garden' && (
        <DayVehicles participants={participants} activity="garden" label="Garden of Gods"
          presets={['밴1', '밴2', 'SUV']} badgeBg="rgba(22,160,133,0.12)" badgeColor="#0e6b57" />
      )}
      {!loading && tab === 'coors' && (
        <DayVehicles participants={participants} activity="coors" label="Coors"
          presets={['밴1', '밴2', 'SUV']} badgeBg="rgba(192,57,43,0.1)" badgeColor="#a93226" />
      )}
      {!loading && tab === 'seating' && <Seating participants={participants} />}
      {!loading && tab === 'tasks' && <Tasks participants={participants} />}
      {!loading && tab === 'schedule' && <Schedule />}
      {!loading && tab === 'lodging' && (
        <Lodging participants={participants} adminName={adminName} reload={load} />
      )}
    </Page>
  );
};

export default MouEventAdmin;
