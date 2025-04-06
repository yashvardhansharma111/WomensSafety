import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-root-toast';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      if (
        granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        return true;
      } else {
        Toast.show(
          'Location permission is required for safety features. Please enable it in settings.',
          {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER,
            backgroundColor: '#ff6b6b',
            shadow: true,
          }
        );
        return false;
      }
    }
    // For iOS (though we're Android-only, keeping for future compatibility)
    return true;
  } catch (error) {
    console.error('Error requesting location permission:', error);
    Toast.show('Unable to access location services. Some features may be limited.', {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      backgroundColor: '#ff6b6b',
      shadow: true,
    });
    return false;
  }
};

export const getCurrentLocation = async (): Promise<LocationData | null> => {
  try {
    const permissionGranted = await requestLocationPermission();
    
    if (!permissionGranted) {
      return null;
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        error => {
          console.error('Error getting location:', error);
          Toast.show('Unable to get your location. Please check your GPS settings.', {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER,
            backgroundColor: '#ff6b6b',
            shadow: true,
          });
          reject(error);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 10000,
        }
      );
    });
  } catch (error) {
    console.error('Location error:', error);
    return null;
  }
};

export const sendEmergencyLocation = async (
  emergencyContact: string | null,
  isHighPulse: boolean = false
): Promise<boolean> => {
  try {
    const location = await getCurrentLocation();
    
    if (!location) {
      return false;
    }

    // In a real app, you would send this location to emergency contacts
    // via SMS, emergency services API, etc.
    console.log('Emergency location:', location);
    console.log('Would send to contact:', emergencyContact);
    
    Toast.show(
      isHighPulse
        ? '🚨 High pulse detected – Location shared with emergency contacts'
        : emergencyContact 
          ? `Location shared with ${emergencyContact}`
          : 'Location tracked for safety monitoring',
      {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#7e57c2',
        shadow: true,
      }
    );
    
    return true;
  } catch (error) {
    console.error('Error sending emergency location:', error);
    return false;
  }
}; 