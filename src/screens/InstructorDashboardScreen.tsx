import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import { CalendarIcon, DollarSignIcon, UserIcon, CheckCircleIcon, ChevronRightIcon, TrendingUpIcon } from '../components/Icons';

interface Props {
  onNavigate: (screen: string, params?: any) => void;
  user?: { name: string; email: string } | null;
}

const upcomingLessons = [
  { id: '1', student: 'Ana Paula Souza', date: '20/06/2026', time: '09:00', category: 'B', status: 'confirmed' },
  { id: '2', student: 'Bruno Ferreira', date: '20/06/2026', time: '11:00', category: 'B', status: 'confirmed' },
  { id: '3', student: 'Camila Rocha', date: '21/06/2026', time: '08:00', category: 'A', status: 'pending' },
  { id: '4', student: 'Diego Lima', date: '22/06/2026', time: '14:00', category: 'B', status: 'confirmed' },
];

const monthStats = {
  lessons: 24,
  earnings: 2880,
  students: 12,
  rating: 4.9,
  pending: 3,
};

export default function InstructorDashboardScreen({ onNavigate, user }: Props) {
  const firstName = user?.name?.split(' ')[0] ?? 'Instrutor';
  const initials = user?.name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() ?? 'IN';

  const confirmed = upcomingLessons.filter((l) => l.status === 'confirmed').length;
  const pending = upcomingLessons.filter((l) => l.status === 'pending').length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {firstName} 👋</Text>
          <Text style={styles.subGreeting}>Aqui está seu resumo de hoje</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      </View>

      {/* Month Summary Card */}
      <View style={[styles.summaryCard, shadow.md]}>
        <Text style={styles.summaryTitle}>Resumo de Junho</Text>
        <View style={styles.summaryGrid}>
          {[
            { icon: CalendarIcon, value: `${monthStats.lessons}`, label: 'Aulas', color: colors.secondary },
            { icon: DollarSignIcon, value: `R$${monthStats.earnings.toLocaleString('pt-BR')}`, label: 'Ganhos', color: colors.success },
            { icon: UserIcon, value: `${monthStats.students}`, label: 'Alunos', color: '#7C3AED' },
            { icon: TrendingUpIcon, value: `${monthStats.rating}★`, label: 'Avaliação', color: '#F59E0B' },
          ].map((s, i) => (
            <View key={i} style={styles.summaryItem}>
              <View style={[styles.summaryIconWrap, { backgroundColor: s.color + '15' }]}>
                <s.icon size={20} color={s.color} />
              </View>
              <Text style={styles.summaryValue}>{s.value}</Text>
              <Text style={styles.summaryLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Earnings bar */}
        <View style={styles.earningsRow}>
          <View style={styles.earningsBar}>
            <View style={[styles.earningsFill, { width: '72%' }]} />
          </View>
          <Text style={styles.earningsTarget}>72% da meta (R$4.000)</Text>
        </View>
      </View>

      {/* Agenda Preview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximas aulas</Text>
          <TouchableOpacity onPress={() => onNavigate('InstructorAgenda')} style={styles.seeAllBtn}>
            <Text style={styles.seeAll}>Ver tudo</Text>
            <ChevronRightIcon size={14} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statusRow}>
          <View style={styles.statusChip}>
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
            <Text style={styles.statusChipText}>{confirmed} confirmadas</Text>
          </View>
          {pending > 0 && (
            <View style={[styles.statusChip, { backgroundColor: colors.warningLight }]}>
              <View style={[styles.statusDot, { backgroundColor: colors.warning }]} />
              <Text style={[styles.statusChipText, { color: colors.warning }]}>{pending} aguardando</Text>
            </View>
          )}
        </View>

        {upcomingLessons.slice(0, 3).map((lesson) => (
          <TouchableOpacity key={lesson.id} style={[styles.lessonCard, shadow.sm]} activeOpacity={0.8}>
            <View style={[styles.lessonDateBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.lessonDateDay}>{lesson.date.split('/')[0]}</Text>
              <Text style={styles.lessonDateMonth}>
                {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][
                  parseInt(lesson.date.split('/')[1]) - 1
                ]}
              </Text>
            </View>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonStudent}>{lesson.student}</Text>
              <Text style={styles.lessonMeta}>Cat. {lesson.category} · {lesson.time}</Text>
            </View>
            <View style={[
              styles.lessonStatus,
              { backgroundColor: lesson.status === 'confirmed' ? colors.successLight : colors.warningLight },
            ]}>
              <Text style={[
                styles.lessonStatusText,
                { color: lesson.status === 'confirmed' ? colors.success : colors.warning },
              ]}>
                {lesson.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações rápidas</Text>
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={[styles.quickBtn, shadow.sm]}
            onPress={() => onNavigate('InstructorAgenda')}
            activeOpacity={0.8}
          >
            <CalendarIcon size={22} color={colors.secondary} />
            <Text style={styles.quickBtnText}>Minha agenda</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickBtn, shadow.sm]}
            onPress={() => onNavigate('InstructorPerfil')}
            activeOpacity={0.8}
          >
            <UserIcon size={22} color={colors.secondary} />
            <Text style={styles.quickBtnText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary, paddingTop: 56, paddingBottom: 36,
    paddingHorizontal: spacing.lg, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },
  greeting: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  subGreeting: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  summaryCard: {
    margin: spacing.lg, marginTop: -20,
    backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg,
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  summaryGrid: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  summaryItem: { flex: 1, alignItems: 'center', gap: 4 },
  summaryIconWrap: {
    width: 40, height: 40, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center', marginBottom: 2,
  },
  summaryValue: { fontSize: 18, fontWeight: '800', color: colors.text },
  summaryLabel: { fontSize: 10, color: colors.textSecondary },
  earningsRow: { gap: 6 },
  earningsBar: {
    height: 6, backgroundColor: colors.borderLight, borderRadius: 3, overflow: 'hidden',
  },
  earningsFill: { height: 6, backgroundColor: colors.success, borderRadius: 3 },
  earningsTarget: { fontSize: 11, color: colors.textSecondary },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAll: { fontSize: 13, color: colors.secondary, fontWeight: '600' },
  statusRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  statusChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.successLight, paddingHorizontal: 10,
    paddingVertical: 5, borderRadius: radius.full,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusChipText: { fontSize: 12, fontWeight: '600', color: colors.success },
  lessonCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, flexDirection: 'row',
    alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm,
  },
  lessonDateBadge: {
    width: 44, height: 48, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  lessonDateDay: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  lessonDateMonth: { fontSize: 10, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase' },
  lessonInfo: { flex: 1 },
  lessonStudent: { fontSize: 14, fontWeight: '600', color: colors.text },
  lessonMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  lessonStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  lessonStatusText: { fontSize: 11, fontWeight: '600' },
  quickRow: { flexDirection: 'row', gap: spacing.md },
  quickBtn: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, alignItems: 'center', gap: 8,
  },
  quickBtnText: { fontSize: 13, fontWeight: '600', color: colors.text },
});
