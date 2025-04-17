import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import Svg, { Rect } from "react-native-svg";
import * as Speech from "expo-speech";
import { Camera } from "expo-camera";
import { CameraType } from "expo-image-picker";

const { width, height } = Dimensions.get("window");

// API service interfaces
interface VerificationResult {
  success: boolean;
  confidence?: number;
  message?: string;
}

interface ApiServiceResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Custom hook for camera operations
const useCamera = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef<Camera | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
          skipProcessing: false,
        });
        return photo;
      } catch (error) {
        console.error("Error taking picture:", error);
        return null;
      }
    }
    return null;
  };

  return {
    hasPermission,
    cameraRef,
    isCameraReady,
    setIsCameraReady,
    takePicture,
  };
};

// API service for verification
const useVerificationService = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Face detection API service
  const detectFace = async (imageData: string): Promise<ApiServiceResponse> => {
    setIsProcessing(true);
    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // PLACEHOLDER: Replace with actual API call
      // const response = await fetch('https://your-face-detection-api.com', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ image: imageData }),
      // });
      // const data = await response.json();

      // Simulated successful response
      return {
        success: true,
        data: {
          hasFace: true,
          bbox: [50, 50, 200, 200],
          confidence: 0.95,
        },
      };
    } catch (error) {
      console.error("Face detection API error:", error);
      return {
        success: false,
        error: "Face detection service unavailable",
      };
    } finally {
      setIsProcessing(false);
    }
  };

  // Face matching API service
  const matchFace = async (
    imageData: string,
    userId: string
  ): Promise<ApiServiceResponse> => {
    setIsProcessing(true);
    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // PLACEHOLDER: Replace with actual API call
      // const response = await fetch('https://your-face-matching-api.com', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ image: imageData, userId }),
      // });
      // const data = await response.json();

      // Simulated successful response
      return {
        success: true,
        data: {
          matched: true,
          confidence: 0.92,
        },
      };
    } catch (error) {
      console.error("Face matching API error:", error);
      return {
        success: false,
        error: "Face matching service unavailable",
      };
    } finally {
      setIsProcessing(false);
    }
  };

  // Liveness detection API service
  const checkLiveness = async (
    imageData: string
  ): Promise<ApiServiceResponse> => {
    setIsProcessing(true);
    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // PLACEHOLDER: Replace with actual API call
      // const response = await fetch('https://your-liveness-detection-api.com', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ image: imageData }),
      // });
      // const data = await response.json();

      // Simulated successful response
      return {
        success: true,
        data: {
          isLive: true,
          score: 0.95,
        },
      };
    } catch (error) {
      console.error("Liveness detection API error:", error);
      return {
        success: false,
        error: "Liveness detection service unavailable",
      };
    } finally {
      setIsProcessing(false);
    }
  };

  // Deepfake detection API service
  const checkDeepfake = async (
    imageData: string
  ): Promise<ApiServiceResponse> => {
    setIsProcessing(true);
    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1800));

      // PLACEHOLDER: Replace with actual API call
      // const response = await fetch('https://your-deepfake-detection-api.com', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ image: imageData }),
      // });
      // const data = await response.json();

      // Simulated successful response
      return {
        success: true,
        data: {
          isDeepfake: false,
          confidence: 0.97,
        },
      };
    } catch (error) {
      console.error("Deepfake detection API error:", error);
      return {
        success: false,
        error: "Deepfake detection service unavailable",
      };
    } finally {
      setIsProcessing(false);
    }
  };

  // Speech verification API service
  const verifySpeech = async (
    audioData: string,
    expectedPhrase: string
  ): Promise<ApiServiceResponse> => {
    setIsProcessing(true);
    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // PLACEHOLDER: Replace with actual API call
      // const response = await fetch('https://your-speech-verification-api.com', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ audio: audioData, phrase: expectedPhrase }),
      // });
      // const data = await response.json();

      // Simulated successful response
      return {
        success: true,
        data: {
          matched: true,
          confidence: 0.88,
        },
      };
    } catch (error) {
      console.error("Speech verification API error:", error);
      return {
        success: false,
        error: "Speech verification service unavailable",
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    detectFace,
    matchFace,
    checkLiveness,
    checkDeepfake,
    verifySpeech,
  };
};

