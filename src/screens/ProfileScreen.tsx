import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';

const ProfileScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [healthConditions, setHealthConditions] = useState('');

  // Load saved profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const savedName = await AsyncStorage.getItem('userName');
        const savedAge = await AsyncStorage.getItem('userAge');
        const savedEmergencyContact = await AsyncStorage.getItem('emergencyContact');
        const savedEmergencyName = await AsyncStorage.getItem('emergencyName');
        const savedHealthConditions = await AsyncStorage.getItem('healthConditions');

        if (savedName) setName(savedName);
        if (savedAge) setAge(savedAge);
        if (savedEmergencyContact) setEmergencyContact(savedEmergencyContact);
        if (savedEmergencyName) setEmergencyName(savedEmergencyName);
        if (savedHealthConditions) setHealthConditions(savedHealthConditions);
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    loadProfileData();
  }, []);

  // Save profile data
  const handleSaveProfile = async () => {
    try {
      await AsyncStorage.setItem('userName', name);
      await AsyncStorage.setItem('userAge', age);
      await AsyncStorage.setItem('emergencyContact', emergencyContact);
      await AsyncStorage.setItem('emergencyName', emergencyName);
      await AsyncStorage.setItem('healthConditions', healthConditions);

      Toast.show('Profile saved successfully', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#7e57c2',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      Toast.show('Failed to save profile', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#ff6b6b',
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {name ? name.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
        <Text style={styles.profileTitle}>Your Profile</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="Enter your age"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Health Conditions (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={healthConditions}
            onChangeText={setHealthConditions}
            placeholder="List any health conditions"
            placeholderTextColor="#666"
            multiline
            numberOfLines={3}
          />
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Emergency Contact</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Name</Text>
          <TextInput
            style={styles.input}
            value={emergencyName}
            onChangeText={setEmergencyName}
            placeholder="Emergency contact name"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            placeholder="Emergency contact number"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#7e57c2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  formSection: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#7e57c2',
    paddingVertical: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen; 