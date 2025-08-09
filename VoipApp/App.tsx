// /**
//  * VOIP Mobile App
//  * Built with React Native and WebRTC
//  *
//  * @format
//  */

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
//   StatusBar,
//   useColorScheme,
//   SafeAreaView,
//   Alert,
// } from 'react-native';

// function App() {
//   const isDarkMode = useColorScheme() === 'dark';
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [isConnected, setIsConnected] = useState(false);
//   const [callDuration, setCallDuration] = useState(0);

//   const handleCall = () => {
//     if (phoneNumber.trim()) {
//       Alert.alert('Calling...', `Dialing ${phoneNumber}`);
//       setIsConnected(true);
//       // TODO: Implement WebRTC call logic
//     } else {
//       Alert.alert('Error', 'Please enter a phone number');
//     }
//   };

//   const handleEndCall = () => {
//     setIsConnected(false);
//     setCallDuration(0);
//     Alert.alert('Call Ended', 'Call has been terminated');
//     // TODO: Implement call termination logic
//   };

//   const dialpadButtons = [
//     ['1', '2', '3'],
//     ['4', '5', '6'], 
//     ['7', '8', '9'],
//     ['*', '0', '#']
//   ];

//   const renderDialpadButton = (digit: string) => (
//     <TouchableOpacity
//       key={digit}
//       style={styles.dialpadButton}
//       onPress={() => setPhoneNumber(prev => prev + digit)}
//     >
//       <Text style={styles.dialpadText}>{digit}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
//           VOIP Dialer
//         </Text>
//         {isConnected && (
//           <Text style={styles.statusText}>
//             Connected • {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
//           </Text>
//         )}
//       </View>

//       {/* Phone Number Display */}
//       <View style={styles.displayContainer}>
//         <TextInput
//           style={[styles.phoneDisplay, { color: isDarkMode ? '#fff' : '#000' }]}
//           value={phoneNumber}
//           onChangeText={setPhoneNumber}
//           placeholder="Enter phone number"
//           placeholderTextColor={isDarkMode ? '#666' : '#999'}
//           keyboardType="phone-pad"
//         />
//       </View>

//       {/* Dialpad */}
//       <View style={styles.dialpad}>
//         {dialpadButtons.map((row, rowIndex) => (
//           <View key={rowIndex} style={styles.dialpadRow}>
//             {row.map(renderDialpadButton)}
//           </View>
//         ))}
//       </View>

//       {/* Action Buttons */}
//       <View style={styles.actionButtons}>
//         <TouchableOpacity
//           style={styles.clearButton}
//           onPress={() => setPhoneNumber('')}
//         >
//           <Text style={styles.clearButtonText}>Clear</Text>
//         </TouchableOpacity>

//         {!isConnected ? (
//           <TouchableOpacity style={styles.callButton} onPress={handleCall}>
//             <Text style={styles.callButtonText}>📞 Call</Text>
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
//             <Text style={styles.endCallButtonText}>📞 End Call</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   statusText: {
//     fontSize: 16,
//     color: '#00ff00',
//     fontWeight: '600',
//   },
//   displayContainer: {
//     marginBottom: 30,
//   },
//   phoneDisplay: {
//     fontSize: 24,
//     textAlign: 'center',
//     padding: 15,
//     borderWidth: 2,
//     borderColor: '#007AFF',
//     borderRadius: 10,
//     minHeight: 60,
//   },
//   dialpad: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   dialpadRow: {
//     flexDirection: 'row',
//     marginBottom: 15,
//   },
//   dialpadButton: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 10,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   dialpadText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//   },
//   clearButton: {
//     backgroundColor: '#ff6b6b',
//     padding: 15,
//     borderRadius: 25,
//     minWidth: 100,
//   },
//   clearButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   callButton: {
//     backgroundColor: '#4ecdc4',
//     padding: 20,
//     borderRadius: 35,
//     minWidth: 150,
//   },
//   callButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   endCallButton: {
//     backgroundColor: '#ff4757',
//     padding: 20,
//     borderRadius: 35,
//     minWidth: 150,
//   },
//   endCallButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });

