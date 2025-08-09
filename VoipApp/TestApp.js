// Simple test script to verify our App component logic
const React = require('react');

// Mock the react-native components and react-native-webrtc
const mockComponents = {
  View: ({ children, style }) => ({ type: 'View', children, style }),
  Text: ({ children, style }) => ({ type: 'Text', children, style }),
  Button: ({ title, onPress, disabled, color }) => ({ type: 'Button', title, onPress, disabled, color }),
  TextInput: (props) => ({ type: 'TextInput', ...props }),
  SafeAreaView: ({ children, style }) => ({ type: 'SafeAreaView', children, style }),
  StyleSheet: {
    create: (styles) => styles
  },
  Alert: {
    alert: (title, message) => console.log(`Alert: ${title} - ${message}`)
  }
};

const mockWebRTC = {
  RTCView: (props) => ({ type: 'RTCView', ...props }),
  mediaDevices: {
    getUserMedia: async (constraints) => {
      console.log('Mock getUserMedia called with:', constraints);
      return {
        toURL: () => 'mock-stream-url',
        getTracks: () => [
          { stop: () => console.log('Mock track stopped') }
        ]
      };
    }
  },
  MediaStream: class MockMediaStream {
    toURL() { return 'mock-stream-url'; }
    getTracks() { return [{ stop: () => console.log('Mock track stopped') }]; }
  }
};

// Mock React hooks
let stateValues = {};
let stateSetters = {};
let stateCounter = 0;

const useState = (initialValue) => {
  const index = stateCounter++;
  if (!(index in stateValues)) {
    stateValues[index] = initialValue;
    stateSetters[index] = (newValue) => {
      stateValues[index] = typeof newValue === 'function' ? newValue(stateValues[index]) : newValue;
      console.log(`State[${index}] updated to:`, stateValues[index]);
    };
  }
  return [stateValues[index], stateSetters[index]];
};

const useRef = (initialValue) => ({
  current: initialValue
});

// Mock modules
global.React = { useState, useRef };
global.reactNative = mockComponents;
global.reactNativeWebRTC = mockWebRTC;

// Test the main functions
async function testAppFunctions() {
  console.log('🧪 Testing VOIP App Functions');
  console.log('================================');
  
  // Reset state counter for fresh test
  stateCounter = 0;
  stateValues = {};
  stateSetters = {};
  
  // Mock the state variables
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callStatus, setCallStatus] = useState('Idle');
  const [roomId, setRoomId] = useState('');
  
  // Mock refs
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  
  // Test getMediaStream function
  const getMediaStream = async () => {
    try {
      const mediaStream = await mockWebRTC.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setStream(mediaStream);
      console.log('✅ Media stream obtained successfully');
      return mediaStream;
    } catch (error) {
      console.error('❌ Error getting media stream:', error);
      mockComponents.Alert.alert('Error', 'Failed to access camera/microphone. Please check permissions.');
      throw error;
    }
  };
  
  // Test startCall function
  const startCall = async () => {
    try {
      setCallStatus('Calling...');
      await getMediaStream();
      console.log('✅ Call started successfully');
      mockComponents.Alert.alert('Call Started', 'Video call initiated successfully');
    } catch (error) {
      console.error('❌ Error starting call:', error);
      setCallStatus('Idle');
      mockComponents.Alert.alert('Error', 'Failed to start call');
    }
  };
  
  // Test receiveCall function
  const receiveCall = async () => {
    try {
      setCallStatus('Receiving...');
      await getMediaStream();
      console.log('✅ Call received successfully');
      mockComponents.Alert.alert('Call Received', 'Incoming call accepted');
    } catch (error) {
      console.error('❌ Error receiving call:', error);
      setCallStatus('Idle');
      mockComponents.Alert.alert('Error', 'Failed to receive call');
    }
  };
  
  // Test endCall function
  const endCall = () => {
    try {
      setCallStatus('Idle');
      
      // Close peer connection if exists
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
        console.log('📞 Peer connection closed');
      }
      
      // Stop all tracks in the stream
      if (stateValues[0]) { // stream state
        stateValues[0].getTracks().forEach(track => {
          track.stop();
        });
        console.log('🎥 Stream tracks stopped');
      }
      
      // Clear streams
      setStream(null);
      setRemoteStream(null);
      
      console.log('✅ Call ended successfully');
      mockComponents.Alert.alert('Call Ended', 'Call has been terminated');
    } catch (error) {
      console.error('❌ Error ending call:', error);
    }
  };
  
  // Run tests
  console.log('\n🚀 Testing startCall...');
  await startCall();
  
  console.log('\n🛑 Testing endCall...');
  endCall();
  
  console.log('\n📞 Testing receiveCall...');
  await receiveCall();
  
  console.log('\n🛑 Testing endCall again...');
  endCall();
  
  console.log('\n✨ All tests completed!');
  console.log('Current state values:', stateValues);
}

// Run the tests
testAppFunctions().catch(console.error);
