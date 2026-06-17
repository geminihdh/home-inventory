import React from 'react';
import { render } from '@testing-library/react-native';
import InventoryListScreen from '../InventoryListScreen';

test('InventoryListScreen should render', () => {
  const { getByText } = render(<InventoryListScreen />);
  expect(getByText('Inventory')).toBeDefined();
});
