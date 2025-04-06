import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PulseRecord {
  pulse: string;
  timestamp: string;
  wasHigh: boolean;
}

const HealthDataScreen: React.FC = () => {
  const [pulseHistory, setPulseHistory] = useState<PulseRecord[]>([]);
  const [lastWeekAverage, setLastWeekAverage] = useState<number | null>(null);

  useEffect(() => {
    loadPulseHistory();
  }, []);

  const loadPulseHistory = async () => {
    try {
      // In a real app, we would store a proper history of pulse readings
      // For this demo, we'll simulate some history
      const lastPulse = await AsyncStorage.getItem('lastPulse');
      const lastPulseTime = await AsyncStorage.getItem('lastPulseTime');
      
      if (lastPulse && lastPulseTime) {
        const wasHigh = parseInt(lastPulse, 10) > 120;
        
        // Simulated data
        const simulatedHistory: PulseRecord[] = [
          {
            pulse: lastPulse,
            timestamp: lastPulseTime,
            wasHigh,
          },
          {
            pulse: (parseInt(lastPulse, 10) - 5).toString(),
            timestamp: new Date(new Date(lastPulseTime).getTime() - 86400000).toISOString(), // 1 day ago
            wasHigh: parseInt(lastPulse, 10) - 5 > 120,
          },
          {
            pulse: (parseInt(lastPulse, 10) - 10).toString(),
            timestamp: new Date(new Date(lastPulseTime).getTime() - 86400000 * 2).toISOString(), // 2 days ago
            wasHigh: parseInt(lastPulse, 10) - 10 > 120,
          },
          {
            pulse: (parseInt(lastPulse, 10) + 5).toString(),
            timestamp: new Date(new Date(lastPulseTime).getTime() - 86400000 * 3).toISOString(), // 3 days ago
            wasHigh: parseInt(lastPulse, 10) + 5 > 120,
          },
          {
            pulse: (parseInt(lastPulse, 10) - 15).toString(),
            timestamp: new Date(new Date(lastPulseTime).getTime() - 86400000 * 4).toISOString(), // 4 days ago
            wasHigh: parseInt(lastPulse, 10) - 15 > 120,
          },
        ];
        
        setPulseHistory(simulatedHistory);
        
        // Calculate average
        const sum = simulatedHistory.reduce((acc, record) => acc + parseInt(record.pulse, 10), 0);
        setLastWeekAverage(sum / simulatedHistory.length);
      }
    } catch (error) {
      console.error('Error loading pulse history:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Analytics</Text>
        <Text style={styles.headerSubtitle}>Your pulse data over time</Text>
      </View>

      {lastWeekAverage && (
        <View style={styles.averageContainer}>
          <Text style={styles.averageTitle}>Average Pulse (Last Week)</Text>
          <Text style={styles.averageValue}>{lastWeekAverage.toFixed(1)} BPM</Text>
          <Text style={styles.averageLabel}>
            {lastWeekAverage > 100 
              ? 'Your average pulse is elevated, consider relaxation techniques'
              : 'Your average pulse is within normal range'}
          </Text>
        </View>
      )}

      <View style={styles.historyContainer}>
        <Text style={styles.sectionTitle}>Recent Pulse History</Text>
        
        {pulseHistory.length === 0 ? (
          <Text style={styles.emptyText}>No pulse history recorded yet</Text>
        ) : (
          <View style={styles.historyList}>
            {pulseHistory.map((record, index) => (
              <View 
                key={index} 
                style={[
                  styles.historyItem, 
                  record.wasHigh && styles.highPulseItem
                ]}
              >
                <Text style={styles.pulseValue}>{record.pulse} BPM</Text>
                <Text style={styles.pulseDate}>{formatDate(record.timestamp)}</Text>
                {record.wasHigh && (
                  <View style={styles.warningTag}>
                    <Text style={styles.warningText}>High</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Understanding Your Data</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Normal Resting Pulse</Text>
          <Text style={styles.infoContent}>
            A normal resting heart rate for adults ranges from 60 to 100 beats per minute. 
            Athletes might have lower rates, often between 40 to 60 beats per minute.
          </Text>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Elevated Pulse</Text>
          <Text style={styles.infoContent}>
            An elevated pulse (above 100 BPM) at rest can indicate stress, anxiety, 
            dehydration, or other health factors. Above 120 BPM could signal significant 
            emotional distress or a medical condition.
          </Text>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Monitoring for Safety</Text>
          <Text style={styles.infoContent}>
            Regular pulse monitoring can help identify patterns related to stress or 
            anxiety. This app helps correlate elevated pulse with potentially unsafe 
            situations, allowing for timely interventions.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#7e57c2',
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  averageContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    alignItems: 'center',
  },
  averageTitle: {
    fontSize: 16,
    color: '#666',
  },
  averageValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7e57c2',
    marginVertical: 10,
  },
  averageLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  historyContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
  historyList: {
    marginTop: 10,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  highPulseItem: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  pulseValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  pulseDate: {
    fontSize: 14,
    color: '#999',
    flex: 2,
  },
  warningTag: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  warningText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  infoCard: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  infoContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default HealthDataScreen; 