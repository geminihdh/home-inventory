import { useEffect, useState, useCallback, useMemo } from 'react';
import './App.css';
import type { InventoryItem } from './db/schema';
import { getAllItems } from './db/inventory';
import { ItemList } from './components/ItemList';
import { AddItemForm } from './components/AddItemForm';
import { Plus, Search, X } from 'lucide-react';

function App() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const allItems = await getAllItems();
      setItems(allItems);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleItemAdded = () => {
    setShowForm(false);
    loadItems();
  };

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.location.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  return (
    <div className="app-container">
      <header>
        <div className="header-top">
          <h1>우리집 인벤토리</h1>
        </div>
        {!showForm && (
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="품목 또는 위치 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="clear-search" 
                onClick={() => setSearchQuery('')}
                aria-label="검색어 지우기"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
      </header>
      <main>
        {showForm ? (
          <AddItemForm 
            onItemAdded={handleItemAdded} 
            onCancel={() => setShowForm(false)} 
          />
        ) : (
          <>
            {loading ? (
              <p className="loading-state">인벤토리를 불러오는 중...</p>
            ) : (
              <ItemList items={filteredItems} />
            )}
            <button 
              className="fab" 
              onClick={() => setShowForm(true)}
              aria-label="항목 추가"
            >
              <Plus size={32} />
            </button>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
