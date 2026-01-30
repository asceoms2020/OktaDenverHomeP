import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { translations } from '../translations/translations';
import {
  AdminContainer,
  AdminHeader,
  AdminForm,
  FormGroup,
  ImagePreview,
  SubmitButton,
  CancelButton,
  ErrorMessage,
  SuccessMessage,
  EventListContainer,
  EventListHeader,
  EventList,
  EventItem,
  EventInfo,
  ActionButtons,
  ActionButton,
} from '../styles/Admin.styles';

import {
  fetchAboutContent,
  insertAboutPerson,
  updateAboutPerson,
  deleteAboutPerson,
  uploadAboutPhoto,
  removeAboutPhoto,
} from '../services/aboutPeople';

import jkcAsset from '../assets/images/about/jkc.png';
import sjpAsset from '../assets/images/about/sjp.jpg';
import sykAsset from '../assets/images/about/syk.png';
import swlAsset from '../assets/images/about/swl.png';
import dysAsset from '../assets/images/about/dys.png';
import yjsAsset from '../assets/images/about/yjs.png';

const emptyCeoForm = {
  name_ko: '',
  name_en: '',
  greeting_ko: '',
  greeting_en: '',
  signature_ko: '',
  signature_en: '',
  is_active: true,
};

const emptyBoardForm = {
  name_ko: '',
  name_en: '',
  position_ko: '',
  position_en: '',
  is_active: true,
};

