import { useEffect, useState, useMemo } from 'react';
import './App.css';
import type { InventoryItem } from './db/schema';
import { getAllItems } from './db/inventory';
import { ItemList } from './components/ItemList';
import { AddItemForm } from './components/AddItemForm';
import { ItemDetail } from './components/ItemDetail';
import { Plus, Search, X, Download, Upload } from 'lucide-react';
import { exportData, importData } from './utils/backup';

function App() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadItems = async () => {
    const fetchedItems = await getAllItems();
    setItems(fetchedItems);
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadItems();
    };
    fetchData();
  }, []);

  const handleItemAddedOrUpdated = async () => {
    await loadItems();
    setShowForm(false);
    setIsEditing(false);
    setSelectedItem(null);
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleExport = async () => {
    const data = await exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-backup-${new Date().toISOString()}.json`;
    a.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        await importData(text);
        await loadItems();
        alert('데이터를 성공적으로 불러왔습니다.');
      };
      reader.readAsText(file);
    }
  };

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.location.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  if (loading) {
    return <div className="loading-state">데이터 로딩 중...</div>;
  }

  return (
    <div className="app-container">
      <header>
        <div className="header-top">
          <h1>우리집 인벤토리</h1>
          <div className="header-actions">
            <button onClick={handleExport} title="백업 다운로드" className="icon-btn">
              <Download size={20} />
            </button>
            <label className="icon-btn" title="데이터 복원">
              <Upload size={20} />
              <input type="file" onChange={handleImport} accept=".json" style={{ display: 'none' }} />
            </label>
          </div>
        </div>
        {!showForm && !selectedItem && (
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
            onItemAdded={handleItemAddedOrUpdated} 
            onCancel={() => {
              setShowForm(false);
              setIsEditing(false);
            }} 
            initialItem={isEditing ? selectedItem || undefined : undefined}
          />
        ) : selectedItem ? (
          <ItemDetail 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)}
            onEdit={handleEdit}
            onDeleted={handleItemAddedOrUpdated}
          />
        ) : (
          <>
            <ItemList items={filteredItems} onItemClick={setSelectedItem} />
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
