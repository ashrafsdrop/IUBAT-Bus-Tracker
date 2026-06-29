import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  StyleSheet,
  Image,
  Platform,
  Easing,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemeToggle from '../components/ThemeToggle';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ onNavigate, isDarkMode, setIsDarkMode }: { onNavigate?: (screen: string) => void, isDarkMode: boolean, setIsDarkMode: (val: boolean) => void }) => {
  const insets = useSafeAreaInsets();
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const titleSlide = useRef(new Animated.Value(-30)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const card1Slide = useRef(new Animated.Value(60)).current;
  const card2Slide = useRef(new Animated.Value(60)).current;
  const card1Opacity = useRef(new Animated.Value(0)).current;
  const card2Opacity = useRef(new Animated.Value(0)).current;

  // Continuous animation refs
  const orb1Float = useRef(new Animated.Value(0)).current;
  const orb2Float = useRef(new Animated.Value(0)).current;
  const orb3Float = useRef(new Animated.Value(0)).current;
  const liveDotPulse = useRef(new Animated.Value(1)).current;
  const busTranslateX = useRef(new Animated.Value(-150)).current;

  // IUBAT Brand Colors
  const COLORS = {
    primaryGreen: '#147C41',
    darkGreen: '#0D5A2E',
    lightGreen: '#1A9A52',
    gold: '#F2E140',
    darkGold: '#D4C236',
    red: '#C41E3A',
    darkRed: '#9A1830',
    cream: '#FEFDF5',
    white: '#FFFFFF',
    slate: '#334155',
    lightSlate: '#64748B',
  };

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }

    // Continuous floating animations for background orbs
    const floatAnimation = (anim: Animated.Value, toValue: number, duration: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue, duration, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration, useNativeDriver: true })
        ])
      ).start();
    };

    floatAnimation(orb1Float, -20, 3000);
    floatAnimation(orb2Float, 20, 4000);
    floatAnimation(orb3Float, -15, 3500);

    // Continuous pulse for Live Location dot
    Animated.loop(
      Animated.sequence([
        Animated.timing(liveDotPulse, { toValue: 0.2, duration: 800, useNativeDriver: true }),
        Animated.timing(liveDotPulse, { toValue: 1, duration: 800, useNativeDriver: true })
      ])
    ).start();

    // Continuous bus driving across the background
    const busLoop = () => {
      Animated.sequence([
        Animated.timing(busTranslateX, {
          toValue: Dimensions.get('window').width + 100,
          duration: 12000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(busTranslateX, {
          toValue: -150,
          duration: 0,
          useNativeDriver: true,
        })
      ]).start(() => busLoop());
    };
    busLoop();

    // Smooth, snappy cascading entrance animation
    Animated.stagger(80, [
      // 1. Logo pops in
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
      // 2. Title and Subtitle slide up smoothly
      Animated.parallel([
        Animated.timing(titleSlide, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // 3. Card 1 pops up
      Animated.parallel([
        Animated.spring(card1Slide, {
          toValue: 0,
          friction: 7,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(card1Opacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
      // 4. Card 2 pops up
      Animated.parallel([
        Animated.spring(card2Slide, {
          toValue: 0,
          friction: 7,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(card2Opacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  // Press feedback animation
  const handlePressIn = (scaleRef) => {
    Animated.spring(scaleRef, {
      toValue: 0.96,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scaleRef) => {
    Animated.spring(scaleRef, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const studentScale = useRef(new Animated.Value(1)).current;
  const driverScale = useRef(new Animated.Value(1)).current;

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: isDarkMode ? '#0F172A' : '#FEFDF5' }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent={true} />

      {/* Decorative Background Elements */}
      <View style={styles.bgContainer}>
        <Animated.View style={[styles.bgOrb, styles.bgOrbTop, { transform: [{ translateY: orb1Float }] }]} />
        <Animated.View style={[styles.bgOrb, styles.bgOrbBottom, { transform: [{ translateY: orb2Float }] }]} />
        <Animated.View style={[styles.bgOrb, styles.bgOrbSmall, { transform: [{ translateY: orb3Float }] }]} />
      </View>

      {/* Animated Bus – cruising in the background */}
      <Animated.View
        style={[
          styles.busContainer,
          { transform: [{ translateX: busTranslateX }] },
        ]}
      >
        <Text style={styles.busEmoji}>🚌</Text>
      </Animated.View>

      <Animated.View 
        style={[
          styles.content,
          { opacity: fadeAnim }
        ]}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <ThemeToggle 
            isDarkMode={isDarkMode}
            onToggle={setIsDarkMode}
            style={{ position: 'absolute', top: 0, right: 0, zIndex: 10, padding: 0 }}
          />
          {/* Logo with Ring Animation */}
          <Animated.View style={[
            styles.logoWrapper,
            { transform: [{ scale: logoScale }] }
          ]}>
            <View style={[styles.logoRing, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
              <View style={styles.logoInner}>
                <Image
                  source={require('./assets/iubat-logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            </View>
            {/* Decorative dots */}
            <View style={[styles.decoDot, styles.decoDot1]} />
            <View style={[styles.decoDot, styles.decoDot2]} />
            <View style={[styles.decoDot, styles.decoDot3]} />
          </Animated.View>

          {/* Title */}
          <Animated.View style={[
            styles.titleContainer,
            { transform: [{ translateY: titleSlide }] }
          ]}>
            <Text style={styles.universityText}>IUBAT</Text>
            <View style={styles.titleUnderline}>
              <View style={styles.underlineGreen} />
              <View style={styles.underlineGold} />
              <View style={styles.underlineRed} />
            </View>
            <Text style={[styles.appNameText, { color: isDarkMode ? '#F8FAFC' : '#1E293B' }]}>Bus Tracker</Text>
          </Animated.View>

          {/* Subtitle */}
          <Animated.View style={{ opacity: subtitleFade }}>
            <Text style={[styles.subtitle, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>
              Select your role to get started
            </Text>
          </Animated.View>
        </View>

        {/* Cards Section */}
        <View style={styles.cardsContainer}>
          {/* Student Card */}
          <Animated.View style={[
            { 
              transform: [{ translateY: card1Slide }, { scale: studentScale }],
              opacity: card1Opacity,
            }
          ]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPressIn={() => handlePressIn(studentScale)}
              onPressOut={() => handlePressOut(studentScale)}
              onPress={() => onNavigate && onNavigate('Selection')}
              style={[styles.card, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(20, 124, 65, 0.08)' }]}
            >
              <View style={styles.cardContent}>
                <View style={[styles.iconContainer, styles.studentIconBg]}>
                  <Text style={styles.iconText}>🚏</Text>
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={[styles.cardTitle, { color: isDarkMode ? '#F8FAFC' : '#1E293B' }]}>I'm Waiting for Bus </Text>
                  <Text style={[styles.cardDescription, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>
                    Track bus locations and get arrival notifications
                  </Text>
                </View>
                <View style={[styles.arrowContainer, { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' }]}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </View>
              {/* Progress bar decoration */}
              <View style={[styles.progressBarBg, { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' }]}>
                <View style={[styles.progressBarFill, styles.studentProgress]} />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Driver Card */}
          <Animated.View style={[
            { 
              transform: [{ translateY: card2Slide }, { scale: driverScale }],
              opacity: card2Opacity,
            }
          ]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPressIn={() => handlePressIn(driverScale)}
              onPressOut={() => handlePressOut(driverScale)}
              onPress={() => onNavigate && onNavigate('Seeder')}
              style={[styles.card, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(20, 124, 65, 0.08)' }]}
            >
              <View style={styles.cardContent}>
                <View style={[styles.iconContainer, styles.driverIconBg]}>
                  <Text style={styles.iconText}>🚌</Text>
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={[styles.cardTitle, { color: isDarkMode ? '#F8FAFC' : '#1E293B' }]}>I'm on the Bus</Text>
                  <Text style={[styles.cardDescription, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>
                    Share location and help others track the route
                  </Text>
                </View>
                <View style={[styles.arrowContainer, { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' }]}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </View>
              {/* Live indicator */}
              <View style={[styles.liveIndicator, { borderTopColor: isDarkMode ? '#334155' : '#F1F5F9' }]}>
                <Animated.View style={[styles.liveDot, { opacity: liveDotPulse }]} />
                <Text style={[styles.liveText, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>LIVE LOCATION</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLine} />
          <Text style={[styles.footerText, { color: isDarkMode ? '#64748B' : '#94A3B8' }]}>
            International University of Business Agriculture and Technology
          </Text>
          <View style={styles.footerColors}>
            <View style={[styles.colorStrip, { backgroundColor: COLORS.primaryGreen }]} />
            <View style={[styles.colorStrip, { backgroundColor: COLORS.gold }]} />
            <View style={[styles.colorStrip, { backgroundColor: COLORS.red }]} />
          </View>
        </View>
      </Animated.View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  bgContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  bgOrb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.08,
  },
  bgOrbTop: {
    width: 300,
    height: 300,
    backgroundColor: '#147C41',
    top: -100,
    right: -80,
  },
  bgOrbBottom: {
    width: 250,
    height: 250,
    backgroundColor: '#C41E3A',
    bottom: -60,
    left: -60,
  },
  bgOrbSmall: {
    width: 150,
    height: 150,
    backgroundColor: '#F2E140',
    top: '40%',
    left: '10%',
    opacity: 0.06,
  },
  busContainer: {
    position: 'absolute',
    top: '18%',
    left: 0,
    opacity: 0.05,
    zIndex: 1,
  },
  busEmoji: {
    fontSize: 120,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  logoRing: {
    width: 110,
    height: 110,
    borderRadius: 32,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#147C41',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#F2E140',
  },
  logoInner: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 70,
    height: 70,
  },
  decoDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  decoDot1: {
    backgroundColor: '#147C41',
    top: 0,
    right: -12,
  },
  decoDot2: {
    backgroundColor: '#F2E140',
    bottom: 10,
    left: -12,
  },
  decoDot3: {
    backgroundColor: '#C41E3A',
    bottom: -5,
    right: 20,
    width: 6,
    height: 6,
  },
  titleContainer: {
    alignItems: 'center',
  },
  universityText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#147C41',
    letterSpacing: 2,
    marginLeft: 2,
    textShadowColor: 'rgba(20, 124, 65, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  titleUnderline: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 8,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  underlineGreen: {
    width: 30,
    backgroundColor: '#147C41',
  },
  underlineGold: {
    width: 30,
    backgroundColor: '#F2E140',
  },
  underlineRed: {
    width: 30,
    backgroundColor: '#C41E3A',
  },
  appNameText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#94A3B8',
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  cardsContainer: {
    gap: 16,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  studentIconBg: {
    backgroundColor: 'rgba(20, 124, 65, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(20, 124, 65, 0.2)',
  },
  driverIconBg: {
    backgroundColor: 'rgba(196, 30, 58, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(196, 30, 58, 0.15)',
  },
  iconText: {
    fontSize: 26,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
    fontWeight: '500',
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  arrowText: {
    fontSize: 18,
    color: '#147C41',
    fontWeight: '700',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  studentProgress: {
    width: '65%',
    backgroundColor: '#147C41',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C41E3A',
    marginRight: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#C41E3A',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C41E3A',
    letterSpacing: 1.5,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 24,
  },
  footerLine: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    marginBottom: 12,
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 12,
  },
  footerColors: {
    flexDirection: 'row',
    gap: 4,
  },
  colorStrip: {
    width: 24,
    height: 4,
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  pinInput: {
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderRadius: 16,
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 12,
    marginBottom: 8,
  },
  errorText: {
    color: '#C41E3A',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginTop: 16,
  },
  modalBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default WelcomeScreen;