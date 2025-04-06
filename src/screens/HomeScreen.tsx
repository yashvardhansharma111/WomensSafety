import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PulseInput from '../components/PulseInput';
import ChatModal from '../components/ChatModal';

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  HealthData: undefined;
  Educational: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HealthInfoCard: React.FC<{ title: string; content: string; onPress?: () => void }> = ({
  title,
  content,
  onPress,
}) => (
  <TouchableOpacity 
    style={styles.card} 
    onPress={onPress} 
    disabled={!onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardContent}>{content}</Text>
    {onPress && (
      <Text style={styles.learnMore}>Learn more →</Text>
    )}
  </TouchableOpacity>
);

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [userName, setUserName] = useState<string | null>(null);
  const [lastPulse, setLastPulse] = useState<string | null>(null);
  const [lastPulseTime, setLastPulseTime] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        const pulse = await AsyncStorage.getItem('lastPulse');
        const time = await AsyncStorage.getItem('lastPulseTime');
        
        setUserName(name);
        setLastPulse(pulse);
        setLastPulseTime(time);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();

    // Set up a focus listener to reload data when the screen comes into focus
    const unsubscribe = navigation.addListener('focus', loadUserData);
    return unsubscribe;
  }, [navigation]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  const isPulseHigh = lastPulse ? parseInt(lastPulse, 10) > 120 : false;

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor="#6a45b5" barStyle="light-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {userName ? `Hello, ${userName}` : 'Welcome'}
          </Text>
          <Text style={styles.subtitle}>Your safety is our priority</Text>
        </View>

        <PulseInput />

        {lastPulse && (
          <View style={[
            styles.lastReadingContainer, 
            isPulseHigh && styles.highPulseContainer
          ]}>
            <Text style={styles.lastReadingTitle}>Last Pulse Reading</Text>
            <View style={styles.pulseValueContainer}>
              <Text style={[
                styles.lastReadingValue,
                isPulseHigh && styles.highPulseValue
              ]}>
                {lastPulse} BPM
              </Text>
              {isPulseHigh && (
                <View style={styles.warningBadge}>
                  <Text style={styles.warningText}>High</Text>
                </View>
              )}
            </View>
            <Text style={styles.lastReadingTime}>
              Recorded: {formatDate(lastPulseTime)}
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Health & Safety Information</Text>

        <HealthInfoCard
          title="Pulse & Emotional States"
          content="Your pulse can be an indicator of your emotional state. Elevated heart rate might suggest stress or fear."
          onPress={() => navigation.navigate('Educational')}
        />

        <HealthInfoCard
          title="What is WMI?"
          content="Wearable Monitoring Intelligence (WMI) uses biometric data to detect emotional distress and potential safety threats."
          onPress={() => navigation.navigate('Educational')}
        />

        <HealthInfoCard
          title="Chronic Fatigue & Safety"
          content="Chronic fatigue can impact your awareness and reaction time, potentially affecting your safety in various situations."
          onPress={() => navigation.navigate('Educational')}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('HealthData')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>View Health Data</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.educationalButton}
          onPress={() => navigation.navigate('Educational')}
          activeOpacity={0.8}
        >
          <Text style={styles.educationalButtonText}>Learn About Safety & Emotions</Text>
        </TouchableOpacity>

        <ChatModal />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Women's Safety App</Text>
          <Text style={styles.footerSubtext}>Version 1.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#7e57c2',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  lastReadingContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  highPulseContainer: {
    backgroundColor: 'rgba(255, 235, 235, 1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  lastReadingTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  pulseValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  lastReadingValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#7e57c2',
  },
  highPulseValue: {
    color: '#ff6b6b',
  },
  warningBadge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  warningText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lastReadingTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    margin: 15,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  learnMore: {
    color: '#7e57c2',
    marginTop: 10,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: 15,
  },
  button: {
    backgroundColor: '#7e57c2',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#6a45b5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  educationalButton: {
    backgroundColor: '#f0edf7',
    borderWidth: 1,
    borderColor: '#7e57c2',
    paddingVertical: 15,
    borderRadius: 12,
    margin: 15,
    alignItems: 'center',
  },
  educationalButtonText: {
    color: '#7e57c2',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#7e57c2',
    fontWeight: '600',
  },
  footerSubtext: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
});

export default HomeScreen; 