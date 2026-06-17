import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { saveInventory, loadInventory, InventoryItem } from '../services/storage';

export default function AddItemScreen({ navigation }: any) {
  const [name, setName] = useState('');

  const handleSave = async () => {
    if (!name.trim()) return;
    const items = await loadInventory();
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name,
      image: '',
      description: '',
      location: '',
      purchaseDate: '',
      expiryDate: '',
      memo: '',
      createdAt: Date.now(),
    };
    await saveInventory([...items, newItem]);
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
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20 },
});
