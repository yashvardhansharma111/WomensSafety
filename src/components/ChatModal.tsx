import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { generateGeminiResponse, GEMINI_PROMPTS } from '../services/geminiService';

interface Message {
  text: string;
  isUser: boolean;
}

const ChatModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your safety assistant. How can I help you today? You can ask me about pulse rates, emotional states, WMI, or safety tips.",
      isUser: false,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);

    // Add user message
    const userMessage: Message = { text: inputText, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    
    const userInput = inputText;
    setInputText('');

    try {
      // Check for preset questions first
      let prompt = userInput;
      
      // Check for keyword matches to use preset prompts
      const lowerCaseInput = userInput.toLowerCase();
      
      if (lowerCaseInput.includes('wmi') || lowerCaseInput.includes('wearable monitoring')) {
        prompt = GEMINI_PROMPTS.WHAT_IS_WMI;
      } else if (lowerCaseInput.includes('skin conductance') || lowerCaseInput.includes('galvanic')) {
        prompt = GEMINI_PROMPTS.SKIN_CONDUCTANCE;
      } else if (lowerCaseInput.includes('fatigue') || lowerCaseInput.includes('tired')) {
        prompt = GEMINI_PROMPTS.CHRONIC_FATIGUE;
      } else if (lowerCaseInput.includes('safety tip') || lowerCaseInput.includes('stay safe')) {
        prompt = GEMINI_PROMPTS.SAFETY_TIPS;
      } else if (lowerCaseInput.includes('pulse') && (lowerCaseInput.includes('emotion') || lowerCaseInput.includes('feel'))) {
        prompt = GEMINI_PROMPTS.PULSE_EMOTIONS;
      }
      
      // Get response from Gemini
      const response = await generateGeminiResponse(prompt);

      // Add assistant message
      const assistantMessage: Message = { text: response, isUser: false };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting Gemini response:', error);
      const errorMessage: Message = {
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSuggestedQuestions = () => {
    const suggestions = [
      "What is WMI?",
      "How does pulse relate to emotions?",
      "What is skin conductance?",
      "Give me safety tips",
      "What is chronic fatigue?"
    ];
    
    return (
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>Suggested Questions:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {suggestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionButton}
              onPress={() => {
                setInputText(question);
                // Optional: automatically send the question
                // setTimeout(() => handleSend(), 100);
              }}
            >
              <Text style={styles.suggestionText}>{question}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.floatingButtonText}>💬</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Safety Assistant</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
            >
              {messages.map((message, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageBubble,
                    message.isUser
                      ? styles.userMessageBubble
                      : styles.assistantMessageBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.isUser
                        ? styles.userMessageText
                        : styles.assistantMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
              ))}
              
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#7e57c2" />
                  <Text style={styles.loadingText}>Thinking...</Text>
                </View>
              )}
            </ScrollView>

            {messages.length === 1 && renderSuggestedQuestions()}

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Ask about safety, emotions, or get help..."
                  placeholderTextColor="#666"
                  multiline
                  editable={!isLoading}
                />
                <TouchableOpacity 
                  style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]} 
                  onPress={handleSend}
                  disabled={!inputText.trim() || isLoading}
                >
                  <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7e57c2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  floatingButtonText: {
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
  },
  userMessageBubble: {
    backgroundColor: '#7e57c2',
    alignSelf: 'flex-end',
  },
  assistantMessageBubble: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#fff',
  },
  assistantMessageText: {
    color: '#333',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 15,
  },
  loadingText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#7e57c2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#d0c0e8',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  suggestionsContainer: {
    padding: 15,
    borderTopWidth: 1, 
    borderTopColor: '#eee',
  },
  suggestionsTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  suggestionButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#7e57c2',
  },
});

export default ChatModal; 