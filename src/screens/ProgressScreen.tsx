import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import { studentProgress, myLessons } from '../data';

interface Props {}

function ProgressBar({ value, max, color = colors.primary }: { value: number; max: number; color?: string }) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return (
    <View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.barLabel}>{pct}% concluído</Text>
    </View>
  );
}

export default function ProgressScreen({}: Props) {
  const p = studentProgress;
  const completed = myLessons.filter((l) => l.status === 'completed').length;

  const milestones = [
    { label: 'Cadastro na plataforma', done: true },
    { label: 'Perfil completo', done: true },
    { label: 'Primeira aula agendada', done: true },
    { label: 'Teoria 50% aproveitada', done: true },
    { label: '10 horas de prática', done: true },
    { label: 'Teoria 100% aproveitada', done: false },
    { label: '20 horas de prática concluídas', done: false },
    { label: 'Exame marcado', done: false },
    { label: 'Aprovação na prova', done: false },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meu progresso</Text>
        <Text style={styles.headerSub}>Acompanhe sua jornada rumo à CNH</Text>
      </View>

      {/* Approval Chance */}
      <View style={[styles.chanceCard, shadow.md]}>
        <View style={styles.chanceHeader}>
          <Text style={styles.chanceTitle}>Chance de aprovação</Text>
          <Text style={styles.chanceValue}>{p.approvalChance}%</Text>
        </View>
        <View style={styles.barTrackLg}>
          <View
            style={[styles.barFillLg, { width: `${p.approvalChance}%`, backgroundColor: colors.success }]}
          />
        </View>
        <Text style={styles.chanceSub}>
          Continue com as aulas e simulados para aumentar suas chances!
        </Text>
      </View>

      {/* Theory & Practice */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Teoria e prática</Text>
        <View style={[styles.tpCard, shadow.sm]}>
          <View style={styles.tpRow}>
            <View style={styles.tpIcon}>
              <Text style={styles.tpIconText}>📚</Text>
            </View>
            <View style={styles.tpInfo}>
              <Text style={styles.tpLabel}>Teoria (simulados)</Text>
              <ProgressBar value={p.theoryProgress} max={100} />
            </View>
            <Text style={styles.tpPct}>{p.theoryProgress}%</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.tpRow}>
            <View style={[styles.tpIcon, { backgroundColor: colors.successLight }]}>
              <Text style={styles.tpIconText}>🚗</Text>
            </View>
            <View style={styles.tpInfo}>
              <Text style={styles.tpLabel}>Prática ({p.practicalHours}h/{p.requiredPracticalHours}h)</Text>
              <ProgressBar value={p.practicalHours} max={p.requiredPracticalHours} color={colors.success} />
            </View>
            <Text style={[styles.tpPct, { color: colors.success }]}>
              {p.practicalHours}h
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estatísticas</Text>
        <View style={styles.statsGrid}>
          {[
            { emoji: '📝', label: 'Simulados', value: `${p.simuladoScore}/${p.simuladoTotal}`, sub: 'última pontuação' },
            { emoji: '✅', label: 'Aulas feitas', value: `${completed}`, sub: `de ${myLessons.length} no total` },
            { emoji: '⏱️', label: 'Horas práticas', value: `${p.practicalHours}h`, sub: `faltam ${p.requiredPracticalHours - p.practicalHours}h` },
            { emoji: '📅', label: 'Próxima aula', value: p.nextLessonDate, sub: `às ${p.nextLessonTime}` },
          ].map((s, i) => (
            <View key={i} style={[styles.statCard, shadow.sm]}>
              <Text style={styles.statEmoji}>{s.emoji}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statSub}>{s.sub}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Milestones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Marcos da jornada</Text>
        <View style={[styles.milestonesCard, shadow.sm]}>
          {milestones.map((m, i) => (
            <View key={i} style={styles.milestone}>
              <View style={[styles.milestoneDot, m.done && styles.milestoneDotDone]}>
                {m.done && <Text style={styles.milestoneDotText}>✓</Text>}
              </View>
              {i < milestones.length - 1 && (
                <View style={[styles.milestoneLine, m.done && styles.milestoneLineDone]} />
              )}
              <Text style={[styles.milestoneLabel, !m.done && styles.milestoneLabelPending]}>
                {m.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Next Lesson Banner */}
      <View style={[styles.nextBanner, shadow.sm]}>
        <Text style={styles.nextBannerTitle}>Próxima aula agendada</Text>
        <Text style={styles.nextBannerDetails}>
          {p.nextLessonDate} às {p.nextLessonTime} · {p.nextInstructor}
        </Text>
        <Text style={styles.nextBannerMeta}>Categoria B · Confirmado ✓</Text>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 56,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  chanceCard: {
    margin: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  chanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chanceTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  chanceValue: { fontSize: 28, fontWeight: '800', color: colors.success },
  barTrackLg: { height: 10, backgroundColor: colors.borderLight, borderRadius: 5 },
  barFillLg: { height: 10, borderRadius: 5 },
  chanceSub: { fontSize: 12, color: colors.textSecondary },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  tpCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.md,
  },
  tpRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  tpIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tpIconText: { fontSize: 22 },
  tpInfo: { flex: 1 },
  tpLabel: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  tpPct: { fontSize: 16, fontWeight: '700', color: colors.primary },
  barTrack: { height: 6, backgroundColor: colors.borderLight, borderRadius: 3 },
  barFill: { height: 6, borderRadius: 3 },
  barLabel: { fontSize: 10, color: colors.textLight, marginTop: 2 },
  separator: { height: 1, backgroundColor: colors.borderLight },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  statCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 2,
  },
  statEmoji: { fontSize: 24, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 12, fontWeight: '600', color: colors.text },
  statSub: { fontSize: 11, color: colors.textSecondary },
  milestonesCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  milestone: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    position: 'relative',
  },
  milestoneDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    zIndex: 1,
  },
  milestoneDotDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  milestoneDotText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  milestoneLine: {
    position: 'absolute',
    left: 11,
    top: 24,
    width: 2,
    height: 28,
    backgroundColor: colors.border,
  },
  milestoneLineDone: { backgroundColor: colors.success },
  milestoneLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    paddingBottom: 20,
  },
  milestoneLabelPending: { color: colors.textSecondary },
  nextBanner: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: 4,
  },
  nextBannerTitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  nextBannerDetails: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  nextBannerMeta: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
});
