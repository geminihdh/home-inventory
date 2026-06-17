import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import InventoryListScreen from './src/screens/InventoryListScreen';
import AddItemScreen from './src/screens/AddItemScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="InventoryList">
        <Stack.Screen name="InventoryList" component={InventoryListScreen} />
        <Stack.Screen name="AddItem" component={AddItemScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
