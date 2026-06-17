import { useEffect, useState, useCallback } from 'react';
import './App.css';
import type { InventoryItem } from './db/schema';
import { getAllItems } from './db/inventory';
import { ItemList } from './components/ItemList';
import { AddItemForm } from './components/AddItemForm';
import { Plus } from 'lucide-react';

function App() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

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

  return (
    <div className="app-container">
      <header>
        <h1>Home Inventory</h1>
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
              <p>Loading your inventory...</p>
            ) : (
              <ItemList items={items} />
            )}
            <button 
              className="fab" 
              onClick={() => setShowForm(true)}
              aria-label="Add Item"
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
