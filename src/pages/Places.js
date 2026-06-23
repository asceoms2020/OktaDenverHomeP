import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchPlaces, insertPlace, deletePlace, placeMapUrl, placeMapEmbed } from '../services/mouAdmin';

const CATEGORIES = ['Pub', 'Restaurant', '기타'];

const Places = () => {
  const { isAdmin } = useAuth();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ category: 'Pub', name: '', address: '', url: '' });
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchPlaces();
      setPlaces(data);
      setSelected((cur) => cur || data[0] || null);
    } catch (e) {
      setMsg(`불러오기 실패: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const grouped = useMemo(() => {
    const g = {};
    places.forEach((p) => { (g[p.category || '기타'] = g[p.category || '기타'] || []).push(p); });
    const order = [...CATEGORIES, ...Object.keys(g).filter((k) => !CATEGORIES.includes(k))];
    return order.filter((k) => g[k]?.length).map((k) => ({ category: k, items: g[k] }));
  }, [places]);

  const add = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setMsg('장소 이름을 입력하세요.'); return; }
    setSaving(true); setMsg('');
    try {
      await insertPlace({
        category: form.category, name: form.name.trim(),
        address: form.address.trim() || null, url: form.url.trim() || null,
        sort_order: places.length + 1,
      });
      setForm({ category: form.category, name: '', address: '', url: '' });
      await load();
    } catch (err) {
      setMsg(`추가 실패: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`'${p.name}' 을(를) 삭제할까요?`)) return;
    try { await deletePlace(p.id); await load(); }
    catch (err) { setMsg(`삭제 실패: ${err.message}`); }
  };

  const input = { padding: '10px 12px', border: '1px solid rgba(17,24,39,0.16)', borderRadius: 10, fontSize: '0.95rem', outline: 'none' };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '110px 20px 70px', color: '#1f2a37' }}>
      <h1 style={{ fontSize: '1.9rem', margin: 0 }}>교류회 추천 장소</h1>
      <p style={{ color: '#6b7280', marginTop: 8, lineHeight: 1.6 }}>
        덴버 · 하이랜드랜치 · 오로라 등 주변 지역 교류회 추천 장소입니다. 이름을 누르면 구글 지도로 연결됩니다.
        <br />(리스트 확정 후 단톡방 공지)
      </p>

      {msg && (
        <div style={{ margin: '14px 0', padding: '10px 12px', borderRadius: 10, background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.25)', color: '#c0392b' }}>{msg}</div>
      )}

      {/* 임베드 지도 (선택한 장소 표시) */}
      {selected && (
        <div style={{ margin: '18px 0 8px' }}>
          <iframe
            title="장소 지도"
            src={placeMapEmbed(selected)}
            width="100%"
            height="360"
            style={{ border: 0, borderRadius: 14, boxShadow: '0 6px 20px rgba(17,24,39,0.1)' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: 6 }}>
            지도: <strong style={{ color: '#1f2a37' }}>{selected.name}</strong> · 아래 목록에서 장소를 누르면 지도가 이동합니다.
          </div>
        </div>
      )}

      {/* 관리자 추가 폼 */}
      {isAdmin && (
        <form onSubmit={add} style={{ margin: '18px 0 26px', padding: 16, border: '1px solid rgba(17,24,39,0.1)', borderRadius: 14, background: '#fff', display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10, alignItems: 'center' }}>
          <div style={{ gridColumn: '1 / -1', fontWeight: 800 }}>+ 장소 추가 (관리자)</div>
          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>분류</span>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ ...input, width: 200 }}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>이름</span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="장소 이름" style={input} />
          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>주소</span>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="주소 (구글맵 검색에 사용)" style={input} />
          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>링크(선택)</span>
          <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="직접 링크가 있으면 입력 (없으면 자동 구글맵)" style={input} />
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={saving} style={{ padding: '10px 18px', border: 'none', borderRadius: 999, background: 'linear-gradient(45deg,#2ecc71,#27ae60)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
              {saving ? '추가 중…' : '추가'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p style={{ color: '#9ca3af' }}>불러오는 중…</p>
      ) : grouped.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>등록된 장소가 없습니다.</p>
      ) : grouped.map((g) => (
        <div key={g.category} style={{ marginBottom: 26 }}>
          <h2 style={{ fontSize: '1.15rem', borderBottom: '2px solid rgba(46,204,113,0.35)', paddingBottom: 8, marginBottom: 12 }}>{g.category}</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {g.items.map((p) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 14px', border: `1px solid ${selected && selected.id === p.id ? 'rgba(46,204,113,0.6)' : 'rgba(17,24,39,0.08)'}`, borderRadius: 12, background: selected && selected.id === p.id ? 'rgba(46,204,113,0.05)' : '#fff' }}>
                <div style={{ minWidth: 0 }}>
                  <button
                    onClick={() => setSelected(p)}
                    style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', fontWeight: 800, color: '#1f7a3b', fontSize: '1.02rem', textAlign: 'left' }}
                    title="지도에서 보기"
                  >
                    📍 {p.name}
                  </button>
                  {p.address && <div style={{ color: '#6b7280', fontSize: '0.88rem', marginTop: 3 }}>{p.address}</div>}
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
                  <button onClick={() => setSelected(p)} style={{ border: 'none', background: 'transparent', color: '#1f7a3b', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap', fontWeight: 700 }}>지도에서 보기</button>
                  <a href={placeMapUrl(p)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: '#1f5a7a', textDecoration: 'none', whiteSpace: 'nowrap' }}>구글맵 열기 ↗</a>
                  {isAdmin && (
                    <button onClick={() => remove(p)} style={{ border: 'none', background: 'transparent', color: '#c0392b', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>삭제</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Places;
