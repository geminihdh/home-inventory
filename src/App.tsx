import { useEffect, useState } from 'react';
import './App.css';
import type { InventoryItem } from './db/schema';
import { getAllItems } from './db/inventory';
import { ItemList } from './components/ItemList';

function App() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItems() {
      try {
        const allItems = await getAllItems();
        setItems(allItems);
      } catch (error) {
        console.error('Failed to load items:', error);
      } finally {
        setLoading(false);
      }
    }
    loadItems();
  }, []);

  return (
    <div className="app-container">
      <header>
        <h1>Home Inventory</h1>
      </header>
      <main>
        {loading ? (
          <p>Loading your inventory...</p>
        ) : (
          <ItemList items={items} />
        )}
      </main>
    </div>
  );
}

export default App;
