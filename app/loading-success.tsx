import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const UploadSuccessScreen = () => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 80,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconWrapper,
          { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.dashedCircle}>
          <Ionicons name="checkmark" size={64} color="#1F245E" />
        </View>
      </Animated.View>
      <Text style={styles.text}>Photo ID Uploaded Successfully!</Text>
    </View>
  );
};

export default UploadSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C1C6F7", // ⛔️ this is the light blue I added
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  iconWrapper: {
    marginBottom: 24,
  },
  dashedCircle: {
    borderWidth: 2,
    borderColor: "#1F245E",
    borderStyle: "dashed",
    borderRadius: 100,
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F245E",
    textAlign: "center",
  },
});
