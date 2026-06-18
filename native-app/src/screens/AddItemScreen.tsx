import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { saveInventory, loadInventory, InventoryItem } from '../services/storage';
import { scheduleExpiryNotification } from '../services/notifications';

interface AddItemScreenProps {
  navigation: {
    goBack: () => void;
  };
}

export default function AddItemScreen({ navigation }: AddItemScreenProps) {
  const [name, setName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const handleSave = async () => {
    if (!name.trim()) return;
    const items = await loadInventory();
    
    // Simple date parsing for demonstration
    const expiry = new Date(expiryDate);
    
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name,
      image: '',
      description: '',
      location: '',
      purchaseDate: '',
      expiryDate: expiryDate,
      memo: '',
      createdAt: Date.now(),
    };
    
    await saveInventory([...items, newItem]);
    
    // Schedule notification if valid date
    if (!isNaN(expiry.getTime())) {
      await scheduleExpiryNotification(name, expiry);
    }
    
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Item</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Item Name"
      />
      <TextInput
        style={styles.input}
        value={expiryDate}
        onChangeText={setExpiryDate}
        placeholder="Expiry Date (YYYY-MM-DD)"
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20 },
});