const AdminAbout = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [ceo, setCeo] = useState(null);
  const [board, setBoard] = useState([]);

  const [ceoForm, setCeoForm] = useState(emptyCeoForm);
  const [ceoImageFile, setCeoImageFile] = useState(null);
  const [ceoImagePreview, setCeoImagePreview] = useState(null);

  const [boardEditingId, setBoardEditingId] = useState(null);
  const [boardForm, setBoardForm] = useState(emptyBoardForm);
  const [boardImageFile, setBoardImageFile] = useState(null);
  const [boardImagePreview, setBoardImagePreview] = useState(null);

  const legacyImages = useMemo(() => {
    return {
      'jkc.png': { url: jkcAsset, filename: 'jkc.png' },
      'sjp.jpg': { url: sjpAsset, filename: 'sjp.jpg' },
      'syk.png': { url: sykAsset, filename: 'syk.png' },
      'swl.png': { url: swlAsset, filename: 'swl.png' },
      'dys.png': { url: dysAsset, filename: 'dys.png' },
      'yjs.png': { url: yjsAsset, filename: 'yjs.png' },
    };
  }, []);

  const sortedBoard = useMemo(() => {
    return [...board].sort((a, b) => {
      const ao = typeof a.sort_order === 'number' ? a.sort_order : 0;
      const bo = typeof b.sort_order === 'number' ? b.sort_order : 0;
      if (ao !== bo) return ao - bo;
      return String(a.created_at || '').localeCompare(String(b.created_at || ''));
    });
  }, [board]);

  const fetchAll = async () => {
    const { ceo: ceoRow, board: boardRows } = await fetchAboutContent();
    setCeo(ceoRow);
    setBoard(boardRows || []);

    if (ceoRow) {
      setCeoForm({
        name_ko: ceoRow.name_ko || '',
        name_en: ceoRow.name_en || '',
        greeting_ko: ceoRow.greeting_ko || '',
        greeting_en: ceoRow.greeting_en || '',
        signature_ko: ceoRow.signature_ko || '',
        signature_en: ceoRow.signature_en || '',
        is_active: ceoRow.is_active !== false,
      });
      setCeoImagePreview(ceoRow.photo_url || null);
      setCeoImageFile(null);
    } else {
      setCeoForm(emptyCeoForm);
      setCeoImagePreview(null);
      setCeoImageFile(null);
    }
  };

  const generateUuid = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }

    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
      const hex = Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }

    // Last-resort fallback (still uuid-like, but less strong randomness)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.floor(Math.random() * 16);
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const assetToFile = async ({ assetUrl, filename }) => {
    const res = await fetch(assetUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch asset: ${filename}`);
    }
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || undefined });
  };

  const handleImportLegacy = async () => {
    if (!user || !isAdmin) return;
    if (!window.confirm('Import legacy About data (one-time)? This will seed CEO + board members from translations.')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const insertedIds = [];
    const uploadedPaths = [];

    const rollback = async () => {
      for (const id of insertedIds) {
        try {
          await deleteAboutPerson(id);
        } catch (e) {
          console.warn('Rollback: failed to delete about_people row:', id, e);
        }
      }

      for (const path of uploadedPaths) {
        try {
          await removeAboutPhoto(path);
        } catch (e) {
          console.warn('Rollback: failed to remove about photo:', path, e);
        }
      }
    };

    try {
      const { ceo: existingCeo, board: existingBoard } = await fetchAboutContent();
      if (existingCeo || (existingBoard && existingBoard.length > 0)) {
        setError('Import blocked: about_people is not empty.');
        return;
      }

      const koAbout = translations?.ko?.about;
      const enAbout = translations?.en?.about;
      if (!koAbout || !enAbout) {
        throw new Error('Legacy translations not found (ko/en about).');
      }

      const koCeo = koAbout.ceoMessage;
      const enCeo = enAbout.ceoMessage;
      if (!koCeo || !enCeo) {
        throw new Error('Legacy CEO translations not found.');
      }

      const ceoId = generateUuid();
      const ceoImage = legacyImages['jkc.png'];
      let ceoPhotoPatch = {};
      if (ceoImage?.url) {
        const file = await assetToFile({ assetUrl: ceoImage.url, filename: ceoImage.filename });
        const uploaded = await uploadAboutPhoto({ file, type: 'ceo', personId: ceoId });
        ceoPhotoPatch = { photo_path: uploaded.photo_path, photo_url: uploaded.photo_url };
        if (uploaded.photo_path) uploadedPaths.push(uploaded.photo_path);
      }

      await insertAboutPerson({
        id: ceoId,
        type: 'ceo',
        sort_order: 0,
        name_ko: koCeo.name || '',
        name_en: enCeo.name || '',
        greeting_ko: koCeo.greeting || '',
        greeting_en: enCeo.greeting || '',
        signature_ko: koCeo.signature || '',
        signature_en: enCeo.signature || '',
        is_active: true,
        created_by: user.id,
        updated_by: user.id,
        ...ceoPhotoPatch,
      });
      insertedIds.push(ceoId);

      const koMembers = koAbout.boardMembers?.members || [];
      const enMembers = enAbout.boardMembers?.members || [];
      if (enMembers.length !== koMembers.length) {
        throw new Error(`Legacy board member count mismatch (ko=${koMembers.length}, en=${enMembers.length}).`);
      }

      for (let i = 0; i < koMembers.length; i += 1) {
        const km = koMembers[i] || {};
        const em = enMembers[i] || {};
        const id = generateUuid();

        let photoPatch = {};
        const imageName = km.image || em.image;
        if (imageName && legacyImages[imageName]?.url) {
          const asset = legacyImages[imageName];
          const file = await assetToFile({ assetUrl: asset.url, filename: asset.filename });
          const uploaded = await uploadAboutPhoto({ file, type: 'board', personId: id });
          photoPatch = { photo_path: uploaded.photo_path, photo_url: uploaded.photo_url };
          if (uploaded.photo_path) uploadedPaths.push(uploaded.photo_path);
        }

        await insertAboutPerson({
          id,
          type: 'board',
          sort_order: i + 1,
          name_ko: km.name || '',
          name_en: em.name || '',
          position_ko: km.position || '',
          position_en: em.position || '',
          is_active: true,
          created_by: user.id,
          updated_by: user.id,
          ...photoPatch,
        });
        insertedIds.push(id);
      }

      setSuccess('Legacy About data imported successfully!');
      await fetchAll();
    } catch (err) {
      console.error('Import legacy About failed:', err);
      await rollback();
      setError(`Import failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !isAdmin) return;
    fetchAll().catch((e) => {
      console.error('Failed to load About content:', e);
      setError(e.message || 'Failed to load About content');
    });
  }, [user, isAdmin]);

  if (!user) {
    return (
      <AdminContainer>
        <AdminHeader>
          <h1>Access Denied</h1>
          <p>Please log in to access the admin panel.</p>
        </AdminHeader>
      </AdminContainer>
    );
  }

  if (!isAdmin) {
    return (
      <AdminContainer>
        <AdminHeader>
          <h1>Unauthorized</h1>
          <p>You do not have permission to access this page.</p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
            Current user: {user.email}
          </p>
        </AdminHeader>
      </AdminContainer>
    );
  }

  const readAsPreview = (file, setPreview) => {
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCeoInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCeoForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCeoImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCeoImageFile(file);
    readAsPreview(file, setCeoImagePreview);
  };

  const handleSaveCeo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const previousPhotoPath = ceo?.photo_path || null;

    try {
      let photoPatch = {};
      if (ceoImageFile) {
        const uploaded = await uploadAboutPhoto({ file: ceoImageFile, type: 'ceo' });
        photoPatch = {
          photo_path: uploaded.photo_path,
          photo_url: uploaded.photo_url,
        };
      }

      const payload = {
        type: 'ceo',
        sort_order: 0,
        name_ko: ceoForm.name_ko,
        name_en: ceoForm.name_en,
        greeting_ko: ceoForm.greeting_ko,
        greeting_en: ceoForm.greeting_en,
        signature_ko: ceoForm.signature_ko,
        signature_en: ceoForm.signature_en,
        is_active: !!ceoForm.is_active,
        updated_by: user.id,
        ...photoPatch,
      };

      if (ceo?.id) {
        await updateAboutPerson(ceo.id, payload);
        setSuccess('CEO updated successfully!');
      } else {
        await insertAboutPerson({
          ...payload,
          created_by: user.id,
        });
        setSuccess('CEO created successfully!');
      }

      if (ceoImageFile && previousPhotoPath && photoPatch.photo_path && previousPhotoPath !== photoPatch.photo_path) {
        try {
          await removeAboutPhoto(previousPhotoPath);
        } catch (cleanupErr) {
          console.warn('Failed to remove previous CEO photo:', cleanupErr);
        }
      }

      await fetchAll();
    } catch (err) {
      console.error('Error saving CEO:', err);
      setError(`Failed to save CEO: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCeoPhoto = async () => {
    if (!ceo?.id) return;
    if (!ceo.photo_path) return;
    if (!window.confirm('Remove CEO photo?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    const photoPath = ceo.photo_path;

    try {
      await updateAboutPerson(ceo.id, {
        photo_path: null,
        photo_url: null,
        updated_by: user.id,
      });

      try {
        await removeAboutPhoto(photoPath);
      } catch (cleanupErr) {
        console.warn('Failed to remove CEO photo from storage:', cleanupErr);
      }

      setSuccess('CEO photo removed.');
      await fetchAll();
    } catch (err) {
      setError(`Failed to remove CEO photo: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBoardInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBoardForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBoardImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBoardImageFile(file);
    readAsPreview(file, setBoardImagePreview);
  };

  const resetBoardForm = () => {
    setBoardEditingId(null);
    setBoardForm(emptyBoardForm);
    setBoardImageFile(null);
    setBoardImagePreview(null);
    setError('');
    setSuccess('');
  };

  const handleEditBoard = (member) => {
    setBoardEditingId(member.id);
    setBoardForm({
      name_ko: member.name_ko || '',
      name_en: member.name_en || '',
      position_ko: member.position_ko || '',
      position_en: member.position_en || '',
      is_active: member.is_active !== false,
    });
    setBoardImagePreview(member.photo_url || null);
    setBoardImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setError('');
    setSuccess('');
  };

  const handleSaveBoard = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const existing = boardEditingId ? board.find((b) => b.id === boardEditingId) : null;
    const previousPhotoPath = existing?.photo_path || null;

    try {
      let photoPatch = {};
      if (boardImageFile) {
        const uploaded = await uploadAboutPhoto({ file: boardImageFile, type: 'board' });
        photoPatch = {
          photo_path: uploaded.photo_path,
          photo_url: uploaded.photo_url,
        };
      }

      if (boardEditingId) {
        await updateAboutPerson(boardEditingId, {
          name_ko: boardForm.name_ko,
          name_en: boardForm.name_en,
          position_ko: boardForm.position_ko,
          position_en: boardForm.position_en,
          is_active: !!boardForm.is_active,
          updated_by: user.id,
          ...photoPatch,
        });

        if (boardImageFile && previousPhotoPath && photoPatch.photo_path && previousPhotoPath !== photoPatch.photo_path) {
          try {
            await removeAboutPhoto(previousPhotoPath);
          } catch (cleanupErr) {
            console.warn('Failed to remove previous board photo:', cleanupErr);
          }
        }

        setSuccess('Board member updated successfully!');
      } else {
        const maxSort = sortedBoard.reduce((acc, cur) => {
          const so = typeof cur.sort_order === 'number' ? cur.sort_order : 0;
          return Math.max(acc, so);
        }, 0);

        await insertAboutPerson({
          type: 'board',
          sort_order: maxSort + 1,
          name_ko: boardForm.name_ko,
          name_en: boardForm.name_en,
          position_ko: boardForm.position_ko,
          position_en: boardForm.position_en,
          is_active: !!boardForm.is_active,
          created_by: user.id,
          updated_by: user.id,
          ...photoPatch,
        });
        setSuccess('Board member created successfully!');
      }

      resetBoardForm();
      await fetchAll();
    } catch (err) {
      console.error('Error saving board member:', err);
      setError(`Failed to save board member: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBoardPhoto = async () => {
    if (!boardEditingId) return;
    const member = board.find((b) => b.id === boardEditingId);
    if (!member?.photo_path) return;
    if (!window.confirm('Remove this member photo?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    const photoPath = member.photo_path;
    try {
      await updateAboutPerson(boardEditingId, {
        photo_path: null,
        photo_url: null,
        updated_by: user.id,
      });

      try {
        await removeAboutPhoto(photoPath);
      } catch (cleanupErr) {
        console.warn('Failed to remove board photo from storage:', cleanupErr);
      }

      setSuccess('Member photo removed.');
      await fetchAll();
    } catch (err) {
      setError(`Failed to remove member photo: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBoard = async (id) => {
    const member = board.find((b) => b.id === id);
    if (!window.confirm('Are you sure you want to delete this board member?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await deleteAboutPerson(id);
      setSuccess('Board member deleted successfully!');
      await fetchAll();

      if (member?.photo_path) {
        try {
          await removeAboutPhoto(member.photo_path);
        } catch (cleanupErr) {
          console.warn('Failed to remove board photo from storage:', cleanupErr);
        }
      }
    } catch (err) {
      setError(`Failed to delete board member: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const swapBoardOrder = async (index, direction) => {
    const items = sortedBoard;
    const aIndex = index;
    const bIndex = direction === 'up' ? index - 1 : index + 1;
    if (bIndex < 0 || bIndex >= items.length) return;

    const a = items[aIndex];
    const b = items[bIndex];
    if (!a?.id || !b?.id) return;

    const aOrder = typeof a.sort_order === 'number' ? a.sort_order : 0;
    const bOrder = typeof b.sort_order === 'number' ? b.sort_order : 0;

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await updateAboutPerson(a.id, { sort_order: bOrder, updated_by: user.id });
      await updateAboutPerson(b.id, { sort_order: aOrder, updated_by: user.id });
      await fetchAll();
    } catch (err) {
      setError(`Failed to reorder: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContainer>
      <AdminHeader>
        <h1>Admin Dashboard</h1>
        <p>Manage About page (CEO & Board)</p>
        <div style={{ marginTop: '1rem' }}>
          <CancelButton type="button" onClick={() => navigate('/admin')}>Back to Events Admin</CancelButton>
        </div>
      </AdminHeader>

      <AdminForm onSubmit={(e) => e.preventDefault()}>
        <EventListHeader>Migration</EventListHeader>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        <SubmitButton
          type="button"
          onClick={handleImportLegacy}
          disabled={loading || !!ceo || (board && board.length > 0)}
          title={(!!ceo || (board && board.length > 0)) ? 'about_people is not empty' : 'Import legacy data'}
        >
          {loading ? 'Processing...' : 'Import legacy About data'}
        </SubmitButton>
        {(!!ceo || (board && board.length > 0)) && (
          <p style={{ marginTop: '0.75rem', color: '#666' }}>
            Import is disabled because About data already exists.
          </p>
        )}
      </AdminForm>

      <AdminForm onSubmit={handleSaveCeo}>
        <EventListHeader>CEO</EventListHeader>

        <FormGroup>
          <label htmlFor="ceo_name_ko">Name (KO)</label>
          <input
            type="text"
            id="ceo_name_ko"
            name="name_ko"
            value={ceoForm.name_ko}
            onChange={handleCeoInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="ceo_name_en">Name (EN)</label>
          <input
            type="text"
            id="ceo_name_en"
            name="name_en"
            value={ceoForm.name_en}
            onChange={handleCeoInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="ceo_greeting_ko">Greeting (KO)</label>
          <textarea
            id="ceo_greeting_ko"
            name="greeting_ko"
            value={ceoForm.greeting_ko}
            onChange={handleCeoInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="ceo_greeting_en">Greeting (EN)</label>
          <textarea
            id="ceo_greeting_en"
            name="greeting_en"
            value={ceoForm.greeting_en}
            onChange={handleCeoInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="ceo_signature_ko">Signature (KO)</label>
          <input
            type="text"
            id="ceo_signature_ko"
            name="signature_ko"
            value={ceoForm.signature_ko}
            onChange={handleCeoInputChange}
            placeholder="- ..."
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="ceo_signature_en">Signature (EN)</label>
          <input
            type="text"
            id="ceo_signature_en"
            name="signature_en"
            value={ceoForm.signature_en}
            onChange={handleCeoInputChange}
            placeholder="- ..."
          />
        </FormGroup>

        <FormGroup>
          <label>
            <input
              type="checkbox"
              name="is_active"
              checked={!!ceoForm.is_active}
              onChange={handleCeoInputChange}
              style={{ marginRight: '0.5rem' }}
            />
            Visible on About page
          </label>
        </FormGroup>

        <FormGroup>
          <label htmlFor="ceo_photo">CEO Photo</label>
          <input type="file" id="ceo_photo" accept="image/*" onChange={handleCeoImageChange} />
          {ceoImagePreview && (
            <ImagePreview>
              <img src={ceoImagePreview} alt="CEO preview" />
            </ImagePreview>
          )}
          {ceo?.photo_path && (
            <div style={{ marginTop: '0.75rem' }}>
              <ActionButton type="button" className="delete" onClick={handleRemoveCeoPhoto}>
                Remove Photo
              </ActionButton>
            </div>
          )}
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Processing...' : (ceo?.id ? 'Update CEO' : 'Create CEO')}
        </SubmitButton>
      </AdminForm>

      <AdminForm onSubmit={handleSaveBoard} style={{ marginTop: '2rem' }}>
        <EventListHeader>Board Members</EventListHeader>

        <FormGroup>
          <label htmlFor="board_name_ko">Name (KO)</label>
          <input
            type="text"
            id="board_name_ko"
            name="name_ko"
            value={boardForm.name_ko}
            onChange={handleBoardInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="board_name_en">Name (EN)</label>
          <input
            type="text"
            id="board_name_en"
            name="name_en"
            value={boardForm.name_en}
            onChange={handleBoardInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="board_position_ko">Position (KO)</label>
          <input
            type="text"
            id="board_position_ko"
            name="position_ko"
            value={boardForm.position_ko}
            onChange={handleBoardInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="board_position_en">Position (EN)</label>
          <input
            type="text"
            id="board_position_en"
            name="position_en"
            value={boardForm.position_en}
            onChange={handleBoardInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <label>
            <input
              type="checkbox"
              name="is_active"
              checked={!!boardForm.is_active}
              onChange={handleBoardInputChange}
              style={{ marginRight: '0.5rem' }}
            />
            Visible on About page
          </label>
        </FormGroup>

        <FormGroup>
          <label htmlFor="board_photo">Member Photo</label>
          <input type="file" id="board_photo" accept="image/*" onChange={handleBoardImageChange} />
          {boardImagePreview && (
            <ImagePreview>
              <img src={boardImagePreview} alt="Board preview" />
            </ImagePreview>
          )}
          {boardEditingId && board.find((b) => b.id === boardEditingId)?.photo_path && (
            <div style={{ marginTop: '0.75rem' }}>
              <ActionButton type="button" className="delete" onClick={handleRemoveBoardPhoto}>
                Remove Photo
              </ActionButton>
            </div>
          )}
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Processing...' : (boardEditingId ? 'Update Member' : 'Add Member')}
        </SubmitButton>

        {boardEditingId && (
          <CancelButton type="button" onClick={resetBoardForm}>
            Cancel Edit
          </CancelButton>
        )}
      </AdminForm>

      <EventListContainer>
        <EventListHeader>Existing Board Members</EventListHeader>
        <EventList>
          {sortedBoard.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center' }}>No board members found.</p>
          ) : (
            sortedBoard.map((member, index) => (
              <EventItem key={member.id}>
                <EventInfo>
                  <h3>{member.name_ko || member.name_en || 'Unnamed'}</h3>
                  <div className="date">{member.position_ko || member.position_en || ''}</div>
                  {member.is_active === false && (
                    <div className="badge" style={{ background: '#95a5a6' }}>Hidden</div>
                  )}
                </EventInfo>
                <ActionButtons style={{ alignItems: 'center' }}>
                  <ActionButton
                    type="button"
                    className="edit"
                    onClick={() => swapBoardOrder(index, 'up')}
                    disabled={loading || index === 0}
                    title="Move up"
                  >
                    ↑
                  </ActionButton>
                  <ActionButton
                    type="button"
                    className="edit"
                    onClick={() => swapBoardOrder(index, 'down')}
                    disabled={loading || index === sortedBoard.length - 1}
                    title="Move down"
                  >
                    ↓
                  </ActionButton>
                  <ActionButton type="button" className="edit" onClick={() => handleEditBoard(member)} disabled={loading}>
                    Edit
                  </ActionButton>
                  <ActionButton type="button" className="delete" onClick={() => handleDeleteBoard(member.id)} disabled={loading}>
                    Delete
                  </ActionButton>
                </ActionButtons>
              </EventItem>
            ))
          )}
        </EventList>
      </EventListContainer>
    </AdminContainer>
  );
};

export default AdminAbout;
