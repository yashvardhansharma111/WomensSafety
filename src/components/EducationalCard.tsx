import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface EducationalCardProps {
  title: string;
  shortDescription: string;
  longDescription: string;
  icon?: string;
}

const EducationalCard: React.FC<EducationalCardProps> = ({
  title,
  shortDescription,
  longDescription,
  icon = '📝',
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, expanded && styles.expandedContainer]} 
      onPress={toggleExpand}
      activeOpacity={0.9}
    >
      <View style={styles.headerRow}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.expandIcon}>{expanded ? '▲' : '▼'}</Text>
      </View>
      
      <Text style={styles.description}>
        {expanded ? longDescription : shortDescription}
      </Text>
      
      {expanded && (
        <TouchableOpacity 
          style={styles.collapseButton}
          onPress={toggleExpand}
        >
          <Text style={styles.collapseText}>Show Less</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#7e57c2',
  },
  expandedContainer: {
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  icon: {
    fontSize: 22,
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  expandIcon: {
    fontSize: 12,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  collapseButton: {
    alignSelf: 'center',
    marginTop: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0edf7',
    borderRadius: 15,
  },
  collapseText: {
    color: '#7e57c2',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default EducationalCard; 