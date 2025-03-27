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
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <ImageBackground
        source={require('../../assets/images/Dashboard.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Top Icons */}
          <View style={styles.headerIcons}>
            <Pressable onPress={() => {}}>
              <Text style={styles.hamburger}>☰</Text>
            </Pressable>

            <Image
              source={require('../../assets/images/profilepic.png')}
              style={styles.profilePic}
            />
          </View>

          {/* Header Text */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.trnText}>TRN XXX-XXX-000</Text>
          </View>
        </SafeAreaView>

        {/* Main Content */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Outstanding Life Certificate */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Outstanding Life Certificate</Text>
              <TouchableOpacity>
                <MaterialIcons name="more-vert" size={20} color="#999" />
              </TouchableOpacity>
            </View>
            <View style={styles.underline} />

            <TouchableOpacity style={styles.certificateBtn}>
              <Text style={styles.certificateBtnText}>
                REF#123456  AGP/B1234{'\n'}Life Certificate For January Quarter
              </Text>
            </TouchableOpacity>
            <Text style={styles.dueText}>Due on: 01/01/2025</Text>
          </View>

          {/* Previous Life Certificates */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Previous Life Certificate Uploads</Text>
              <TouchableOpacity>
                <MaterialIcons name="more-vert" size={20} color="#999" />
              </TouchableOpacity>
            </View>
            <View style={styles.underline} />

            {[
              {
                ref: '123457',
                title: 'Life Certificate For April Quarter',
                date: '04/01/2024',
              },
              {
                ref: '123458',
                title: 'Life Certificate For July Quarter',
                date: '07/01/2024',
              },
              {
                ref: '123459',
                title: 'Life Certificate For October Quarter',
                date: '10/01/2024',
              },
            ].map((item, index) => (
              <View key={index} style={styles.previousItem}>
                <Text style={styles.refText}>REF#{item.ref}  AGP/B1234</Text>
                <Text style={styles.prevText}>{item.title}</Text>
                <Text style={styles.submittedText}>Submitted on: {item.date}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* LiveChat Floating Button */}
        <TouchableOpacity
          style={[
            styles.liveChatBtn,
            { bottom: Math.max(insets.bottom, 3) + 70 }, // consistent positioning
          ]}
        >
          <Text style={styles.liveChatText}>LiveChat</Text>
        </TouchableOpacity>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: screenWidth,
    backgroundColor: '#F6F6F6',
  },
  safeArea: {
    paddingHorizontal: 16,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  hamburger: {
    fontSize: 45,
    color: '#fff',
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerTextContainer: {
    marginTop: 40,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0B1741',
  },
  trnText: {
    color: '#808080',
    fontSize: 14,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0B1741',
  },
  underline: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 4,
    marginBottom: 12,
  },
  certificateBtn: {
    backgroundColor: '#1F245E',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  certificateBtnText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  dueText: {
    fontSize: 14,
    color: '#888',
  },
  previousItem: {
    marginBottom: 12,
  },
  refText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B1741',
  },
  prevText: {
    fontSize: 14,
    color: '#333',
  },
  submittedText: {
    fontSize: 14,
    color: '#888',
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
