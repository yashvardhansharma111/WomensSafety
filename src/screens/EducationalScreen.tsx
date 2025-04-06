import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import EducationalCard from '../components/EducationalCard';

const EducationalScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Safety Education</Text>
        <Text style={styles.headerSubtitle}>Learn about emotional safety & monitoring</Text>
      </View>

      <EducationalCard
        title="Pulse & Emotional States"
        icon="❤️"
        shortDescription="Your pulse can indicate your emotional state and potential safety concerns."
        longDescription={`When you experience fear or anxiety, your body activates the 'fight or flight' response, releasing adrenaline and increasing your heart rate.
        
An elevated pulse (above 100 BPM) can indicate stress, anxiety, or fear. A rapid heart rate (120+ BPM) without physical exertion could signal significant distress.

By monitoring your pulse regularly, you can:
• Become more aware of your emotional state
• Identify patterns related to stress or anxiety
• Take proactive safety measures when needed
• Use data to validate your feelings and experiences

This app helps correlate elevated pulse with potentially unsafe situations, allowing for timely interventions.`}
      />

      <EducationalCard
        title="What is WMI?"
        icon="📱"
        shortDescription="Wearable Monitoring Intelligence (WMI) uses biometric data to enhance safety."
        longDescription={`Wearable Monitoring Intelligence (WMI) is an emerging field that combines wearable technology, biometric sensors, and artificial intelligence to monitor physical and emotional states.

WMI systems collect data from sensors that measure:
• Heart rate and heart rate variability
• Skin conductance (galvanic skin response)
• Body temperature
• Movement patterns
• Respiratory rate

By analyzing these metrics, WMI can detect:
• Elevated stress levels
• Sudden changes in emotional state
• Patterns that might indicate distress
• Potential safety concerns

This app simulates WMI by having you manually input your pulse data, which then triggers appropriate responses and guidance based on that information.`}
      />

      <EducationalCard
        title="Skin Conductance & Fear Detection"
        icon="💦"
        shortDescription="Skin conductance measures can detect fear and anxiety states."
        longDescription={`Skin conductance, also known as galvanic skin response (GSR), measures the electrical conductance of your skin, which varies with moisture level.

When you experience fear, anxiety, or stress:
• Your sympathetic nervous system activates
• Sweat gland activity increases
• Skin becomes more conductive
• This creates measurable changes in electrical resistance

These changes occur even with subtle emotional reactions that you might not consciously notice. By monitoring skin conductance:
• Early warning signs of anxiety can be detected
• Patterns of stress response can be identified
• Triggers for fear responses can be documented
• Objective data can validate subjective experiences

In safety applications, skin conductance monitoring can provide early warning of distress, allowing for timely intervention before a situation escalates.`}
      />

      <EducationalCard
        title="Chronic Fatigue & Safety"
        icon="😴"
        shortDescription="Chronic fatigue can impact awareness and safety in various situations."
        longDescription={`Chronic Fatigue Syndrome (CFS) is a complex disorder characterized by extreme fatigue that doesn't improve with rest and can't be explained by an underlying medical condition.

Chronic fatigue can impact safety in several ways:
• Decreased alertness and reaction time
• Impaired decision-making ability
• Reduced awareness of surroundings
• Difficulty assessing potential threats
• Increased vulnerability in emergency situations

Monitoring biometric data can help manage chronic fatigue by:
• Establishing baseline energy patterns
• Identifying energy depletion before it becomes severe
• Alerting when rest is needed
• Tracking effectiveness of interventions

For those with CFS, having objective data can help validate experiences and provide evidence when seeking accommodations or support.`}
      />

      <EducationalCard
        title="Emotion Detection for Safety"
        icon="🛡️"
        shortDescription="Understanding how emotion detection technology enhances safety."
        longDescription={`Emotion detection technology combines biometric monitoring with AI analysis to identify potential safety concerns before they escalate.

Key benefits for safety include:
• Early warning of distress when you might not recognize it yourself
• Objective validation of subjective feelings of unease
• Creation of safety plans based on patterns in your data
• Accountability for situations that trigger distress
• Documentation that can support reporting if needed

While technology cannot replace human judgment, it can provide:
• An additional layer of awareness
• Objective data to support decision-making
• Validation for intuitive feelings of danger
• Early warning signs that might otherwise be missed

By becoming more aware of how your body responds to different situations, you can make more informed choices about your safety and well-being.`}
      />
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
    paddingTop: 20,
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
});

export default EducationalScreen; 