// Custom hook for speech operations
const useSpeech = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);

  useEffect(() => {
    // For simplicity, assume permission is granted
    // In a real app, you'd use expo-av's Audio.requestPermissionsAsync()
    setHasPermission(true);
  }, []);

  const startRecording = async () => {
    setIsRecording(true);
    // PLACEHOLDER: In a real app, you would start recording audio here
    // using something like expo-av's Audio.Recording

    // Simulate audio recording
    return true;
  };

  const stopRecording = async (): Promise<string | null> => {
    setIsRecording(false);

    // PLACEHOLDER: In a real app, you would stop recording and get the URI
    // e.g., const uri = await recording.stopAndUnloadAsync();

    // Simulate recording result
    const simulatedBase64Audio = "simulated_base64_audio_data";
    setAudioData(simulatedBase64Audio);
    return simulatedBase64Audio;
  };

  return {
    hasPermission,
    isRecording,
    audioData,
    startRecording,
    stopRecording,
  };
};

const FacialRecognitionScreen = () => {
  const router = useRouter();
  const [verificationStep, setVerificationStep] = useState("initial"); // initial, countdown, capture, processing, complete, failed
  const [countdown, setCountdown] = useState(3);
  const [capturedImage, setCapturedImage] = useState<any>(null);
  const [verificationResult, setVerificationResult] = useState<{
    faceDetected: boolean;
    faceMatched: boolean;
    livenessConfirmed: boolean;
    deepfakeDetected: boolean;
    speechVerified: boolean;
    overall: boolean;
    message: string;
  }>({
    faceDetected: false,
    faceMatched: false,
    livenessConfirmed: false,
    deepfakeDetected: false,
    speechVerified: false,
    overall: false,
    message: "",
  });
  const [verificationPhrase, setVerificationPhrase] = useState(
    "My voice is my passport, verify me"
  );

  // Use custom hooks
  const {
    hasPermission: cameraPermission,
    cameraRef,
    isCameraReady,
    setIsCameraReady,
    takePicture,
  } = useCamera();

  const {
    hasPermission: audioPermission,
    isRecording,
    audioData,
    startRecording,
    stopRecording,
  } = useSpeech();

  const {
    isProcessing,
    detectFace,
    matchFace,
    checkLiveness,
    checkDeepfake,
    verifySpeech,
  } = useVerificationService();

  // Test user ID (in a real app, would be retrieved from authentication context)
  const userId = "user123";

  // Countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (verificationStep === "countdown" && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (verificationStep === "countdown" && countdown === 0) {
      startCapture();
    }

    return () => clearTimeout(timer);
  }, [verificationStep, countdown]);

  // Handle countdown complete
  const startCapture = async () => {
    setVerificationStep("capture");

    // Start speech recording
    const recordingStarted = await startRecording();

    // Speak the verification phrase
    try {
      await Speech.speak(verificationPhrase, {
        language: "en",
        pitch: 1,
        rate: 0.8,
      });
    } catch (error) {
      console.error("Speech error:", error);
    }

    // Wait for 3 seconds, then capture image and audio
    setTimeout(async () => {
      const photo = await takePicture();
      const audio = await stopRecording();

      if (photo) {
        setCapturedImage(photo);
        setVerificationStep("processing");

        // Start verification process
        verifyUser(photo.base64, audio || "", userId);
      } else {
        Alert.alert("Error", "Failed to capture image. Please try again.");
        setVerificationStep("initial");
      }
    }, 3000);
  };

  // Verification process
  const verifyUser = async (
    imageData: string,
    audioData: string,
    userId: string
  ) => {
    try {
      // Step 1: Detect face in the image
      const faceDetection = await detectFace(imageData);
      const faceDetected = faceDetection.success && faceDetection.data?.hasFace;

      if (!faceDetected) {
        setVerificationResult({
          ...verificationResult,
          faceDetected: false,
          overall: false,
          message: "No face detected in the image.",
        });
        setVerificationStep("failed");
        return;
      }

      // Update partial result
      setVerificationResult((prev) => ({
        ...prev,
        faceDetected: true,
      }));

      // Step 2: Match face with user's registered face
      const faceMatch = await matchFace(imageData, userId);
      const faceMatched = faceMatch.success && faceMatch.data?.matched;

      // Step 3: Check liveness
      const liveness = await checkLiveness(imageData);
      const livenessConfirmed = liveness.success && liveness.data?.isLive;

      // Step 4: Check for deepfake
      const deepfake = await checkDeepfake(imageData);
      const deepfakeDetected = deepfake.success && deepfake.data?.isDeepfake;

      // Step 5: Verify speech
      const speech = await verifySpeech(audioData, verificationPhrase);
      const speechVerified = speech.success && speech.data?.matched;

      // Final result
      const overallResult =
        faceDetected &&
        faceMatched &&
        livenessConfirmed &&
        !deepfakeDetected &&
        speechVerified;

      setVerificationResult({
        faceDetected,
        faceMatched,
        livenessConfirmed,
        deepfakeDetected: !deepfakeDetected, // Inverse logic (true means no deepfake detected)
        speechVerified,
        overall: overallResult,
        message: overallResult
          ? "Verification successful"
          : "Verification failed. Please try again.",
      });

      setVerificationStep(overallResult ? "complete" : "failed");
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult({
        ...verificationResult,
        overall: false,
        message: "An error occurred during verification.",
      });
      setVerificationStep("failed");
    }
  };

  const handleStartVerification = () => {
    setVerificationStep("countdown");
    setCountdown(3);
  };

  const handleRetry = () => {
    setVerificationStep("initial");
    setCountdown(3);
    setCapturedImage(null);
    setVerificationResult({
      faceDetected: false,
      faceMatched: false,
      livenessConfirmed: false,
      deepfakeDetected: false,
      speechVerified: false,
      overall: false,
      message: "",
    });
  };

  const handleContactSupport = () => {
    // Navigate to support screen
    router.push("/support/live-agent");
  };

  // Render screen content based on verification step
  const renderContent = () => {
    switch (verificationStep) {
      case "initial":
        return (
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionTitle}>
              Facial & Voice Verification
            </Text>
            <Text style={styles.instructionText}>
              Position your face in the frame and prepare to speak the following
              phrase:
            </Text>
            <View style={styles.phraseContainer}>
              <Text style={styles.phrase}>"{verificationPhrase}"</Text>
            </View>
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartVerification}
            >
              <Text style={styles.startButtonText}>Start Verification</Text>
            </TouchableOpacity>
          </View>
        );

      case "countdown":
        return (
          <View style={styles.instructionContainer}>
            <Text style={styles.countdownText}>{countdown}</Text>
            <Text style={styles.instructionText}>
              Get ready to speak the phrase clearly
            </Text>
          </View>
        );

      case "capture":
        return (
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionTitle}>Recording</Text>
            <Text style={styles.instructionText}>
              Please read the phrase clearly
            </Text>
            <View style={styles.phraseContainer}>
              <Text style={styles.phrase}>"{verificationPhrase}"</Text>
            </View>
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingPulse} />
              <Text style={styles.recordingText}>
                Recording audio and video
              </Text>
            </View>
          </View>
        );

      case "processing":
        return (
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionTitle}>Processing</Text>
            <Text style={styles.instructionText}>
              Verifying your identity...
            </Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>Face Detection</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: verificationResult.faceDetected ? "100%" : "30%",
                      },
                    ]}
                  />
                </View>
                {verificationResult.faceDetected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="#4CAF50"
                    style={styles.progressCheck}
                  />
                )}
              </View>

              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>Face Matching</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: verificationResult.faceMatched ? "100%" : "60%",
                      },
                    ]}
                  />
                </View>
                {verificationResult.faceMatched && (
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="#4CAF50"
                    style={styles.progressCheck}
                  />
                )}
              </View>

              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>Liveness Check</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: verificationResult.livenessConfirmed
                          ? "100%"
                          : "40%",
                      },
                    ]}
                  />
                </View>
                {verificationResult.livenessConfirmed && (
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="#4CAF50"
                    style={styles.progressCheck}
                  />
                )}
              </View>

              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>Speech Verification</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: verificationResult.speechVerified
                          ? "100%"
                          : "20%",
                      },
                    ]}
                  />
                </View>
                {verificationResult.speechVerified && (
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="#4CAF50"
                    style={styles.progressCheck}
                  />
                )}
              </View>
            </View>
          </View>
        );

      case "complete":
        return (
          <View style={styles.instructionContainer}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            </View>
            <Text style={styles.instructionTitle}>Verification Complete</Text>
            <Text style={styles.instructionText}>
              Your identity has been successfully verified
            </Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => router.push("/certificate-generated")}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        );

      case "failed":
        return (
          <View style={styles.instructionContainer}>
            <View style={styles.failIcon}>
              <Ionicons name="alert-circle" size={80} color="#D63B3B" />
            </View>
            <Text style={styles.instructionTitle}>Verification Failed</Text>
            <Text style={styles.instructionText}>
              {verificationResult.message ||
                "We couldn't verify your identity. Please try again."}
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRetry}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.agentButton}
                onPress={handleContactSupport}
              >
                <Text style={styles.agentButtonText}>Contact Support</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  // Check permissions
  if (cameraPermission === null || audioPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Requesting permissions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Handle permission denied
  if (cameraPermission === false || audioPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorTitle}>Permission Denied</Text>
          <Text style={styles.errorText}>
            Camera and microphone permissions are required for identity
            verification. Please enable them in your device settings.
          </Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => router.back()}
          >
            <Text style={styles.continueButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={
            verificationStep === "capture" || verificationStep === "processing"
          }
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identity Verification</Text>
        <View style={styles.placeholderButton} />
      </View>

      <View style={styles.cameraFrame}>
        {/* Show camera preview unless we're viewing the captured image */}
        {!capturedImage ? (
          <Camera
            ref={cameraRef}
            style={styles.cameraFeed}
            type={CameraType.front}
            onCameraReady={() => setIsCameraReady(true)}
          />
        ) : (
          <Image
            source={{ uri: capturedImage.uri }}
            style={styles.cameraFeed}
          />
        )}

        {/* Frame overlay */}
        <View style={styles.frameBorder}>
          <Svg
            height="100%"
            width="100%"
            viewBox={`0 0 ${width * 0.8} ${width * 0.8}`}
          >
            <Rect
              x="0"
              y="0"
              width={width * 0.8}
              height={width * 0.8}
              stroke="white"
              strokeWidth="4"
              fill="transparent"
            />
          </Svg>
        </View>

        {/* Recording indicator */}
        {verificationStep === "capture" && <View style={styles.recordingDot} />}
      </View>

      {renderContent()}
    </SafeAreaView>
  );
};

