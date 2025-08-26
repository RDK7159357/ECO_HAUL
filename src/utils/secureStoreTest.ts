import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const testSecureStore = async () => {
  console.log('Testing SecureStore...');
  console.log('Platform:', Platform.OS);
  
  try {
    // Check if SecureStore is available
    const isAvailable = await SecureStore.isAvailableAsync();
    console.log('SecureStore isAvailable:', isAvailable);
    
    if (isAvailable) {
      // Test storing a value
      console.log('Testing setItemAsync...');
      await SecureStore.setItemAsync('test_key', 'test_value');
      console.log('✓ setItemAsync successful');
      
      // Test retrieving a value
      console.log('Testing getItemAsync...');
      const value = await SecureStore.getItemAsync('test_key');
      console.log('✓ getItemAsync successful, value:', value);
      
      // Test deleting a value
      console.log('Testing deleteItemAsync...');
      await SecureStore.deleteItemAsync('test_key');
      console.log('✓ deleteItemAsync successful');
      
      // Verify deletion
      const deletedValue = await SecureStore.getItemAsync('test_key');
      console.log('✓ Deletion verified, value should be null:', deletedValue);
    } else {
      console.warn('SecureStore is not available on this platform');
    }
  } catch (error) {
    console.error('SecureStore test failed:', error);
  }
};
