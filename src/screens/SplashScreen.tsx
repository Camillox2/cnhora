import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { colors } from '../theme';

interface Props {
  onFinish: () => void;
}

function SplashLogo({ size = 88 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 88 88">
      <Rect width="88" height="88" rx="22" fill="rgba(255,255,255,0.18)"/>
      {/* Road */}
      <Path d="M20 68 Q44 48 68 68" stroke="rgba(255,255,255,0.3)" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Car body */}
      <Rect x="26" y="44" width="36" height="18" rx="5" fill="white" fillOpacity="0.9"/>
      {/* Car roof */}
      <Path d="M32 44 L36 34 H52 L56 44Z" fill="white" fillOpacity="0.75"/>
      {/* Wheels */}
      <Circle cx="34" cy="62" r="6" fill={colors.primaryLight}/>
      <Circle cx="54" cy="62" r="6" fill={colors.primaryLight}/>
      <Circle cx="34" cy="62" r="3" fill="white" fillOpacity="0.6"/>
      <Circle cx="54" cy="62" r="3" fill="white" fillOpacity="0.6"/>
      {/* Windshield */}
      <Path d="M36 43 L38.5 35.5 H49.5 L52 43Z" fill={colors.secondary} fillOpacity="0.7"/>
      {/* Headlights */}
      <Rect x="58" y="50" width="4" height="6" rx="2" fill="#FEF08A" fillOpacity="0.9"/>
    </Svg>
  );
}

export default function SplashScreen({ onFinish }: Props) {
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.75);
  const translateY = new Animated.Value(20);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 7, tension: 80, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 350, useNativeDriver: true }).start(() =>
        onFinish()
      );
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.logoContainer, { opacity, transform: [{ scale }, { translateY }] }]}
      >
        <SplashLogo size={100} />
        <Text style={styles.logoText}>CNHora</Text>
        <Text style={styles.tagline}>Sua CNH com quem entende</Text>

        {/* Decorative dots */}
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
          ))}
        </View>
      </Animated.View>

      <Text style={styles.version}>v1.0.0 · Curitiba/PR</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: { alignItems: 'center', gap: 12 },
  logoText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginTop: 4,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '400',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    width: 18,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  version: {
    position: 'absolute',
    bottom: 48,
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
  },
});
