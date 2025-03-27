import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  ImageBackground,
  Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={require('../../assets/images/Dashboard.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header Icons */}
        <View style={styles.headerIcons}>
          <Pressable onPress={() => {}}>
            <Text style={styles.hamburger}>☰</Text>
          </Pressable>

          <Image
            source={require('../../assets/images/profilepic.png')}
            style={styles.profilePic}
          />
        </View>

        {/* Welcome & Bell */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.greetingText}>
            Welcome {'\n'}
            <Text style={styles.nameText}>John Brown!</Text>
          </Text>
          <TouchableOpacity style={styles.bellIcon}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Main Content */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentBox}>
            <Text style={styles.sectionTitle}>Where to go:</Text>

            <View style={styles.buttonList}>
              <TouchableOpacity style={styles.navButton}>
                <Text style={styles.navButtonText}>Proof of Life Process</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navButton}>
                <Text style={styles.navButtonText}>View Pension History</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navButton}>
                <Text style={styles.navButtonText}>Tutorial</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* LiveChat Floating Button */}
        <TouchableOpacity
          style={[styles.liveChatBtn, { bottom: Math.max(insets.bottom, 3) + 70 }]}
        >
          <Text style={styles.liveChatText}>LiveChat</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: screenWidth,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 40,
    paddingBottom: 100,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0B1741',
  },
  nameText: {
    color: '#808080',
    fontSize: 20,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },
  bellIcon: {
    marginLeft: 12,
  },
  hamburger: {
    fontSize: 45,
    color: '#fff',
  },
  contentBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1741',
    marginBottom: 20,
  },
  buttonList: {
    gap: 60,
  },
  navButton: {
    backgroundColor: '#1F245E',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  liveChatBtn: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#D63B3B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  liveChatText: {
    color: '#fff',
    fontWeight: '600',
  },
});