// export default App;
import React, { useState, useRef } from 'react';
import { StyleSheet, View, Button, Text, TextInput, Alert, SafeAreaView } from 'react-native';
import { RTCView, mediaDevices, MediaStream } from 'react-native-webrtc';

const App = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callStatus, setCallStatus] = useState('Idle');
  const [roomId, setRoomId] = useState('');
  const localStreamRef = useRef<any>(null);
  const peerConnectionRef = useRef<any>(null);

  // Khởi tạo Media Stream
  const getMediaStream = async () => {
    try {
      const mediaStream = await mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setStream(mediaStream);
      console.log('Media stream obtained successfully');
    } catch (error) {
      console.error('Error getting media stream:', error);
      Alert.alert('Error', 'Failed to access camera/microphone. Please check permissions.');
    }
  };

  // Thực hiện cuộc gọi
  const startCall = async () => {
    try {
      setCallStatus('Calling...');
      await getMediaStream();
      // TODO: Add peer connection logic here
      Alert.alert('Call Started', 'Video call initiated successfully');
    } catch (error) {
      console.error('Error starting call:', error);
      setCallStatus('Idle');
      Alert.alert('Error', 'Failed to start call');
    }
  };

  // Nhận cuộc gọi
  const receiveCall = async () => {
    try {
      setCallStatus('Receiving...');
      await getMediaStream();
      // TODO: Add logic to receive call from peer
      Alert.alert('Call Received', 'Incoming call accepted');
    } catch (error) {
      console.error('Error receiving call:', error);
      setCallStatus('Idle');
      Alert.alert('Error', 'Failed to receive call');
    }
  };

  // Kết thúc cuộc gọi
  const endCall = () => {
    try {
      setCallStatus('Idle');
      
      // Close peer connection if exists
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      
      // Stop all tracks in the stream
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
      
      // Clear streams
      setStream(null);
      setRemoteStream(null);
      
      Alert.alert('Call Ended', 'Call has been terminated');
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>React Native VoIP</Text>
      
      {/* Status Display */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Status: {callStatus}</Text>
      </View>
      
      {/* Video Views */}
      <View style={styles.videoContainer}>
        <View style={styles.videoWrapper}>
          <Text style={styles.videoLabel}>Local Video</Text>
          {stream ? (
            <RTCView 
              streamURL={stream.toURL()} 
              style={styles.localVideo}
              objectFit="cover"
              mirror={true}
            />
          ) : (
            <View style={[styles.localVideo, styles.noVideoPlaceholder]}>
              <Text style={styles.placeholderText}>No Local Video</Text>
            </View>
          )}
        </View>
        
        <View style={styles.videoWrapper}>
          <Text style={styles.videoLabel}>Remote Video</Text>
          {remoteStream ? (
            <RTCView 
              streamURL={remoteStream.toURL()} 
              style={styles.remoteVideo}
              objectFit="cover"
            />
          ) : (
            <View style={[styles.remoteVideo, styles.noVideoPlaceholder]}>
              <Text style={styles.placeholderText}>No Remote Video</Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Room ID Input */}
      <TextInput
        style={styles.input}
        value={roomId}
        onChangeText={setRoomId}
        placeholder="Enter Room ID"
        placeholderTextColor="#999"
      />
      
      {/* Control Buttons */}
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button 
            title="Start Call" 
            onPress={startCall} 
            disabled={callStatus !== 'Idle'}
            color="#4CAF50"
          />
        </View>
        <View style={styles.button}>
          <Button 
            title="Receive Call" 
            onPress={receiveCall} 
            disabled={callStatus !== 'Idle'}
            color="#2196F3"
          />
        </View>
        <View style={styles.button}>
          <Button 
            title="End Call" 
            onPress={endCall} 
            disabled={callStatus === 'Idle'}
            color="#F44336"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f1f1f1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  videoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  videoWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  videoLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  noVideoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    width: '80%',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  localVideo: {
    width: '100%',
    height: 150,
    backgroundColor: '#000',
    marginBottom: 10,
    borderRadius: 8,
  },
  remoteVideo: {
    width: '100%',
    height: 150,
    backgroundColor: '#000',
    borderRadius: 8,
  },
});

export default App;
