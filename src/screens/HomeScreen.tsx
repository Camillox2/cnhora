import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import { studentProgress, myLessons } from '../data';

interface Props {
  onNavigate: (screen: string, params?: any) => void;
}

function ProgressCircle({ value, size = 64 }: { value: number; size?: number }) {
  return (
    <View style={[styles.progressCircle, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={styles.progressValue}>{value}%</Text>
    </View>
  );
}

export default function HomeScreen({ onNavigate }: Props) {
  const nextLesson = myLessons.find((l) => l.status === 'scheduled');
  const p = studentProgress;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {p.name.split(' ')[0]} 👋</Text>
          <Text style={styles.subGreeting}>Vamos estudar hoje?</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>VC</Text>
        </View>
      </View>

      {/* Progress Card */}
      <View style={[styles.progressCard, shadow.md]}>
        <View style={styles.progressHeader}>
          <View>
            <Text style={styles.cardLabel}>Progresso CNH {p.category}</Text>
            <Text style={styles.progressSubtitle}>Categoria Carro</Text>
          </View>
          <ProgressCircle value={p.theoryProgress} />
        </View>

        <View style={styles.progressBars}>
          <View style={styles.barRow}>
            <Text style={styles.barLabel}>Teoria</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${p.theoryProgress}%` }]} />
            </View>
            <Text style={styles.barValue}>{p.theoryProgress}%</Text>
          </View>
          <View style={styles.barRow}>
            <Text style={styles.barLabel}>Prática</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  styles.barFillGreen,
                  {
                    width: `${Math.round((p.practicalHours / p.requiredPracticalHours) * 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.barValue}>
              {p.practicalHours}h/{p.requiredPracticalHours}h
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{p.simuladoScore}/{p.simuladoTotal}</Text>
            <Text style={styles.statLabel}>Simulado</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{p.lessonsCompleted}</Text>
            <Text style={styles.statLabel}>Aulas feitas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.success }]}>{p.approvalChance}%</Text>
            <Text style={styles.statLabel}>Chances aprovação</Text>
          </View>
        </View>
      </View>

      {/* Próxima Aula */}
      {nextLesson && (
        <View style={[styles.section]}>
          <Text style={styles.sectionTitle}>Próxima aula</Text>
          <TouchableOpacity
            style={[styles.nextLessonCard, shadow.sm]}
            onPress={() => onNavigate('MinhasAulas')}
          >
            <View style={styles.lessonIcon}>
              <Text style={styles.lessonIconText}>🚗</Text>
            </View>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>Categoria {nextLesson.category} · {nextLesson.neighborhood}</Text>
              <Text style={styles.lessonInstructor}>{nextLesson.instructorName}</Text>
              <View style={styles.lessonTimeRow}>
                <Text style={styles.lessonTime}>
                  {nextLesson.date.split('-').reverse().join('/')} às {nextLesson.time}
                </Text>
                <View style={styles.confirmedBadge}>
                  <Text style={styles.confirmedText}>✓ Confirmado</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Ações Rápidas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acesso rápido</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionCard, shadow.sm]}
            onPress={() => onNavigate('Buscar')}
          >
            <Text style={styles.actionEmoji}>🔍</Text>
            <Text style={styles.actionTitle}>Buscar instrutor</Text>
            <Text style={styles.actionSub}>5 disponíveis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, shadow.sm]}
            onPress={() => onNavigate('Simulados')}
          >
            <Text style={styles.actionEmoji}>📝</Text>
            <Text style={styles.actionTitle}>Simulado</Text>
            <Text style={styles.actionSub}>10 questões</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, shadow.sm]}
            onPress={() => onNavigate('Progresso')}
          >
            <Text style={styles.actionEmoji}>📈</Text>
            <Text style={styles.actionTitle}>Progresso</Text>
            <Text style={styles.actionSub}>{p.theoryProgress}% teoria</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, shadow.sm]}
            onPress={() => onNavigate('MinhasAulas')}
          >
            <Text style={styles.actionEmoji}>📅</Text>
            <Text style={styles.actionTitle}>Minhas aulas</Text>
            <Text style={styles.actionSub}>{myLessons.length} no total</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Plataforma Stats */}
      <View style={[styles.statsCard, shadow.sm]}>
        <Text style={styles.statsCardTitle}>CNHora em números</Text>
        <View style={styles.platformStats}>
          {[
            { value: '+12k', label: 'Alunos aprovados' },
            { value: '+800', label: 'Instrutores ativos' },
            { value: '98%', label: 'Taxa de aprovação' },
            { value: '4.9', label: 'Avaliação média' },
          ].map((s, i) => (
            <View key={i} style={styles.platformStat}>
              <Text style={styles.platformStatValue}>{s.value}</Text>
              <Text style={styles.platformStatLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 56,
    paddingBottom: 32,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subGreeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  progressCard: {
    margin: spacing.lg,
    marginTop: -20,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  progressSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  progressCircle: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressValue: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  progressBars: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  barLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    width: 44,
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
  },
  barFill: {
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  barFillGreen: {
    backgroundColor: colors.success,
  },
  barValue: {
    fontSize: 11,
    color: colors.textSecondary,
    width: 40,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  nextLessonCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.md,
  },
  lessonIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.primary + '12',
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonIconText: {
    fontSize: 24,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  lessonInstructor: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  lessonTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 6,
  },
  lessonTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  confirmedBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  confirmedText: {
    fontSize: 10,
    color: colors.success,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 4,
  },
  actionEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  actionSub: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statsCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  statsCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.md,
  },
  platformStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  platformStat: {
    width: '45%',
  },
  platformStatValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  platformStatLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
});
