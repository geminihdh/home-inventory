import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Camera, X, Save } from 'lucide-react';
import type { InventoryItem } from '../db/schema';
import { addItem, updateItem } from '../db/inventory';
import { resizeImage } from '../utils/image';

interface AddItemFormProps {
  onItemAdded: () => void;
  onCancel: () => void;
  initialItem?: InventoryItem;
}

const COMMON_LOCATIONS = [
  '주방',
  '냉장고',
  '냉동실',
  '팬트리',
  '거실',
  '침실',
  '욕실',
  '현관',
  '베란다',
  '창고'
];

export const AddItemForm: React.FC<AddItemFormProps> = ({ onItemAdded, onCancel, initialItem }) => {
  const [name, setName] = useState(initialItem?.name || '');
  const [description, setDescription] = useState(initialItem?.description || '');
  const [location, setLocation] = useState(() => {
    if (initialItem && !COMMON_LOCATIONS.includes(initialItem.location) && initialItem.location !== '') {
      return 'Other';
    }
    return initialItem?.location || '';
  });
  const [customLocation, setCustomLocation] = useState(
    initialItem && !COMMON_LOCATIONS.includes(initialItem.location) ? initialItem.location : ''
  );
  const [purchaseDate, setPurchaseDate] = useState(initialItem?.purchaseDate || '');
  const [expiryDate, setExpiryDate] = useState(initialItem?.expiryDate || '');
  const [memo, setMemo] = useState(initialItem?.memo || '');
  const [image, setImage] = useState<string | null>(initialItem?.image || null);
  const [isResizing, setIsResizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsResizing(true);
      try {
        const resizedImage = await resizeImage(file, 800, 800);
        setImage(resizedImage);
      } catch (error) {
        console.error('Failed to resize image:', error);
        alert('이미지 처리 중 오류가 발생했습니다.');
      } finally {
        setIsResizing(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('품목 이름은 필수입니다.');
      return;
    }

    if (isSaving) return;
    setIsSaving(true);

    try {
      const finalLocation = customLocation || location;
      const itemId = initialItem?.id || uuidv4();
      
      const itemData: InventoryItem = {
        id: itemId,
        createdAt: initialItem?.createdAt || Date.now(),
        name: name.trim(),
        description: description.trim(),
        location: finalLocation,
        purchaseDate,
        expiryDate,
        memo: memo.trim(),
        image: image || '',
        updatedAt: Date.now(),
      };

      if (initialItem) {
        await updateItem(itemData);
      } else {
        await addItem(itemData);
      }
      onItemAdded();
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="add-item-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>{initialItem ? '품목 수정' : '새 품목 추가'}</h2>
        <button type="button" className="icon-button" onClick={onCancel}>
          <X size={24} />
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="image-input" className="image-upload-label">
          {image ? (
            <div className="image-preview-container">
              <img src={image} alt="Preview" className="image-preview" />
              <button type="button" className="remove-image" onClick={() => setImage(null)}>
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="image-placeholder">
              {isResizing ? (
                <span>처리 중...</span>
              ) : (
                <>
                  <Camera size={32} />
                  <span>사진 촬영 또는 업로드</span>
                </>
              )}
            </div>
          )}
        </label>
        <input
          id="image-input"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
      </div>

      <div className="form-group">
        <label htmlFor="name">이름 *</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="무엇인가요?"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">설명</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="간단한 설명"
          rows={2}
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">위치</label>
        <div className="location-inputs">
          <select
            id="location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              if (e.target.value !== 'Other') setCustomLocation('');
            }}
          >
            <option value="">위치 선택...</option>
            {COMMON_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
            <option value="Other">직접 입력...</option>
          </select>
          {(location === 'Other' || (!COMMON_LOCATIONS.includes(location) && location !== '')) && (
            <input
              type="text"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder="위치를 입력하세요"
              className="mt-2"
            />
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="purchaseDate">구매일</label>
          <input
            id="purchaseDate"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="expiryDate">만료일</label>
          <input
            id="expiryDate"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="memo">메모</label>
        <textarea
          id="memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="추가 참고 사항"
          rows={3}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          취소
        </button>
        <button type="submit" className="btn btn-primary">
          <Save size={18} />
          저장하기
        </button>
      </div>
    </form>
  );
};
