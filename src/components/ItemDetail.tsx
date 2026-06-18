import React from 'react';
import { X, Edit2, Trash2, Calendar, MapPin, FileText } from 'lucide-react';
import type { InventoryItem } from '../db/schema';
import { deleteItemFromFirebase } from '../db/inventory';

interface ItemDetailProps {
  item: InventoryItem;
  onClose: () => void;
  onEdit: (item: InventoryItem) => void;
  onDeleted: () => void;
}

export const ItemDetail: React.FC<ItemDetailProps> = ({ item, onClose, onEdit, onDeleted }) => {
  const handleDelete = async () => {
    if (window.confirm('정말 이 항목을 삭제하시겠습니까?')) {
      try {
        await deleteItemFromFirebase(item.id);
        onDeleted();
      } catch (error) {
        console.error('Failed to delete item:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="item-detail-overlay">
      <div className="item-detail-modal">
        <div className="detail-header">
          <h2>품목 상세 정보</h2>
          <button className="icon-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="detail-content">
          <div className="detail-image-container">
            {item.image ? (
              <img src={item.image} alt={item.name} className="detail-image" />
            ) : (
              <div className="detail-image-placeholder">이미지 없음</div>
            )}
          </div>

          <div className="detail-info">
            <h1 className="detail-name">{item.name}</h1>
            
            {item.description && (
              <p className="detail-description">{item.description}</p>
            )}

            <div className="info-grid">
              <div className="info-item">
                <MapPin size={20} className="info-icon" />
                <div className="info-text">
                  <span className="info-label">위치</span>
                  <span className="info-value">{item.location}</span>
                </div>
              </div>

              {item.purchaseDate && (
                <div className="info-item">
                  <Calendar size={20} className="info-icon" />
                  <div className="info-text">
                    <span className="info-label">구매일</span>
                    <span className="info-value">{item.purchaseDate}</span>
                  </div>
                </div>
              )}

              {item.expiryDate && (
                <div className="info-item">
                  <Calendar size={20} className="info-icon" />
                  <div className="info-text">
                    <span className="info-label">만료일</span>
                    <span className="info-value">{item.expiryDate}</span>
                  </div>
                </div>
              )}
            </div>

            {item.memo && (
              <div className="detail-memo">
                <div className="memo-header">
                  <FileText size={20} />
                  <span>메모</span>
                </div>
                <p>{item.memo}</p>
              </div>
            )}
          </div>
        </div>

        <div className="detail-actions">
          <button className="btn btn-danger" onClick={handleDelete}>
            <Trash2 size={18} />
            삭제
          </button>
          <button className="btn btn-primary" onClick={() => onEdit(item)}>
            <Edit2 size={18} />
            수정
          </button>
        </div>
      </div>
    </div>
  );
};
