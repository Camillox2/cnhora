import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Dimensions,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import { studentProgress, myLessons } from '../data';
import { SearchIcon, FileTextIcon, TrendingUpIcon, CalendarIcon, CarIcon, CheckCircleIcon } from '../components/Icons';

const { width } = Dimensions.get('window');

interface Props {
  onNavigate: (screen: string, params?: any) => void;
  user?: { name: string; role: string } | null;
}

function ProgressRing({ value, size = 64 }: { value: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (value / 100) * circ;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Background circle */}
      <View
        style={{
          position: 'absolute', width: size, height: size, borderRadius: size / 2,
          borderWidth: 5, borderColor: 'rgba(255,255,255,0.2)',
        }}
      />
      {/* Fill arc approximated with a solid ring segment */}
      <View
        style={{
          position: 'absolute', width: size, height: size, borderRadius: size / 2,
          borderWidth: 5, borderColor: '#FFFFFF',
          borderRightColor: value > 75 ? '#FFFFFF' : 'transparent',
          borderBottomColor: value > 50 ? '#FFFFFF' : 'transparent',
          borderLeftColor: value > 25 ? '#FFFFFF' : 'transparent',
          transform: [{ rotate: '-90deg' }],
        }}
      />
      <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: size > 60 ? 16 : 13 }}>{value}%</Text>
    </View>
  );
}

export default function HomeScreen({ onNavigate, user }: Props) {
  const nextLesson = myLessons.find((l) => l.status === 'scheduled');
  const p = studentProgress;
  const firstName = user?.name?.split(' ')[0] ?? p.name.split(' ')[0];
  const initials = user?.name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    ?? p.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  const quickActions = [
    { icon: SearchIcon, title: 'Buscar instrutor', sub: '5 disponíveis', screen: 'Buscar', color: colors.secondary },
    { icon: FileTextIcon, title: 'Simulado', sub: '10 questões', screen: 'Simulados', color: '#7C3AED' },
    { icon: TrendingUpIcon, title: 'Progresso', sub: `${p.theoryProgress}% teoria`, screen: 'Progresso', color: colors.success },
    { icon: CalendarIcon, title: 'Minhas aulas', sub: `${myLessons.length} no total`, screen: 'MinhasAulas', color: '#F59E0B' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {firstName} 👋</Text>
          <Text style={styles.subGreeting}>Vamos estudar hoje?</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      </View>

      {/* Progress Card */}
      <View style={[styles.progressCard, shadow.md]}>
        <View style={styles.progressHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardLabel}>Progresso CNH {p.category}</Text>
            <Text style={styles.progressSubtitle}>Categoria Carro</Text>
          </View>
          <ProgressRing value={p.theoryProgress} size={64} />
        </View>

        <View style={styles.progressBars}>
          <View style={styles.barRow}>
            <Text style={styles.barLabel}>Teoria</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${p.theoryProgress}%` as any }]} />
            </View>
            <Text style={styles.barValue}>{p.theoryProgress}%</Text>
          </View>
          <View style={styles.barRow}>
            <Text style={styles.barLabel}>Prática</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill, styles.barFillGreen,
                  { width: `${Math.round((p.practicalHours / p.requiredPracticalHours) * 100)}%` as any },
                ]}
              />
            </View>
            <Text style={styles.barValue}>{p.practicalHours}h/{p.requiredPracticalHours}h</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {[
            { value: `${p.simuladoScore}/${p.simuladoTotal}`, label: 'Simulado', color: colors.text },
            { value: `${p.lessonsCompleted}`, label: 'Aulas feitas', color: colors.text },
            { value: `${p.approvalChance}%`, label: 'Aprovação', color: colors.success },
          ].map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 && <View style={styles.statDivider} />}
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Próxima Aula */}
      {nextLesson && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próxima aula</Text>
          <TouchableOpacity
            style={[styles.nextLessonCard, shadow.sm]}
            onPress={() => onNavigate('MinhasAulas')}
            activeOpacity={0.8}
          >
            <View style={styles.lessonIconWrap}>
              <CarIcon size={24} color={colors.secondary} />
            </View>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>Cat. {nextLesson.category} · {nextLesson.neighborhood}</Text>
              <Text style={styles.lessonInstructor}>{nextLesson.instructorName}</Text>
              <View style={styles.lessonTimeRow}>
                <Text style={styles.lessonTime}>
                  {nextLesson.date.split('-').reverse().join('/')} às {nextLesson.time}
                </Text>
                <View style={styles.confirmedBadge}>
                  <CheckCircleIcon size={12} color={colors.success} />
                  <Text style={styles.confirmedText}>Confirmado</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acesso rápido</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.actionCard, shadow.sm]}
              onPress={() => onNavigate(action.screen)}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: action.color + '15' }]}>
                <action.icon size={22} color={action.color} />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSub}>{action.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Platform Stats */}
      <View style={[styles.statsCard, shadow.sm]}>
        <Text style={styles.statsCardTitle}>CNHora em números</Text>
        <View style={styles.platformStats}>
          {[
            { value: '+12k', label: 'Alunos aprovados' },
            { value: '+800', label: 'Instrutores ativos' },
            { value: '98%', label: 'Taxa de aprovação' },
            { value: '4.9★', label: 'Avaliação média' },
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
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 56, paddingBottom: 36, paddingHorizontal: spacing.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  greeting: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  subGreeting: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  progressCard: {
    margin: spacing.lg, marginTop: -20,
    backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: spacing.md,
  },
  cardLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
  progressSubtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  progressBars: { gap: spacing.sm, marginBottom: spacing.md },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  barLabel: { fontSize: 12, color: colors.textSecondary, width: 44 },
  barTrack: { flex: 1, height: 7, backgroundColor: colors.borderLight, borderRadius: 4 },
  barFill: { height: 7, backgroundColor: colors.primary, borderRadius: 4 },
  barFillGreen: { backgroundColor: colors.success },
  barValue: { fontSize: 11, color: colors.textSecondary, width: 44, textAlign: 'right' },
  statsRow: {
    flexDirection: 'row', borderTopWidth: 1,
    borderTopColor: colors.borderLight, paddingTop: spacing.md,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', color: colors.primary },
  statLabel: { fontSize: 10, color: colors.textSecondary, textAlign: 'center', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.borderLight },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  nextLessonCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, flexDirection: 'row', gap: spacing.md,
  },
  lessonIconWrap: {
    width: 50, height: 50, backgroundColor: colors.secondary + '12',
    borderRadius: radius.md, alignItems: 'center', justifyContent: 'center',
  },
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  lessonInstructor: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  lessonTimeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 6 },
  lessonTime: { fontSize: 12, color: colors.textSecondary },
  confirmedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.successLight, paddingHorizontal: 8,
    paddingVertical: 3, borderRadius: radius.full,
  },
  confirmedText: { fontSize: 10, color: colors.success, fontWeight: '600' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  actionCard: {
    width: (width - spacing.lg * 2 - spacing.md) / 2 - 0.5,
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, gap: 6,
  },
  actionIconWrap: {
    width: 42, height: 42, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center', marginBottom: 2,
  },
  actionTitle: { fontSize: 13, fontWeight: '700', color: colors.text },
  actionSub: { fontSize: 11, color: colors.textSecondary },
  statsCard: {
    marginHorizontal: spacing.lg, backgroundColor: colors.primary,
    borderRadius: radius.xl, padding: spacing.lg,
  },
  statsCardTitle: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.65)', marginBottom: spacing.md },
  platformStats: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  platformStat: { width: '45%' },
  platformStatValue: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  platformStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
});
