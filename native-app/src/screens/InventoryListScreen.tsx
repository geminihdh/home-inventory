import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { InventoryItem, loadInventory } from '../services/storage';

interface InventoryListScreenProps {
  navigation: {
    addListener: (event: string, callback: () => void) => () => void;
    navigate: (screen: string) => void;
  };
}

export default function InventoryListScreen({ navigation }: InventoryListScreenProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadInventory().then(setItems);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
          </View>
        )}
      />
      <Button title="Add Item" onPress={() => navigation.navigate('AddItem')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});
