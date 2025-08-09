/**
 * WebRTC Service for VOIP functionality
 * Handles peer-to-peer connections, media streams, and signaling
 */

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
} from 'react-native-webrtc';

export interface CallState {
  isConnected: boolean;
  isConnecting: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  error: string | null;
}

class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private onStateChange: ((state: CallState) => void) | null = null;

  // Configuration for STUN/TURN servers
  private readonly configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      // Add your TURN server here for production
      // { urls: 'turn:your-turn-server.com:3478', username: 'user', credential: 'pass' }
    ],
    iceCandidatePoolSize: 10,
  };

  constructor() {
    this.setupPeerConnection();
  }

  // Set up the peer connection
  private setupPeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.configuration);

    // Handle remote stream
    (this.peerConnection as any).onaddstream = (event: any) => {
      console.log('Remote stream added:', event.stream);
      this.remoteStream = event.stream;
      this.updateState();
    };

    // Handle ICE candidates
    (this.peerConnection as any).onicecandidate = (event: any) => {
      if (event.candidate) {
        console.log('ICE candidate:', event.candidate);
        // Send ICE candidate to remote peer via signaling server
        this.sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate,
        });
      }
    };

    // Handle connection state changes
    (this.peerConnection as any).onconnectionstatechange = () => {
      console.log('Connection state:', this.peerConnection?.connectionState);
      this.updateState();
    };
  }

  // Get user media (audio/video)
  async getUserMedia(constraints = { audio: true, video: false }) {
    try {
      const stream = await mediaDevices.getUserMedia(constraints);
      this.localStream = stream;
      
      // Add stream to peer connection
      if (this.peerConnection) {
        (this.peerConnection as any).addStream(stream);
      }
      
      this.updateState();
      return stream;
    } catch (error) {
      console.error('Error getting user media:', error);
      this.updateState({ error: 'Failed to access microphone' });
      throw error;
    }
  }

  // Create an offer (caller)
  async createOffer() {
    try {
      if (!this.peerConnection) {
        throw new Error('Peer connection not initialized');
      }

      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
      });

      await this.peerConnection.setLocalDescription(offer);
      
      // Send offer to remote peer via signaling server
      this.sendSignalingMessage({
        type: 'offer',
        sdp: offer,
      });

      console.log('Offer created and sent');
      this.updateState();
    } catch (error) {
      console.error('Error creating offer:', error);
      this.updateState({ error: 'Failed to create call offer' });
    }
  }

  // Create an answer (callee)
  async createAnswer(offer: RTCSessionDescription) {
    try {
      if (!this.peerConnection) {
        throw new Error('Peer connection not initialized');
      }

      await this.peerConnection.setRemoteDescription(offer);
      
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      
      // Send answer to remote peer via signaling server
      this.sendSignalingMessage({
        type: 'answer',
        sdp: answer,
      });

      console.log('Answer created and sent');
      this.updateState();
    } catch (error) {
      console.error('Error creating answer:', error);
      this.updateState({ error: 'Failed to answer call' });
    }
  }

  // Handle received answer
  async handleAnswer(answer: RTCSessionDescription) {
    try {
      if (!this.peerConnection) {
        throw new Error('Peer connection not initialized');
      }

      await this.peerConnection.setRemoteDescription(answer);
      console.log('Answer received and set');
      this.updateState();
    } catch (error) {
      console.error('Error handling answer:', error);
      this.updateState({ error: 'Failed to process call answer' });
    }
  }

  // Handle received ICE candidate
  async handleIceCandidate(candidate: RTCIceCandidate) {
    try {
      if (!this.peerConnection) {
        throw new Error('Peer connection not initialized');
      }

      await this.peerConnection.addIceCandidate(candidate);
      console.log('ICE candidate added');
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }

  // End the call
  endCall() {
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
      this.localStream = null;
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.remoteStream = null;
    this.setupPeerConnection(); // Reinitialize for next call
    this.updateState();
  }

  // Send signaling message (implement with your signaling server)
  private sendSignalingMessage(message: any) {
    // TODO: Implement signaling server communication
    // This could be WebSocket, Socket.io, Firebase, etc.
    console.log('Signaling message to send:', message);
    
    // Example with WebSocket:
    // if (this.signalingSocket) {
    //   this.signalingSocket.send(JSON.stringify(message));
    // }
  }

  // Set state change callback
  setOnStateChange(callback: (state: CallState) => void) {
    this.onStateChange = callback;
  }

  // Update and notify state changes
  private updateState(partialState?: Partial<CallState>) {
    if (this.onStateChange) {
      const state: CallState = {
        isConnected: this.peerConnection?.connectionState === 'connected',
        isConnecting: this.peerConnection?.connectionState === 'connecting',
        localStream: this.localStream,
        remoteStream: this.remoteStream,
        error: null,
        ...partialState,
      };
      this.onStateChange(state);
    }
  }

  // Get current call state
  getCallState(): CallState {
    return {
      isConnected: this.peerConnection?.connectionState === 'connected',
      isConnecting: this.peerConnection?.connectionState === 'connecting',
      localStream: this.localStream,
      remoteStream: this.remoteStream,
      error: null,
    };
  }
}

export default WebRTCService;
