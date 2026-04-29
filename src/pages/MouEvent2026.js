import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
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
  LoginGate,
  SectionTitle,
  RadioGroup,
  RadioLabel,
  CheckboxGroup,
  CheckboxLabel,
  Textarea,
  Notice
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

const INTEREST_OPTIONS = [
  '수출입',
  '투자',
  '유통/리테일',
  '스타트업',
  '기타'
];

const MouEvent2026 = () => {
  const { user, userProfile } = useAuth();
  const { language } = useLanguage();
  const t = translations[language]?.mouEvent2026 || translations.en.mouEvent2026;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rowId, setRowId] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageError, setMessageError] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    full_name_ko: '',
    full_name_en: '',
    gender: '',
    okta_chapter_country: '',
    okta_chapter_city: '',
    phone_number: '',
    kakaotalk_id: '',
    // 새로 추가된 기본 정보
    member_type: '',
    job_title: '',
    company_name: '',
    // 프로그램 선택 (본인)
    program_self: '',
    // 골프 관련 정보
    golf_handicap: '',
    golf_level: '',
    golf_club_rental: '',
    cart_share: '',
    cart_share_with: '',
    // 동반자 정보
    companion_count: '',
    companion_names: '',
    // 동반자 프로그램 선택 (단일 선택으로 변경)
    companion_program_selection: '',
    // 동반자 골프 정보 (동반자가 골프 참가 시)
    companion_golf_handicap: '',
    companion_golf_level: '',
    companion_golf_club_rental: '',
    companion_cart_share: '',
    // 교류 관련
    expectations: '',
    interest_areas: [],
    // 동의 체크박스
    agree_paid_program: false,
    agree_additional_cost: false,
    agree_privacy: false,
    // 일정 정보
    arrival_date: '',
    arrival_time: '',
    departure_date: '',
    departure_time: ''
  });

  const timeOptions = useMemo(() => buildTimeOptions(30), []);

  // 관심 분야 번역 매핑
  const interestMap = {
    '수출입': t.areas.exportImport,
    '투자': t.areas.investment,
    '유통/리테일': t.areas.retail,
    '스타트업': t.areas.startup,
    '기타': t.areas.other
  };

  const countryOptions = useMemo(() => Object.keys(OKTA_CHAPTERS).sort(), []);
  const cityOptions = useMemo(() => {
    if (!formData.okta_chapter_country) return [];
    return OKTA_CHAPTERS[formData.okta_chapter_country] || [];
  }, [formData.okta_chapter_country]);

  const showGolfFields = formData.program_self === 'golf';
  const hasCompanion = formData.companion_count && Number(formData.companion_count) > 0;

  useEffect(() => {
    if (!user) return;
    let mounted = true;

    const prefillFromProfile = () => {
      const email = user?.email || '';
      const full_name_ko = userProfile?.full_name_ko || '';
      const full_name_en = userProfile?.full_name_en || '';
      const gender = userProfile?.gender || '';
      const phone_number = userProfile?.phone_number || '';
      const okta_chapter_country = userProfile?.okta_chapter_country || '';
      const okta_chapter_city = userProfile?.okta_chapter_city || '';
      const kakaotalk_id = userProfile?.kakaotalk_id || '';
      const member_type = userProfile?.member_type || '';
      const job_title = userProfile?.job_title || '';
      const company_name = userProfile?.company_name || '';
      return {
        email,
        full_name_ko,
        full_name_en,
        gender,
        okta_chapter_country,
        okta_chapter_city,
        phone_number,
        kakaotalk_id,
        member_type,
        job_title,
        company_name
      };
    };

    const fetchExisting = async () => {
      setLoading(true);
      setMessage(null);
      try {
        const authClient = getAuthenticatedClient();
        const { data, error } = await authClient
          .from('mouevent2026')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        const base = {
          ...prefillFromProfile(),
          program_self: '',
          golf_handicap: '',
          golf_level: '',
          golf_club_rental: '',
          cart_share: '',
          cart_share_with: '',
          companion_count: '',
          companion_names: '',
          companion_program_selection: '',
          companion_golf_handicap: '',
          companion_golf_level: '',
          companion_golf_club_rental: '',
          companion_cart_share: '',
          expectations: '',
          interest_areas: [],
          agree_paid_program: false,
          agree_additional_cost: false,
          agree_privacy: false,
          arrival_date: '',
          arrival_time: '',
          departure_date: '',
          departure_time: ''
        };

        const row = data;

        if (!mounted) return;

        if (row) {
          setRowId(row.id || null);
          setCancelled(row.cancelled === 'O');

          // 동반자 프로그램 선택 상태 변환
          let compSel = '';
          if (row.companion_program_golf) compSel = 'golf';
          else if (row.companion_program_train) compSel = 'train';
          else if (row.companion_program_dinner) compSel = 'dinner';

          setFormData({
            ...base,
            email: row.email ?? base.email,
            full_name_ko: row.full_name_ko ?? base.full_name_ko,
            full_name_en: row.full_name_en ?? base.full_name_en,
            gender: row.gender ?? base.gender,
            okta_chapter_country: row.okta_chapter_country ?? base.okta_chapter_country,
            okta_chapter_city: row.okta_chapter_city ?? base.okta_chapter_city,
            phone_number: row.phone_number ?? base.phone_number,
            kakaotalk_id: row.kakaotalk_id ?? base.kakaotalk_id,
            member_type: row.member_type ?? base.member_type,
            job_title: row.job_title ?? base.job_title,
            company_name: row.company_name ?? base.company_name,
            program_self: row.program_self ?? base.program_self,
            golf_handicap: row.golf_handicap ?? base.golf_handicap,
            golf_level: row.golf_level ?? base.golf_level,
            golf_club_rental: row.golf_club_rental ?? base.golf_club_rental,
            cart_share: row.cart_share ?? base.cart_share,
            cart_share_with: row.cart_share_with ?? base.cart_share_with,
            companion_count: row.companion_count === null || row.companion_count === undefined ? '' : String(row.companion_count),
            companion_names: row.companion_names ?? base.companion_names,
            companion_program_selection: compSel, // 설정
            companion_golf_handicap: row.companion_golf_handicap ?? base.companion_golf_handicap,
            companion_golf_level: row.companion_golf_level ?? base.companion_golf_level,
            companion_golf_club_rental: row.companion_golf_club_rental ?? base.companion_golf_club_rental,
            companion_cart_share: row.companion_cart_share ?? base.companion_cart_share,
            expectations: row.expectations ?? base.expectations,
            interest_areas: row.interest_areas ?? base.interest_areas,
            agree_paid_program: row.agree_paid_program ?? base.agree_paid_program,
            agree_additional_cost: row.agree_additional_cost ?? base.agree_additional_cost,
            agree_privacy: row.agree_privacy ?? base.agree_privacy,
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
        console.error(e);
        setMessage(t.messages.error);
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
    const { name, value, type, checked } = e.target;
    if (name === 'okta_chapter_country') {
      setFormData(prev => ({
        ...prev,
        okta_chapter_country: value,
        okta_chapter_city: ''
      }));
      return;
    }
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (area) => {
    setFormData(prev => {
      const current = prev.interest_areas || [];
      if (current.includes(area)) {
        return { ...prev, interest_areas: current.filter(a => a !== area) };
      }
      return { ...prev, interest_areas: [...current, area] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    // 동의 체크 검증
    if (!formData.agree_paid_program || !formData.agree_additional_cost || !formData.agree_privacy) {
      setMessage(t.messages.agreeAll);
      setMessageError(true);
      return;
    }

    setSaving(true);
    setMessage(null);
    setMessageError(false);

    try {
      const companionCount = formData.companion_count === '' ? null : Number(formData.companion_count);
      if (companionCount !== null && (!Number.isFinite(companionCount) || companionCount < 0)) {
        setMessage(t.messages.companionCountError);
        setMessageError(true);
        return;
      }

      // 동반자 프로그램 선택 값 변환
      const compSel = formData.companion_program_selection;
      const isCompGolf = companionCount > 0 && compSel === 'golf';

      const payload = {
        ...(rowId ? { id: rowId } : {}),
        user_id: user.id,
        email: (formData.email || user.email || '').trim(),
        full_name_ko: formData.full_name_ko || null,
        full_name_en: formData.full_name_en || null,
        gender: formData.gender || null,
        okta_chapter_country: formData.okta_chapter_country || null,
        okta_chapter_city: formData.okta_chapter_city || null,
        phone_number: formData.phone_number || null,
        kakaotalk_id: formData.kakaotalk_id || null,
        member_type: formData.member_type || null,
        job_title: formData.job_title || null,
        company_name: formData.company_name || null,
        program_self: formData.program_self || null,
        golf_handicap: formData.program_self === 'golf' ? formData.golf_handicap || null : null,
        golf_level: formData.program_self === 'golf' ? formData.golf_level || null : null,
        golf_club_rental: formData.program_self === 'golf' ? formData.golf_club_rental || null : null,
        cart_share: formData.program_self === 'golf' ? formData.cart_share || null : null,
        cart_share_with: formData.program_self === 'golf' && (formData.cart_share === 'yes' || formData.cart_share === 'with_companion') ? formData.cart_share_with || null : null,
        companion_count: companionCount,
        companion_names: companionCount > 0 ? formData.companion_names || null : null,
        // 변환된 값 저장
        companion_program_golf: isCompGolf,
        companion_program_train: companionCount > 0 && compSel === 'train',
        companion_program_dinner: companionCount > 0 && compSel === 'dinner',

        companion_golf_handicap: isCompGolf ? formData.companion_golf_handicap || null : null,
        companion_golf_level: isCompGolf ? formData.companion_golf_level || null : null,
        companion_golf_club_rental: isCompGolf ? formData.companion_golf_club_rental || null : null,
        companion_cart_share: isCompGolf ? formData.companion_cart_share || null : null,
        expectations: formData.expectations || null,
        interest_areas: formData.interest_areas.length > 0 ? formData.interest_areas : null,
        agree_paid_program: formData.agree_paid_program,
        agree_additional_cost: formData.agree_additional_cost,
        agree_privacy: formData.agree_privacy,
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

      setMessage(t.messages.saved);
      setMessageError(false);
    } catch (e) {
      console.error(e);
      setMessage(t.messages.error);
      setMessageError(true);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!user || !rowId) return;
    const ok = window.confirm(t.messages.cancelConfirm);
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
      setMessage(t.messages.cancelSuccess);
      setMessageError(false);
    } catch (e) {
      console.error(e);
      setMessage(t.messages.error);
      setMessageError(true);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <LoginGate>
        <Title>{t.title}</Title>
        <Subtitle>{t.loginRequired}</Subtitle>
      </LoginGate>
    );
  }

  return (
    <Page>
      <Header>
        <Title>{t.title}</Title>
        <Subtitle>
          {t.subtitle}
        </Subtitle>
      </Header>

      <Card>
        <CardHeader>
          <CardHeaderTitle>{t.formTitle}</CardHeaderTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            {/* ===== 기본 정보 ===== */}
            <SectionTitle>{t.basicInfo}</SectionTitle>

            <Field>
              <Label htmlFor="email">{t.email}</Label>
              <Input id="email" name="email" value={formData.email} onChange={handleChange} disabled />
            </Field>

            <Field>
              <Label htmlFor="full_name_ko">{t.nameKo}</Label>
              <Input id="full_name_ko" name="full_name_ko" value={formData.full_name_ko} onChange={handleChange} required />
            </Field>

            <Field>
              <Label htmlFor="full_name_en">{t.nameEn}</Label>
              <Input id="full_name_en" name="full_name_en" value={formData.full_name_en} onChange={handleChange} placeholder="Gildong Hong" required />
            </Field>

            <Field>
              <Label htmlFor="gender">{t.gender}</Label>
              <RadioGroup>
                <RadioLabel className={formData.gender === 'male' ? 'selected' : ''}>
                  <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} />
                  {t.genderOptions.male}
                </RadioLabel>
                <RadioLabel className={formData.gender === 'female' ? 'selected' : ''}>
                  <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} />
                  {t.genderOptions.female}
                </RadioLabel>
                <RadioLabel className={formData.gender === 'other' ? 'selected' : ''}>
                  <input type="radio" name="gender" value="other" checked={formData.gender === 'other'} onChange={handleChange} />
                  {t.genderOptions.other}
                </RadioLabel>
              </RadioGroup>
            </Field>

            <Field>
              <Label htmlFor="member_type">{t.memberType}</Label>
              <RadioGroup>
                <RadioLabel className={formData.member_type === 'regular' ? 'selected' : ''}>
                  <input
                    type="radio"
                    name="member_type"
                    value="regular"
                    checked={formData.member_type === 'regular'}
                    onChange={handleChange}
                  />
                  {t.memberTypes.regular}
                </RadioLabel>
                <RadioLabel className={formData.member_type === 'next_gen' ? 'selected' : ''}>
                  <input
                    type="radio"
                    name="member_type"
                    value="next_gen"
                    checked={formData.member_type === 'next_gen'}
                    onChange={handleChange}
                  />
                  {t.memberTypes.nextGen}
                </RadioLabel>
              </RadioGroup>
            </Field>

            <Field>
              <Label htmlFor="job_title">{t.jobTitle}</Label>
              <Input id="job_title" name="job_title" value={formData.job_title} onChange={handleChange} placeholder={t.jobTitlePlaceholder} />
            </Field>

            <Field>
              <Label htmlFor="company_name">{t.companyName}</Label>
              <Input id="company_name" name="company_name" value={formData.company_name} onChange={handleChange} placeholder={t.companyNamePlaceholder} />
            </Field>

            <Field>
              <Label htmlFor="phone_number">{t.phone}</Label>
              <Input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="+1 123-456-7890" required />
            </Field>

            <Field>
              <Label htmlFor="kakaotalk_id">{t.kakaoId}</Label>
              <Input id="kakaotalk_id" name="kakaotalk_id" value={formData.kakaotalk_id} onChange={handleChange} placeholder={t.kakaoId} />
            </Field>

            <Field>
              <Label htmlFor="okta_chapter_country">{t.country}</Label>
              <Select id="okta_chapter_country" name="okta_chapter_country" value={formData.okta_chapter_country} onChange={handleChange}>
                <option value="">{t.selectCountry}</option>
                {countryOptions.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </Select>
            </Field>

            <Field>
              <Label htmlFor="okta_chapter_city">{t.city}</Label>
              <Select id="okta_chapter_city" name="okta_chapter_city" value={formData.okta_chapter_city} onChange={handleChange} disabled={!formData.okta_chapter_country}>
                <option value="">{formData.okta_chapter_country ? t.selectCity : t.selectCountryFirst}</option>
                {cityOptions.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </Select>
            </Field>

            {/* ===== 프로그램 선택 (본인) ===== */}
            <SectionTitle>{t.programSelf}</SectionTitle>

            <FullRow>
              <Field>
                <Label>{t.programLabel}</Label>
                <RadioGroup>
                  <RadioLabel className={formData.program_self === 'golf' ? 'selected' : ''}>
                    <input
                      type="radio"
                      name="program_self"
                      value="golf"
                      checked={formData.program_self === 'golf'}
                      onChange={handleChange}
                    />
                    {t.programs.golf}
                  </RadioLabel>
                  <RadioLabel className={formData.program_self === 'train' ? 'selected' : ''}>
                    <input
                      type="radio"
                      name="program_self"
                      value="train"
                      checked={formData.program_self === 'train'}
                      onChange={handleChange}
                    />
                    {t.programs.train}
                  </RadioLabel>
                  <RadioLabel className={formData.program_self === 'dinner_only' ? 'selected' : ''}>
                    <input
                      type="radio"
                      name="program_self"
                      value="dinner_only"
                      checked={formData.program_self === 'dinner_only'}
                      onChange={handleChange}
                    />
                    {t.programs.dinner}
                  </RadioLabel>
                </RadioGroup>
              </Field>
            </FullRow>

            <Notice>
              {(t.programNotice || []).map((notice, i) => (
                <p key={i}>{notice}</p>
              ))}
            </Notice>

            {/* ===== 골프 관련 정보 (골프 선택자만) ===== */}
            {showGolfFields && (
              <>
                <SectionTitle>{t.golfInfo}</SectionTitle>

                <Field>
                  <Label htmlFor="golf_handicap">{t.golfHandicap}</Label>
                  <Input
                    id="golf_handicap"
                    name="golf_handicap"
                    value={formData.golf_handicap}
                    onChange={handleChange}
                    placeholder={t.handicapPlaceholder}
                  />
                </Field>

                <Field>
                  <Label>{t.golfLevel}</Label>
                  <RadioGroup>
                    <RadioLabel className={formData.golf_level === '상급' ? 'selected' : ''}>
                      <input type="radio" name="golf_level" value="상급" checked={formData.golf_level === '상급'} onChange={handleChange} />
                      {t.golfLevels.advanced}
                    </RadioLabel>
                    <RadioLabel className={formData.golf_level === '중급' ? 'selected' : ''}>
                      <input type="radio" name="golf_level" value="중급" checked={formData.golf_level === '중급'} onChange={handleChange} />
                      {t.golfLevels.intermediate}
                    </RadioLabel>
                    <RadioLabel className={formData.golf_level === '초급' ? 'selected' : ''}>
                      <input type="radio" name="golf_level" value="초급" checked={formData.golf_level === '초급'} onChange={handleChange} />
                      {t.golfLevels.beginner}
                    </RadioLabel>
                    <RadioLabel className={formData.golf_level === '친선 위주' ? 'selected' : ''}>
                      <input type="radio" name="golf_level" value="친선 위주" checked={formData.golf_level === '친선 위주'} onChange={handleChange} />
                      {t.golfLevels.friendly}
                    </RadioLabel>
                  </RadioGroup>
                </Field>

                {/* 골프채 대여 */}
                <Field>
                  <Label>{t.golfClubRental}</Label>
                  <RadioGroup>
                    <RadioLabel className={formData.golf_club_rental === 'yes' ? 'selected' : ''}>
                      <input
                        type="radio"
                        name="golf_club_rental"
                        value="yes"
                        checked={formData.golf_club_rental === 'yes'}
                        onChange={handleChange}
                      />
                      {t.golfClubRentalOptions.yes}
                    </RadioLabel>
                    <RadioLabel className={formData.golf_club_rental === 'no' ? 'selected' : ''}>
                      <input
                        type="radio"
                        name="golf_club_rental"
                        value="no"
                        checked={formData.golf_club_rental === 'no'}
                        onChange={handleChange}
                      />
                      {t.golfClubRentalOptions.no}
                    </RadioLabel>
                  </RadioGroup>
                </Field>
                <Notice>
                  <p>{t.rentalNotice}</p>
                </Notice>

                <Field>
                  <Label>{t.cartShare}</Label>
                  <RadioGroup>
                    <RadioLabel className={formData.cart_share === 'yes' ? 'selected' : ''}>
                      <input
                        type="radio"
                        name="cart_share"
                        value="yes"
                        checked={formData.cart_share === 'yes'}
                        onChange={handleChange}
                      />
                      {t.cartShareOptions.yes}
                    </RadioLabel>
                    <RadioLabel className={formData.cart_share === 'no' ? 'selected' : ''}>
                      <input
                        type="radio"
                        name="cart_share"
                        value="no"
                        checked={formData.cart_share === 'no'}
                        onChange={handleChange}
                      />
                      {t.cartShareOptions.no}
                    </RadioLabel>
                    {hasCompanion && formData.companion_program_selection === 'golf' && (
                      <RadioLabel className={formData.cart_share === 'with_companion' ? 'selected' : ''}>
                        <input
                          type="radio"
                          name="cart_share"
                          value="with_companion"
                          checked={formData.cart_share === 'with_companion'}
                          onChange={handleChange}
                        />
                        {t.cartShareOptions.withCompanion}
                      </RadioLabel>
                    )}
                  </RadioGroup>
                </Field>

                {(formData.cart_share === 'yes') && (
                  <Field>
                    <Label htmlFor="cart_share_with">{t.cartShareWith}</Label>
                    <Input
                      id="cart_share_with"
                      name="cart_share_with"
                      value={formData.cart_share_with}
                      onChange={handleChange}
                      placeholder={t.cartShareWithPlaceholder}
                    />
                  </Field>
                )}
              </>
            )}

            {/* ===== 동반자 정보 ===== */}
            <SectionTitle>{t.companionInfo}</SectionTitle>

            <Field>
              <Label htmlFor="companion_count">{t.companionCount}</Label>
              <Input id="companion_count" name="companion_count" type="number" min="0" value={formData.companion_count} onChange={handleChange} placeholder="0" />
            </Field>

            {hasCompanion && (
              <>
                <FullRow>
                  <Field>
                    <Label htmlFor="companion_names">{t.companionNames}</Label>
                    <Textarea
                      id="companion_names"
                      name="companion_names"
                      value={formData.companion_names}
                      onChange={handleChange}
                      placeholder={t.companionNamesPlaceholder}
                    />
                  </Field>
                </FullRow>

                <FullRow>
                  <Field>
                    <Label>{t.companionProgram}</Label>
                    <RadioGroup>
                      <RadioLabel className={formData.companion_program_selection === 'golf' ? 'selected' : ''}>
                        <input
                          type="radio"
                          name="companion_program_selection"
                          value="golf"
                          checked={formData.companion_program_selection === 'golf'}
                          onChange={handleChange}
                        />
                        {t.companionPrograms.golf}
                      </RadioLabel>
                      <RadioLabel className={formData.companion_program_selection === 'train' ? 'selected' : ''}>
                        <input
                          type="radio"
                          name="companion_program_selection"
                          value="train"
                          checked={formData.companion_program_selection === 'train'}
                          onChange={handleChange}
                        />
                        {t.companionPrograms.train}
                      </RadioLabel>
                      <RadioLabel className={formData.companion_program_selection === 'dinner' ? 'selected' : ''}>
                        <input
                          type="radio"
                          name="companion_program_selection"
                          value="dinner"
                          checked={formData.companion_program_selection === 'dinner'}
                          onChange={handleChange}
                        />
                        {t.companionPrograms.dinner}
                      </RadioLabel>
                    </RadioGroup>
                  </Field>
                </FullRow>

                <Notice>
                  <p>{t.companionNotice}</p>
                </Notice>

                {/* 동반자 골프 정보 (골프대회 참가 선택 시) */}
                {formData.companion_program_selection === 'golf' && (
                  <>
                    <SectionTitle>{t.companionGolfInfo}</SectionTitle>

                    <Field>
                      <Label htmlFor="companion_golf_handicap">{t.companionGolfHandicap}</Label>
                      <Input
                        id="companion_golf_handicap"
                        name="companion_golf_handicap"
                        value={formData.companion_golf_handicap}
                        onChange={handleChange}
                        placeholder={t.handicapPlaceholder}
                      />
                    </Field>

                    <Field>
                      <Label>{t.companionGolfLevel}</Label>
                      <RadioGroup>
                        <RadioLabel className={formData.companion_golf_level === '상급' ? 'selected' : ''}>
                          <input type="radio" name="companion_golf_level" value="상급" checked={formData.companion_golf_level === '상급'} onChange={handleChange} />
                          {t.golfLevels.advanced}
                        </RadioLabel>
                        <RadioLabel className={formData.companion_golf_level === '중급' ? 'selected' : ''}>
                          <input type="radio" name="companion_golf_level" value="중급" checked={formData.companion_golf_level === '중급'} onChange={handleChange} />
                          {t.golfLevels.intermediate}
                        </RadioLabel>
                        <RadioLabel className={formData.companion_golf_level === '초급' ? 'selected' : ''}>
                          <input type="radio" name="companion_golf_level" value="초급" checked={formData.companion_golf_level === '초급'} onChange={handleChange} />
                          {t.golfLevels.beginner}
                        </RadioLabel>
                        <RadioLabel className={formData.companion_golf_level === '친선 위주' ? 'selected' : ''}>
                          <input type="radio" name="companion_golf_level" value="친선 위주" checked={formData.companion_golf_level === '친선 위주'} onChange={handleChange} />
                          {t.golfLevels.friendly}
                        </RadioLabel>
                      </RadioGroup>
                    </Field>

                    <Field>
                      <Label>{t.companionGolfClubRental}</Label>
                      <RadioGroup>
                        <RadioLabel className={formData.companion_golf_club_rental === 'yes' ? 'selected' : ''}>
                          <input
                            type="radio"
                            name="companion_golf_club_rental"
                            value="yes"
                            checked={formData.companion_golf_club_rental === 'yes'}
                            onChange={handleChange}
                          />
                          {t.golfClubRentalOptions.yes}
                        </RadioLabel>
                        <RadioLabel className={formData.companion_golf_club_rental === 'no' ? 'selected' : ''}>
                          <input
                            type="radio"
                            name="companion_golf_club_rental"
                            value="no"
                            checked={formData.companion_golf_club_rental === 'no'}
                            onChange={handleChange}
                          />
                          {t.golfClubRentalOptions.no}
                        </RadioLabel>
                      </RadioGroup>
                    </Field>
                    <Notice>
                      <p>{t.rentalNotice}</p>
                    </Notice>

                    <Field>
                      <Label>{t.companionCartShare}</Label>
                      <RadioGroup>
                        <RadioLabel className={formData.companion_cart_share === 'with_me' ? 'selected' : ''}>
                          <input
                            type="radio"
                            name="companion_cart_share"
                            value="with_me"
                            checked={formData.companion_cart_share === 'with_me'}
                            onChange={handleChange}
                          />
                          {t.companionCartShareOptions.withMe}
                        </RadioLabel>
                        <RadioLabel className={formData.companion_cart_share === 'no' ? 'selected' : ''}>
                          <input
                            type="radio"
                            name="companion_cart_share"
                            value="no"
                            checked={formData.companion_cart_share === 'no'}
                            onChange={handleChange}
                          />
                          {t.companionCartShareOptions.no}
                        </RadioLabel>
                      </RadioGroup>
                    </Field>
                  </>
                )}
              </>
            )}

            {/* ===== 교류 관련 ===== */}
            <SectionTitle>{t.networkingInfo}</SectionTitle>

            <FullRow>
              <Field>
                <Label htmlFor="expectations">{t.expectations}</Label>
                <Textarea
                  id="expectations"
                  name="expectations"
                  value={formData.expectations}
                  onChange={handleChange}
                  placeholder={t.expectationsPlaceholder}
                />
              </Field>
            </FullRow>

            <FullRow>
              <Field>
                <Label>{t.interestAreas}</Label>
                <RadioGroup>
                  {INTEREST_OPTIONS.map(area => (
                    <RadioLabel
                      key={area}
                      className={(formData.interest_areas || []).includes(area) ? 'selected' : ''}
                      onClick={() => handleInterestChange(area)}
                    >
                      <input
                        type="checkbox"
                        checked={(formData.interest_areas || []).includes(area)}
                        onChange={() => handleInterestChange(area)}
                      />
                      {interestMap[area] || area}
                    </RadioLabel>
                  ))}
                </RadioGroup>
              </Field>
            </FullRow>

            {/* ===== 일정 정보 ===== */}
            <SectionTitle>{t.scheduleInfo}</SectionTitle>

            <FullRow>
              <Help>
                {t.scheduleHelp}
              </Help>
            </FullRow>

            <Field>
              <Label htmlFor="arrival_date">{t.arrivalDate}</Label>
              <Input id="arrival_date" name="arrival_date" type="date" value={formData.arrival_date} onChange={handleChange} />
            </Field>

            <Field>
              <Label htmlFor="arrival_time">{t.arrivalTime}</Label>
              <Select id="arrival_time" name="arrival_time" value={formData.arrival_time} onChange={handleChange}>
                <option value="">{t.selectTime}</option>
                {timeOptions.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </Field>

            <Field>
              <Label htmlFor="departure_date">{t.departureDate}</Label>
              <Input id="departure_date" name="departure_date" type="date" value={formData.departure_date} onChange={handleChange} />
            </Field>

            <Field>
              <Label htmlFor="departure_time">{t.departureTime}</Label>
              <Select id="departure_time" name="departure_time" value={formData.departure_time} onChange={handleChange}>
                <option value="">{t.selectTime}</option>
                {timeOptions.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </Field>

            {/* ===== 동의 항목 ===== */}
            <SectionTitle>{t.agreementInfo}</SectionTitle>

            <FullRow>
              <CheckboxGroup>
                <CheckboxLabel className={formData.agree_paid_program ? 'checked' : ''}>
                  <input
                    type="checkbox"
                    name="agree_paid_program"
                    checked={formData.agree_paid_program}
                    onChange={handleChange}
                  />
                  {t.agreements.paidProgram}
                </CheckboxLabel>
                <CheckboxLabel className={formData.agree_additional_cost ? 'checked' : ''}>
                  <input
                    type="checkbox"
                    name="agree_additional_cost"
                    checked={formData.agree_additional_cost}
                    onChange={handleChange}
                  />
                  {t.agreements.additionalCost}
                </CheckboxLabel>
                <CheckboxLabel className={formData.agree_privacy ? 'checked' : ''}>
                  <input
                    type="checkbox"
                    name="agree_privacy"
                    checked={formData.agree_privacy}
                    onChange={handleChange}
                  />
                  {t.agreements.privacy}
                </CheckboxLabel>
              </CheckboxGroup>
            </FullRow>

            <FullRow>
              <Actions>
                <DangerButton type="button" onClick={handleCancel} disabled={loading || saving || !rowId || cancelled}>
                  {cancelled ? t.buttons.cancelled : t.buttons.cancel}
                </DangerButton>
                <PrimaryButton type="submit" disabled={loading || saving}>
                  {saving ? t.buttons.applying : t.buttons.apply}
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
