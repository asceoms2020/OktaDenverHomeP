import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAuthenticatedClient } from '../lib/supabaseClient';
import { OKTA_CHAPTERS } from '../constants/oktaChapters';
import {
  Page,
  Header,
  Title,
  Subtitle,
  Card,
  CardHeader,
  CardHeaderTitle,
  CardBody,
  Form,
  FullRow,
  Field,
  Label,
  Input,
  Select,
  Help,
  Actions,
  PrimaryButton,
  DangerButton,
  Message,
  LoginGate
} from '../styles/MouEvent2026.styles';

const buildTimeOptions = (stepMinutes) => {
  const out = [];
  const step = Math.max(1, stepMinutes || 30);
  for (let h = 0; h < 24; h += 1) {
    for (let m = 0; m < 60; m += step) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      out.push(`${hh}:${mm}`);
    }
  }
  return out;
};

const MouEvent2026 = () => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rowId, setRowId] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageError, setMessageError] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    okta_chapter_country: '',
    okta_chapter_city: '',
    phone_number: '',
    kakaotalk_id: '',
    companion_count: '',
    arrival_date: '',
    arrival_time: '',
    departure_date: '',
    departure_time: ''
  });

  const [cancelled, setCancelled] = useState(false);

  const timeOptions = useMemo(() => buildTimeOptions(30), []);
  const countryOptions = useMemo(() => Object.keys(OKTA_CHAPTERS), []);
  const cityOptions = useMemo(() => {
    const country = formData.okta_chapter_country;
    return country ? (OKTA_CHAPTERS[country] || []) : [];
  }, [formData.okta_chapter_country]);

  useEffect(() => {
    if (!user) return;
    let mounted = true;

    const prefillFromProfile = () => {
      const email = user?.email || '';
      const full_name = userProfile?.full_name || '';
      const phone_number = userProfile?.phone_number || '';
      const okta_chapter_country = userProfile?.okta_chapter_country || '';
      const okta_chapter_city = userProfile?.okta_chapter_city || '';
      const kakaotalk_id = userProfile?.kakaotalk_id || '';
      return {
        email,
        full_name,
        okta_chapter_country,
        okta_chapter_city,
        phone_number,
        kakaotalk_id
      };
    };

    const fetchExisting = async () => {
      setLoading(true);
      setMessage(null);
      setMessageError(false);

      try {
        const authClient = getAuthenticatedClient();
        const { data, error } = await authClient
          .from('mouevent2026')
          .select('*')
          .eq('user_id', user.id)
          .limit(1);

        if (error) throw error;

        const base = {
          ...prefillFromProfile(),
          companion_count: '',
          arrival_date: '',
          arrival_time: '',
          departure_date: '',
          departure_time: ''
        };

        const row = data && data.length > 0 ? data[0] : null;
        if (!mounted) return;

        if (row) {
          setRowId(row.id || null);
          setCancelled(row.cancelled === 'O');
          setFormData({
            ...base,
            email: row.email ?? base.email,
            full_name: row.full_name ?? base.full_name,
            okta_chapter_country: row.okta_chapter_country ?? base.okta_chapter_country,
            okta_chapter_city: row.okta_chapter_city ?? base.okta_chapter_city,
            phone_number: row.phone_number ?? base.phone_number,
            kakaotalk_id: row.kakaotalk_id ?? base.kakaotalk_id,
            companion_count: row.companion_count === null || row.companion_count === undefined ? '' : String(row.companion_count),
            arrival_date: row.arrival_date || '',
            arrival_time: row.arrival_time || '',
            departure_date: row.departure_date || '',
            departure_time: row.departure_time || ''
          });
        } else {
          setRowId(null);
          setCancelled(false);
          setFormData(prev => ({
            ...prev,
            ...base
          }));
        }
      } catch (e) {
        if (!mounted) return;
        setMessage('데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        setMessageError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchExisting();

    return () => {
      mounted = false;
    };
  }, [user, userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'okta_chapter_country') {
      setFormData(prev => ({
        ...prev,
        okta_chapter_country: value,
        okta_chapter_city: ''
      }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);
    setMessageError(false);

    try {
      const companionCount = formData.companion_count === '' ? null : Number(formData.companion_count);
      if (companionCount !== null && (!Number.isFinite(companionCount) || companionCount < 0)) {
        setMessage('예상 동반자 인원은 0 이상의 숫자로 입력해주세요.');
        setMessageError(true);
        return;
      }

      const payload = {
        ...(rowId ? { id: rowId } : {}),
        user_id: user.id,
        email: (formData.email || user.email || '').trim(),
        full_name: formData.full_name || null,
        okta_chapter_country: formData.okta_chapter_country || null,
        okta_chapter_city: formData.okta_chapter_city || null,
        phone_number: formData.phone_number || null,
        kakaotalk_id: formData.kakaotalk_id || null,
        companion_count: companionCount,
        arrival_date: formData.arrival_date || null,
        arrival_time: formData.arrival_time || null,
        departure_date: formData.departure_date || null,
        departure_time: formData.departure_time || null,
        cancelled: 'X',
        cancelled_at: null,
        updated_at: new Date().toISOString()
      };

      const authClient = getAuthenticatedClient();
      const { data, error } = await authClient
        .from('mouevent2026')
        .upsert(payload, { onConflict: 'user_id' })
        .select('id')
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0 && data[0].id) {
        setRowId(data[0].id);
      }

      setCancelled(false);

      setMessage('신청 정보가 저장되었습니다. 언제든지 다시 들어와 수정할 수 있습니다.');
      setMessageError(false);
    } catch (e) {
      setMessage('저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setMessageError(true);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!user || !rowId) return;
    const ok = window.confirm('참가 신청을 취소하시겠습니까?');
    if (!ok) return;

    setSaving(true);
    setMessage(null);
    setMessageError(false);

    try {
      const authClient = getAuthenticatedClient();
      const { error } = await authClient
        .from('mouevent2026')
        .update({
          cancelled: 'O',
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', rowId);

      if (error) throw error;

      setCancelled(true);
      setMessage('참가 신청이 취소되었습니다. 다시 신청하려면 정보를 수정하고 신청하기를 누르세요.');
      setMessageError(false);
    } catch (e) {
      setMessage('취소 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setMessageError(true);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <LoginGate>
        <Title>참가 신청</Title>
        <Subtitle>로그인 후 신청서를 작성할 수 있습니다.</Subtitle>
      </LoginGate>
    );
  }

  return (
    <Page>
      <Header>
        <Title>MOU Event 2026 참가 신청</Title>
        <Subtitle>
          회원 정보는 자동으로 불러오며, 아래 내용을 입력하고 저장할 수 있습니다. 비행기 입국/출국 시간은 나중에 다시 들어와 수정 가능합니다.
        </Subtitle>
      </Header>

      <Card>
        <CardHeader>
          <CardHeaderTitle>참가 신청 양식</CardHeaderTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <Field>
              <Label htmlFor="email">이메일</Label>
              <Input id="email" name="email" value={formData.email} onChange={handleChange} disabled />
            </Field>

            <Field>
              <Label htmlFor="full_name">이름</Label>
              <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />
            </Field>

            <Field>
              <Label htmlFor="phone_number">핸드폰 번호 (국가번호 포함)</Label>
              <Input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="+1 123-456-7890" required />
            </Field>

            <Field>
              <Label htmlFor="kakaotalk_id">카카오톡 ID</Label>
              <Input id="kakaotalk_id" name="kakaotalk_id" value={formData.kakaotalk_id} onChange={handleChange} placeholder="카카오톡 ID" />
            </Field>

            <Field>
              <Label htmlFor="okta_chapter_country">소속 지회 (국가)</Label>
              <Select id="okta_chapter_country" name="okta_chapter_country" value={formData.okta_chapter_country} onChange={handleChange}>
                <option value="">국가를 선택하세요</option>
                {countryOptions.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </Select>
            </Field>

            <Field>
              <Label htmlFor="okta_chapter_city">소속 지회 (도시)</Label>
              <Select id="okta_chapter_city" name="okta_chapter_city" value={formData.okta_chapter_city} onChange={handleChange} disabled={!formData.okta_chapter_country}>
                <option value="">{formData.okta_chapter_country ? '도시를 선택하세요' : '국가를 먼저 선택하세요'}</option>
                {cityOptions.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </Select>
            </Field>

            <Field>
              <Label htmlFor="companion_count">예상 동반자 인원</Label>
              <Input id="companion_count" name="companion_count" type="number" min="0" value={formData.companion_count} onChange={handleChange} placeholder="0" />
            </Field>

            <FullRow>
              <Help>
                비행기 입국/출국 시간은 지금 모르면 비워두어도 됩니다. 나중에 다시 들어와 저장하면 업데이트됩니다.
              </Help>
            </FullRow>

            <Field>
              <Label htmlFor="arrival_date">비행기 입국 날짜</Label>
              <Input id="arrival_date" name="arrival_date" type="date" value={formData.arrival_date} onChange={handleChange} />
            </Field>

            <Field>
              <Label htmlFor="arrival_time">비행기 입국 시간</Label>
              <Select id="arrival_time" name="arrival_time" value={formData.arrival_time} onChange={handleChange}>
                <option value="">시간 선택</option>
                {timeOptions.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </Field>

            <Field>
              <Label htmlFor="departure_date">비행기 출국 날짜</Label>
              <Input id="departure_date" name="departure_date" type="date" value={formData.departure_date} onChange={handleChange} />
            </Field>

            <Field>
              <Label htmlFor="departure_time">비행기 출국 시간</Label>
              <Select id="departure_time" name="departure_time" value={formData.departure_time} onChange={handleChange}>
                <option value="">시간 선택</option>
                {timeOptions.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </Field>

            <FullRow>
              <Actions>
                <DangerButton type="button" onClick={handleCancel} disabled={loading || saving || !rowId || cancelled}>
                  {cancelled ? '취소됨' : '취소하기'}
                </DangerButton>
                <PrimaryButton type="submit" disabled={loading || saving}>
                  {saving ? '신청 중...' : '신청하기'}
                </PrimaryButton>
              </Actions>
              {message && <Message $error={messageError}>{message}</Message>}
            </FullRow>
          </Form>
        </CardBody>
      </Card>
    </Page>
  );
};

export default MouEvent2026;