export default FacialRecognitionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F245E",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
  },
  errorTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  placeholderButton: {
    width: 40,
  },
  cameraFrame: {
    width: width,
    height: width,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  cameraFeed: {
    width: "100%",
    height: "100%",
  },
  frameBorder: {
    position: "absolute",
    top: width * 0.1, // Center the square frame
    left: width * 0.1,
    width: width * 0.8,
    height: width * 0.8,
  },
  recordingDot: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#D63B3B",
  },
  instructionContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
    alignItems: "center",
  },
  instructionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F245E",
    marginBottom: 10,
    textAlign: "center",
  },
  instructionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  phraseContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 30,
    width: "100%",
  },
  phrase: {
    fontSize: 17,
    fontWeight: "500",
    color: "#1F245E",
    textAlign: "center",
  },
  startButton: {
    backgroundColor: "#1F245E",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  countdownText: {
    fontSize: 72,
    fontWeight: "700",
    color: "#1F245E",
    marginBottom: 16,
  },
  recordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  recordingPulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#D63B3B",
    marginRight: 8,
  },
  recordingText: {
    fontSize: 14,
    color: "#666",
  },
  progressContainer: {
    width: "100%",
    marginTop: 20,
  },
  progressItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: "#333",
    width: 120,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  progressCheck: {
    marginLeft: 8,
  },
  successIcon: {
    marginBottom: 20,
  },
  failIcon: {
    marginBottom: 20,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1F245E",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 30,
    marginTop: 30,
    width: "100%",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  retryButton: {
    flex: 1,
    backgroundColor: "#1F245E",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginRight: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  agentButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderColor: "#1F245E",
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginLeft: 8,
  },
  agentButtonText: {
    color: "#1F245E",
    fontSize: 16,
    fontWeight: "600",
  },
});
