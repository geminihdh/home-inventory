import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Camera, X, Save } from 'lucide-react';
import type { InventoryItem } from '../db/schema';
import { addItem } from '../db/inventory';
import { resizeImage } from '../utils/image';

interface AddItemFormProps {
  onItemAdded: () => void;
  onCancel: () => void;
}

const COMMON_LOCATIONS = [
  'Kitchen',
  'Pantry',
  'Living Room',
  'Bedroom',
  'Bathroom',
  'Garage',
  'Basement',
  'Attic',
  'Office'
];

export const AddItemForm: React.FC<AddItemFormProps> = ({ onItemAdded, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [memo, setMemo] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
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
        alert('Failed to process image.');
      } finally {
        setIsResizing(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Name is required');
      return;
    }

    const finalLocation = customLocation || location;

    const newItem: InventoryItem = {
      id: uuidv4(),
      name: name.trim(),
      description: description.trim(),
      location: finalLocation,
      purchaseDate,
      expiryDate,
      memo: memo.trim(),
      image: image || '',
      createdAt: Date.now(),
    };

    try {
      await addItem(newItem);
      onItemAdded();
    } catch (error) {
      console.error('Failed to add item:', error);
      alert('Failed to save item.');
    }
  };

  return (
    <form className="add-item-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Add New Item</h2>
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
                <span>Processing...</span>
              ) : (
                <>
                  <Camera size={32} />
                  <span>Tap to take a photo or upload</span>
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
        <label htmlFor="name">Name *</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What is this item?"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description"
          rows={2}
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">Location</label>
        <div className="location-inputs">
          <select
            id="location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              if (e.target.value !== 'Other') setCustomLocation('');
            }}
          >
            <option value="">Select location...</option>
            {COMMON_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
            <option value="Other">Other...</option>
          </select>
          {(location === 'Other' || !COMMON_LOCATIONS.includes(location) && location !== '') && (
            <input
              type="text"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder="Enter custom location"
              className="mt-2"
            />
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="purchaseDate">Purchase Date</label>
          <input
            id="purchaseDate"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="expiryDate">Expiry Date</label>
          <input
            id="expiryDate"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="memo">Memo</label>
        <textarea
          id="memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="Additional notes"
          rows={3}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          <Save size={18} />
          Save Item
        </button>
      </div>
    </form>
  );
};
