import AsyncStorage from '@react-native-async-storage/async-storage';

const StorageData = {
  async get(key) {
    try {
      const rawData = await AsyncStorage.getItem(key);
      if (rawData) {
        const savedData = JSON.parse(rawData);
        return savedData;
      }else {
        console.log(e.message+'No saved ' + key);
      }

    } catch (e) {
      console.log(e.message+'Failed to load ' + key);
    }
  },
  async set(key, data) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.log(e.message+'Failed to save ' + key);
    }
  },
  async removeData(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.log(e.message+'Failed to removeData' + key);
    }
  },
  async containsKey(key) {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.includes(key);
    } catch (e) {
      console.error(e.message+'Failed to containsKey' + key);
    }
  },
};

export default StorageData;
