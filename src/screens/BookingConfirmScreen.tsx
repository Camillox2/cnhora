import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import { Instructor } from '../data';

interface Props {
  instructor: Instructor;
  date: string;
  dayLabel: string;
  time: string;
  onNavigate: (screen: string, params?: any) => void;
}

export default function BookingConfirmScreen({
  instructor,
  date,
  dayLabel,
  time,
  onNavigate,
}: Props) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity }]}>
        {/* Success Icon */}
        <Animated.View style={[styles.successIcon, { transform: [{ scale }] }]}>
          <Text style={styles.successEmoji}>✓</Text>
        </Animated.View>

        <Text style={styles.title}>Aula agendada!</Text>
        <Text style={styles.subtitle}>
          Seu agendamento foi confirmado com sucesso. O instrutor receberá uma notificação.
        </Text>

        {/* Booking Details */}
        <View style={[styles.detailsCard, shadow.md]}>
          <Text style={styles.detailsTitle}>Detalhes do agendamento</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text>👤</Text>
            </View>
            <View>
              <Text style={styles.detailLabel}>Instrutor</Text>
              <Text style={styles.detailValue}>{instructor.name}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text>📅</Text>
            </View>
            <View>
              <Text style={styles.detailLabel}>Data</Text>
              <Text style={styles.detailValue}>
                {dayLabel}, {date}/2026
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text>🕐</Text>
            </View>
            <View>
              <Text style={styles.detailLabel}>Horário</Text>
              <Text style={styles.detailValue}>{time}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text>📍</Text>
            </View>
            <View>
              <Text style={styles.detailLabel}>Local de saída</Text>
              <Text style={styles.detailValue}>{instructor.neighborhood}, Curitiba</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text>💳</Text>
            </View>
            <View>
              <Text style={styles.detailLabel}>Pagamento</Text>
              <Text style={styles.detailValue}>R$ {instructor.pricePerLesson},00 · Protegido</Text>
            </View>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            📱 Você receberá uma notificação 24h e 1h antes da aula.
          </Text>
          <Text style={styles.infoText}>
            ↩️ Cancelamento gratuito com até 24h de antecedência.
          </Text>
          <Text style={styles.infoText}>
            🔒 Pagamento liberado ao instrutor somente após a aula.
          </Text>
        </View>
      </Animated.View>

      {/* Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => onNavigate('MinhasAulas')}
        >
          <Text style={styles.primaryBtnText}>Ver minhas aulas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => onNavigate('Home')}
        >
          <Text style={styles.secondaryBtnText}>Voltar ao início</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: 80,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successEmoji: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  detailsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: { fontSize: 11, color: colors.textSecondary },
  detailValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  separator: { height: 1, backgroundColor: colors.borderLight, marginVertical: 4 },
  infoBox: {
    width: '100%',
    backgroundColor: colors.primary + '10',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  infoText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  footer: {
    padding: spacing.lg,
    paddingBottom: 40,
    gap: spacing.sm,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  secondaryBtn: {
    paddingVertical: 14,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryBtnText: { color: colors.text, fontSize: 15, fontWeight: '500' },
});
