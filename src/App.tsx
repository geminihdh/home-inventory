import { useEffect, useState, useMemo } from 'react';
import './App.css';
import type { InventoryItem } from './db/schema';
import { syncItems } from './db/inventory';
import { ItemList } from './components/ItemList';
import { AddItemForm } from './components/AddItemForm';
import { ItemDetail } from './components/ItemDetail';
import { Login } from './components/Login';
import { Plus, Search, X, LogOut } from 'lucide-react';
import { subscribeToAuthChanges, logout } from './services/auth';
import type { User } from 'firebase/auth';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((u) => {
      setUser(u);
      setLoading(false); // 인증 상태 확인 완료 시 무조건 로딩 해제
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = syncItems(user.uid, (syncedItems) => {
        setItems(syncedItems);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleItemAddedOrUpdated = () => {
    setShowForm(false);
    setIsEditing(false);
    setSelectedItem(null);
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditing(true);
    setShowForm(true);
  };

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.location.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  if (!user && !loading) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <header>
        <div className="header-top">
          <h1>우리집 인벤토리</h1>
          <div className="header-actions">
            <button onClick={logout} title="로그아웃" className="icon-btn">
              <LogOut size={20} />
            </button>
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
            userId={user?.uid || ''}
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
            {loading ? (
              <p className="loading-state">인벤토리를 불러오는 중...</p>
            ) : (
              <ItemList items={filteredItems} onItemClick={setSelectedItem} />
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
