import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import { myLessons, Lesson } from '../data';

interface Props {
  onNavigate: (screen: string, params?: any) => void;
}

type Filter = 'all' | 'scheduled' | 'completed' | 'cancelled';

const statusConfig = {
  scheduled: { label: 'Agendada', color: colors.secondary, bg: colors.secondary + '15', emoji: '📅' },
  completed: { label: 'Concluída', color: colors.success, bg: colors.successLight, emoji: '✅' },
  cancelled: { label: 'Cancelada', color: colors.error, bg: colors.errorLight, emoji: '❌' },
};

function LessonCard({ lesson }: { lesson: Lesson }) {
  const status = statusConfig[lesson.status];
  const [date, month, year] = lesson.date.split('-').reverse();

  return (
    <View style={[styles.card, shadow.sm]}>
      <View style={styles.cardLeft}>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.emoji} {status.label}</Text>
        </View>
        <Text style={styles.lessonTitle}>Categoria {lesson.category} · {lesson.neighborhood}</Text>
        <Text style={styles.instructorName}>{lesson.instructorName}</Text>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>📅 {date}/{month}/{year} às {lesson.time}</Text>
        </View>
      </View>
    </View>
  );
}

export default function MinhasAulasScreen({ onNavigate }: Props) {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = filter === 'all' ? myLessons : myLessons.filter((l) => l.status === filter);

  const counts = {
    all: myLessons.length,
    scheduled: myLessons.filter((l) => l.status === 'scheduled').length,
    completed: myLessons.filter((l) => l.status === 'completed').length,
    cancelled: myLessons.filter((l) => l.status === 'cancelled').length,
  };

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: `Todas (${counts.all})` },
    { key: 'scheduled', label: `Agendadas (${counts.scheduled})` },
    { key: 'completed', label: `Concluídas (${counts.completed})` },
    { key: 'cancelled', label: `Canceladas (${counts.cancelled})` },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas aulas</Text>
        <Text style={styles.headerSub}>{myLessons.length} aulas no total</Text>
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryItem, { backgroundColor: colors.secondary + '15' }]}>
          <Text style={[styles.summaryValue, { color: colors.secondary }]}>{counts.scheduled}</Text>
          <Text style={styles.summaryLabel}>Agendadas</Text>
        </View>
        <View style={[styles.summaryItem, { backgroundColor: colors.successLight }]}>
          <Text style={[styles.summaryValue, { color: colors.success }]}>{counts.completed}</Text>
          <Text style={styles.summaryLabel}>Concluídas</Text>
        </View>
        <View style={[styles.summaryItem, { backgroundColor: colors.errorLight }]}>
          <Text style={[styles.summaryValue, { color: colors.error }]}>{counts.cancelled}</Text>
          <Text style={styles.summaryLabel}>Canceladas</Text>
        </View>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
      >
        <View style={styles.filterGroup}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
              onPress={() => setFilter(f.key)}
            >
              <Text
                style={[styles.filterText, filter === f.key && styles.filterTextActive]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyText}>Nenhuma aula encontrada</Text>
          </View>
        }
        renderItem={({ item }) => <LessonCard lesson={item} />}
      />

      {/* Book New */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => onNavigate('Buscar')}
        >
          <Text style={styles.bookBtnText}>+ Agendar nova aula</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  summaryRow: {
    flexDirection: 'row',
    margin: spacing.lg,
    gap: spacing.sm,
  },
  summaryItem: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  summaryValue: { fontSize: 24, fontWeight: '800' },
  summaryLabel: { fontSize: 11, color: colors.textSecondary },
  filterRow: { paddingLeft: spacing.lg, marginBottom: spacing.sm },
  filterGroup: { flexDirection: 'row', gap: spacing.sm, paddingRight: spacing.lg },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  filterTextActive: { color: '#FFFFFF' },
  list: { padding: spacing.lg, gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  cardLeft: { gap: 4 },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginBottom: 4,
  },
  statusText: { fontSize: 12, fontWeight: '600' },
  lessonTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  instructorName: { fontSize: 13, color: colors.textSecondary },
  timeRow: { marginTop: 4 },
  timeText: { fontSize: 12, color: colors.textSecondary },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { fontSize: 16, fontWeight: '600', color: colors.textSecondary },
  footer: {
    padding: spacing.lg,
    paddingBottom: 32,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bookBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  bookBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
