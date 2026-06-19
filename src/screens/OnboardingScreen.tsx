import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, FlatList, Animated,
} from 'react-native';
import Svg, { Circle, Path, Rect, Polyline, Line, G } from 'react-native-svg';
import { colors, spacing, radius } from '../theme';

const { width } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

function IllustrationSearch() {
  return (
    <Svg width="120" height="120" viewBox="0 0 120 120">
      <Circle cx="60" cy="60" r="58" fill={colors.primary} fillOpacity="0.08"/>
      {/* Magnifier */}
      <Circle cx="52" cy="52" r="24" stroke={colors.primary} strokeWidth="5" fill="none"/>
      <Line x1="70" y1="70" x2="88" y2="88" stroke={colors.primary} strokeWidth="5" strokeLinecap="round"/>
      {/* Person in circle */}
      <Circle cx="52" cy="46" r="8" fill={colors.secondary} fillOpacity="0.8"/>
      <Path d="M36 66 Q36 56 52 56 Q68 56 68 66" fill={colors.secondary} fillOpacity="0.5"/>
    </Svg>
  );
}

function IllustrationCalendar() {
  return (
    <Svg width="120" height="120" viewBox="0 0 120 120">
      <Circle cx="60" cy="60" r="58" fill={colors.secondary} fillOpacity="0.08"/>
      {/* Calendar */}
      <Rect x="22" y="32" width="76" height="68" rx="10" fill="white" stroke={colors.secondary} strokeWidth="3"/>
      <Rect x="22" y="32" width="76" height="22" rx="10" fill={colors.primary}/>
      <Rect x="22" y="46" width="76" height="8" fill={colors.primary}/>
      {/* Bars on top */}
      <Rect x="40" y="24" width="6" height="18" rx="3" fill={colors.primary}/>
      <Rect x="74" y="24" width="6" height="18" rx="3" fill={colors.primary}/>
      {/* Calendar dots */}
      {[0,1,2,3,4,5,6,7,8,9,10,11].map((i) => (
        <Circle
          key={i}
          cx={36 + (i % 4) * 18}
          cy={72 + Math.floor(i / 4) * 16}
          r={i === 2 ? 7 : 4}
          fill={i === 2 ? colors.secondary : colors.primary}
          fillOpacity={i === 2 ? 1 : 0.25}
        />
      ))}
    </Svg>
  );
}

function IllustrationProgress() {
  return (
    <Svg width="120" height="120" viewBox="0 0 120 120">
      <Circle cx="60" cy="60" r="58" fill={colors.success} fillOpacity="0.08"/>
      {/* Bar chart */}
      <Rect x="22" y="86" width="76" height="4" rx="2" fill={colors.primary} fillOpacity="0.2"/>
      <Rect x="30" y="60" width="16" height="30" rx="4" fill={colors.primary} fillOpacity="0.4"/>
      <Rect x="52" y="44" width="16" height="46" rx="4" fill={colors.secondary}/>
      <Rect x="74" y="32" width="16" height="58" rx="4" fill={colors.success}/>
      {/* Trophy */}
      <Circle cx="82" cy="28" r="8" fill="#F59E0B" fillOpacity="0.9"/>
      <Path d="M78 26 L80 30 L82 25 L84 30 L86 26" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
    </Svg>
  );
}

const slides = [
  {
    id: '1',
    Illustration: IllustrationSearch,
    title: 'Encontre o instrutor certo',
    description: 'Busque por bairro, categoria e preço. Compare avaliações reais de outros alunos e escolha com confiança.',
    accentColor: colors.primary,
  },
  {
    id: '2',
    Illustration: IllustrationCalendar,
    title: 'Agende sem telefonar',
    description: 'Veja os horários disponíveis em tempo real e confirme sua próxima aula em poucos toques.',
    accentColor: colors.secondary,
  },
  {
    id: '3',
    Illustration: IllustrationProgress,
    title: 'Acompanhe seu progresso',
    description: 'Simulados por categoria, horas de aula e tudo o que você precisa para chegar na prova preparado.',
    accentColor: colors.success,
  },
];

export default function OnboardingScreen({ onFinish }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const goTo = (index: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      goTo(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  const accentColor = slides[currentIndex].accentColor;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipBtn} onPress={onFinish}>
        <Text style={styles.skipText}>Pular</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Animated.View style={[styles.slide, { width, opacity: fadeAnim }]}>
            <View style={[styles.illustrationWrap, { backgroundColor: item.accentColor + '12' }]}>
              <item.Illustration />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </Animated.View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goTo(i)}>
              <View
                style={[
                  styles.dot,
                  i === currentIndex && [styles.dotActive, { backgroundColor: accentColor }],
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: accentColor }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextText}>
            {currentIndex === slides.length - 1 ? 'Começar' : 'Próximo'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  skipBtn: {
    position: 'absolute', top: 56, right: spacing.lg, zIndex: 10, padding: spacing.sm,
  },
  skipText: { color: colors.textSecondary, fontSize: 14, fontWeight: '500' },
  slide: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.xl, paddingTop: 80,
  },
  illustrationWrap: {
    width: 160, height: 160, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl,
  },
  title: {
    fontSize: 26, fontWeight: '700', color: colors.text,
    textAlign: 'center', marginBottom: spacing.md, lineHeight: 34,
  },
  description: {
    fontSize: 16, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 26,
  },
  footer: {
    paddingHorizontal: spacing.lg, paddingBottom: 52, gap: spacing.lg,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm },
  dot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border,
  },
  dotActive: { width: 24, backgroundColor: colors.primary },
  nextBtn: {
    paddingVertical: 16, borderRadius: radius.lg, alignItems: 'center',
  },
  nextText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
