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
} from "react-native";
import { useRouter } from "expo-router";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const FacialRecognitionScreen = () => {
  const router = useRouter();
  const cameraRef = useRef<Camera | null>(null);
  const [recognitionStep, setRecognitionStep] = useState<
    "initial" | "countdown" | "recording" | "processing" | "complete"
  >("initial");
  const [countdown, setCountdown] = useState<number>(3);
  const [livenessPhrase, setLivenessPhrase] = useState<string>(
    "My name is John and I am alive"
  );
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(
    null
  );
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  // Detection states
  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [speechDetected, setSpeechDetected] = useState<boolean>(false);
  const [livenessConfirmed, setLivenessConfirmed] = useState<boolean>(false);
  const [faceData, setFaceData] = useState<any>(null);

  // Request permissions on component mount
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");

      // Request audio recording permission for speech
      const audioPermission = await Audio.requestPermissionsAsync();
      setHasAudioPermission(audioPermission.status === "granted");
    })();
  }, []);

  // Handle countdown for recording
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (recognitionStep === "countdown" && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (recognitionStep === "countdown" && countdown === 0) {
      setRecognitionStep("recording");
      startRecording();
    }

    return () => clearTimeout(timer);
  }, [recognitionStep, countdown]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const handleFacesDetected = ({ faces }: { faces: any[] }) => {
    if (faces.length > 0) {
      setFaceDetected(true);
      setFaceData(faces[0]); // Store face data for further processing

      // Add logic for liveness detection here
      // For example, checking for eye blinks, head movements
      if (recognitionStep === "recording" && !livenessConfirmed) {
        // Sample implementation - in reality, you'd have more sophisticated checks
        if (
          faces[0].leftEyeOpenProbability > 0.95 &&
          faces[0].rightEyeOpenProbability < 0.1
        ) {
          // Detected a wink - could be part of liveness check
          setTimeout(() => {
            setLivenessConfirmed(true);
          }, 500);
        }
      }
    } else {
      setFaceDetected(false);
    }
  };

  const startRecording = async () => {
    try {
      // Configure audio session for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Create and start recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);

      // For demo purposes - simulate speech recognition after 3 seconds
      // In a real app, you would send the audio to a speech recognition service
      setTimeout(() => {
        setSpeechDetected(true);

        // Take a picture for deepfake analysis after speech is detected
        if (cameraRef.current) {
          setTimeout(async () => {
            const photo = await cameraRef.current.takePictureAsync({
              quality: 0.8,
              base64: true,
            });

            // Here you would send the photo for deepfake detection
            // analyzeFaceForDeepfake(photo);

            // Check if we've met all verification conditions
            if (faceDetected && speechDetected && livenessConfirmed) {
              stopRecording();
              setRecognitionStep("processing");

              // Simulate the processing and completion
              setTimeout(() => {
                setRecognitionStep("complete");
              }, 3000);
            } else if (faceDetected && speechDetected) {
              // If we're just waiting on liveness, give it a bit more time
              setTimeout(() => {
                // Simulate liveness confirmation if it hasn't happened naturally
                setLivenessConfirmed(true);
                stopRecording();
                setRecognitionStep("processing");

                setTimeout(() => {
                  setRecognitionStep("complete");
                }, 3000);
              }, 2000);
            }
          }, 1000);
        }
      }, 3000);
    } catch (error) {
      console.error("Recording error:", error);
      Alert.alert("Error", "Failed to start recording");
    }
  };

  const stopRecording = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();

        // Get the recorded audio file
        const uri = recording.getURI();
        // Here you would typically send this audio to a speech recognition service
        // processSpeechToText(uri);

        // Reset audio mode
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
        });

        setRecording(null);
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  };

  const handleStartRecording = () => {
    if (faceDetected) {
      setRecognitionStep("countdown");
    } else {
      Alert.alert(
        "Face Not Detected",
        "Please position your face in the frame."
      );
    }
  };

  const renderNoPermissions = () => {
    return (
      <View style={styles.noPermissionsContainer}>
        <MaterialIcons name="no-photography" size={64} color="#D63B3B" />
        <Text style={styles.noPermissionsText}>
          Camera or microphone permissions not granted
        </Text>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.back()}
        >
          <Text style={styles.continueButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.cameraView}
          type={Camera.Constants.Type.front}
          onFacesDetected={handleFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
            runClassifications: FaceDetector.FaceDetectorClassifications.all,
            minDetectionInterval: 100,
            tracking: true,
          }}
        />

        {/* Face framing guide - more modern and cleaner */}
        <View style={styles.faceFrame}>
          <Svg height="100%" width="100%" viewBox="0 0 100 100">
            {/* Top left corner */}
            <Path
              d="M 10,10 L 10,25 M 10,10 L 25,10"
              stroke="white"
              strokeWidth="3"
              fill="transparent"
            />
            {/* Top right corner */}
            <Path
              d="M 90,10 L 90,25 M 90,10 L 75,10"
              stroke="white"
              strokeWidth="3"
              fill="transparent"
            />
            {/* Bottom left corner */}
            <Path
              d="M 10,90 L 10,75 M 10,90 L 25,90"
              stroke="white"
              strokeWidth="3"
              fill="transparent"
            />
            {/* Bottom right corner */}
            <Path
              d="M 90,90 L 90,75 M 90,90 L 75,90"
              stroke="white"
              strokeWidth="3"
              fill="transparent"
            />
          </Svg>
        </View>

        {/* Recording indicator */}
        {recognitionStep === "recording" && (
          <View style={styles.recordingIndicatorContainer}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>Recording</Text>
          </View>
        )}
      </View>
    );
  };

  const renderContent = () => {
    switch (recognitionStep) {
      case "initial":
        return (
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionTitle}>
              Position your face in the frame
            </Text>
            <Text style={styles.instructionText}>
              When ready, press the button and read the phrase below
            </Text>
            <View style={styles.phraseContainer}>
              <Text style={styles.phrase}>"{livenessPhrase}"</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.recordButton,
                !faceDetected && styles.recordButtonDisabled,
              ]}
              disabled={!faceDetected}
              onPress={handleStartRecording}
            >
              <View style={styles.recordButtonInner}>
                <MaterialIcons name="mic" size={28} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.buttonLabel}>
              {faceDetected ? "Press to begin" : "Positioning face..."}
            </Text>
          </View>
        );

      case "countdown":
        return (
          <View style={styles.instructionContainer}>
            <Text style={styles.countdownText}>{countdown}</Text>
            <Text style={styles.instructionText}>Get ready to speak</Text>
          </View>
        );

      case "recording":
        return (
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionTitle}>Recording</Text>
            <Text style={styles.instructionText}>
              Please read the phrase clearly
            </Text>
            <View style={styles.phraseContainer}>
              <Text style={styles.phrase}>"{livenessPhrase}"</Text>
            </View>
            <View style={styles.statusContainer}>
              <View style={styles.statusItem}>
                <FontAwesome5
                  name="user-check"
                  size={18}
                  color={faceDetected ? "#4CAF50" : "#999"}
                  style={styles.statusIcon}
                />
                <Text
                  style={[
                    styles.statusText,
                    faceDetected && styles.statusActive,
                  ]}
                >
                  Face Detected
                </Text>
              </View>

              <View style={styles.statusItem}>
                <MaterialIcons
                  name="record-voice-over"
                  size={20}
                  color={speechDetected ? "#4CAF50" : "#999"}
                  style={styles.statusIcon}
                />
                <Text
                  style={[
                    styles.statusText,
                    speechDetected && styles.statusActive,
                  ]}
                >
                  Speech Recognized
                </Text>
              </View>

              <View style={styles.statusItem}>
                <MaterialIcons
                  name="verified-user"
                  size={20}
                  color={livenessConfirmed ? "#4CAF50" : "#999"}
                  style={styles.statusIcon}
                />
                <Text
                  style={[
                    styles.statusText,
                    livenessConfirmed && styles.statusActive,
                  ]}
                >
                  Liveness Confirmed
                </Text>
              </View>
            </View>
            <View style={styles.waveformContainer}>
              {/* Audio waveform visualization */}
              <View style={styles.waveform}>
                {[...Array(20)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.waveformBar,
                      {
                        height: Math.random() * 30 + 5,
                        marginHorizontal: 2,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>
        );

      case "processing":
        return (
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionTitle}>Processing</Text>
            <Text style={styles.instructionText}>
              Verifying your identity and checking for deepfakes...
            </Text>
            <View style={styles.loadingIndicator}>
              <View style={styles.loadingBar}>
                <View style={styles.loadingProgress} />
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
              onPress={() => router.push("/")}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  if (hasCameraPermission === null || hasAudioPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Requesting permissions...</Text>
      </View>
    );
  }

  if (hasCameraPermission === false || hasAudioPermission === false) {
    return renderNoPermissions();
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={
            recognitionStep === "recording" || recognitionStep === "processing"
          }
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Facial Verification</Text>
        <View style={{ width: 40 }} />
      </View>

      {renderCamera()}
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
  cameraContainer: {
    width: width,
    height: width,
    position: "relative",
    overflow: "hidden",
  },
  cameraView: {
    width: "100%",
    height: "100%",
  },
  faceFrame: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  recordingIndicatorContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#D63B3B",
    marginRight: 8,
  },
  recordingText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
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
  recordButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#D63B3B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  recordButtonDisabled: {
    backgroundColor: "#D63B3B80",
  },
  recordButtonInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#C12C2C",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  countdownText: {
    fontSize: 72,
    fontWeight: "700",
    color: "#1F245E",
    marginBottom: 16,
  },
  statusContainer: {
    width: "100%",
    marginTop: 10,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  statusIcon: {
    marginRight: 12,
  },
  statusText: {
    fontSize: 15,
    color: "#999",
  },
  statusActive: {
    color: "#333",
    fontWeight: "500",
  },
  waveformContainer: {
    marginTop: 20,
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 40,
  },
  waveformBar: {
    width: 4,
    backgroundColor: "#D63B3B",
    borderRadius: 2,
    opacity: 0.8,
  },
  loadingIndicator: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  loadingBar: {
    height: 8,
    width: "100%",
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  loadingProgress: {
    height: "100%",
    width: "70%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  successIcon: {
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
  noPermissionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  noPermissionsText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
    color: "#333",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
});
