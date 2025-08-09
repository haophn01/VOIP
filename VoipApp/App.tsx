/**
 * VOIP Mobile App
 * Built with React Native and WebRTC
 *
 * @format
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  useColorScheme,
  SafeAreaView,
  Alert,
} from 'react-native';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const handleCall = () => {
    if (phoneNumber.trim()) {
      Alert.alert('Calling...', `Dialing ${phoneNumber}`);
      setIsConnected(true);
      // TODO: Implement WebRTC call logic
    } else {
      Alert.alert('Error', 'Please enter a phone number');
    }
  };

  const handleEndCall = () => {
    setIsConnected(false);
    setCallDuration(0);
    Alert.alert('Call Ended', 'Call has been terminated');
    // TODO: Implement call termination logic
  };

  const dialpadButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'], 
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  const renderDialpadButton = (digit: string) => (
    <TouchableOpacity
      key={digit}
      style={styles.dialpadButton}
      onPress={() => setPhoneNumber(prev => prev + digit)}
    >
      <Text style={styles.dialpadText}>{digit}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
          VOIP Dialer
        </Text>
        {isConnected && (
          <Text style={styles.statusText}>
            Connected • {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
          </Text>
        )}
      </View>

      {/* Phone Number Display */}
      <View style={styles.displayContainer}>
        <TextInput
          style={[styles.phoneDisplay, { color: isDarkMode ? '#fff' : '#000' }]}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter phone number"
          placeholderTextColor={isDarkMode ? '#666' : '#999'}
          keyboardType="phone-pad"
        />
      </View>

      {/* Dialpad */}
      <View style={styles.dialpad}>
        {dialpadButtons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.dialpadRow}>
            {row.map(renderDialpadButton)}
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => setPhoneNumber('')}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>

        {!isConnected ? (
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <Text style={styles.callButtonText}>📞 Call</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
            <Text style={styles.endCallButtonText}>📞 End Call</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#00ff00',
    fontWeight: '600',
  },
  displayContainer: {
    marginBottom: 30,
  },
  phoneDisplay: {
    fontSize: 24,
    textAlign: 'center',
    padding: 15,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 10,
    minHeight: 60,
  },
  dialpad: {
    alignItems: 'center',
    marginBottom: 30,
  },
  dialpadRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  dialpadButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dialpadText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 25,
    minWidth: 100,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  callButton: {
    backgroundColor: '#4ecdc4',
    padding: 20,
    borderRadius: 35,
    minWidth: 150,
  },
  callButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  endCallButton: {
    backgroundColor: '#ff4757',
    padding: 20,
    borderRadius: 35,
    minWidth: 150,
  },
  endCallButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
