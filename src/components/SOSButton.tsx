import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Animated,
  Easing,
} from 'react-native';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendEmergencyLocation } from '../utils/locationUtils';

const SOSButton: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const startPulseAnimation = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
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
      ]).start(() => {
        if (isPressed) {
          startPulseAnimation();
        }
      });
    };

    if (isPressed) {
      startPulseAnimation();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPressed, pulseAnim]);

  const handleSOSPress = async () => {
    setIsPressed(true);
    
    Toast.show('SOS Emergency Mode Activated', {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      backgroundColor: '#ff6b6b',
      shadow: true,
    });

    // Get emergency contact from storage
    let emergencyContact = null;
    try {
      emergencyContact = await AsyncStorage.getItem('emergencyContact');
      if (emergencyContact) {
        Toast.show(`Contacting emergency: ${emergencyContact}`, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          backgroundColor: '#7e57c2',
        });
      }
    } catch (error) {
      console.error('Error retrieving emergency contact:', error);
    }

    // Get and send current location
    await sendEmergencyLocation(emergencyContact);

    // Reset after 5 seconds
    setTimeout(() => {
      setIsPressed(false);
      Toast.show('SOS Mode Deactivated', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#7e57c2',
      });
    }, 5000);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pulseCircle,
          {
            transform: [{ scale: pulseAnim }],
            opacity: isPressed ? 0.5 : 0,
          },
        ]}
      />
      <TouchableOpacity
        style={[styles.button, isPressed && styles.buttonPressed]}
        onPress={handleSOSPress}
        activeOpacity={0.7}
      >
        <Text style={styles.text}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff6b6b',
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonPressed: {
    backgroundColor: '#d84242',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default SOSButton; 