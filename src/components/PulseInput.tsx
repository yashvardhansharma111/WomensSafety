import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import { generateGeminiResponse, GEMINI_PROMPTS } from '../services/geminiService';
import { sendEmergencyLocation } from '../utils/locationUtils';

// Get high pulse threshold from config or use default
const HIGH_PULSE_THRESHOLD = Config.HIGH_PULSE_THRESHOLD 
  ? parseInt(Config.HIGH_PULSE_THRESHOLD, 10) 
  : 120;

const PulseInput: React.FC = () => {
  const [pulse, setPulse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start pulse animation when loading
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isLoading, pulseAnim]);

  const handlePulseSubmit = async () => {
    const pulseNum = parseInt(pulse, 10);
    if (isNaN(pulseNum) || pulseNum < 40 || pulseNum > 220) {
      Toast.show('Please enter a valid pulse rate (40-220)', {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#7e57c2',
        shadow: true,
      });
      return;
    }

    setIsLoading(true);

    // Store pulse in AsyncStorage
    try {
      await AsyncStorage.setItem('lastPulse', pulse);
      await AsyncStorage.setItem('lastPulseTime', new Date().toISOString());
    } catch (error) {
      console.error('Error saving pulse:', error);
    }

    // Check if pulse is high
    if (pulseNum > HIGH_PULSE_THRESHOLD) {
      Toast.show('🚨 High pulse detected – SOS triggered!', {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        backgroundColor: '#ff6b6b',
        shadow: true,
      });

      // Get emergency contact
      let emergencyContact: string | null = null;
      try {
        emergencyContact = await AsyncStorage.getItem('emergencyContact');
      } catch (error) {
        console.error('Error retrieving emergency contact:', error);
      }
      
      // Send location data in emergency
      await sendEmergencyLocation(emergencyContact, true);

      // Get Gemini response for high pulse
      try {
        const prompt = GEMINI_PROMPTS.HIGH_PULSE(pulseNum);
        const response = await generateGeminiResponse(prompt);
        
        // Show response in a toast
        Toast.show(response.substring(0, 200) + '...', {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          backgroundColor: '#7e57c2',
          shadow: true,
        });
      } catch (error) {
        console.error('Error getting Gemini response:', error);
        Toast.show('Unable to get assistance information. Please contact emergency services if needed.', {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          backgroundColor: '#ff6b6b',
          shadow: true,
        });
      }
    } else {
      // Normal pulse message
      Toast.show('Pulse recorded successfully', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#7e57c2',
        shadow: true,
      });
    }

    // Clear input and loading state
    setPulse('');
    setIsLoading(false);
  };

  return (
    <Animated.View style={[
      styles.container,
      { transform: [{ scale: pulseAnim }] }
    ]}>
      <Text style={styles.label}>Enter Your Current Pulse Rate</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={pulse}
          onChangeText={setPulse}
          keyboardType="numeric"
          placeholder="Enter pulse (40-220)"
          placeholderTextColor="#666"
          editable={!isLoading}
          maxLength={3}
        />
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handlePulseSubmit}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.helperText}>
        Normal range: 60-100 BPM at rest
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 3,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#7e57c2',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginRight: 10,
    color: '#333',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#7e57c2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#6a45b5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonDisabled: {
    backgroundColor: '#a991d4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default PulseInput; 