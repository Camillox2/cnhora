import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, UserIcon } from '../components/Icons';

interface Props {
  onNavigate: (screen: string, params?: any) => void;
}

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

// Mock weekly lessons
const mockLessons: Record<string, { time: string; student: string; category: string; status: 'confirmed' | 'pending' | 'cancelled' }[]> = {
  '2026-06-20': [
    { time: '08:00', student: 'Ana Paula Souza', category: 'B', status: 'confirmed' },
    { time: '10:00', student: 'Bruno Ferreira', category: 'B', status: 'confirmed' },
    { time: '14:00', student: 'Camila Rocha', category: 'A', status: 'pending' },
  ],
  '2026-06-21': [
    { time: '09:00', student: 'Diego Lima', category: 'B', status: 'confirmed' },
  ],
  '2026-06-23': [
    { time: '08:00', student: 'Elisa Martins', category: 'B', status: 'confirmed' },
    { time: '11:00', student: 'Felipe Nunes', category: 'B', status: 'confirmed' },
    { time: '16:00', student: 'Gabriela Ramos', category: 'A', status: 'pending' },
  ],
  '2026-06-25': [
    { time: '10:00', student: 'Hugo Castro', category: 'B', status: 'confirmed' },
    { time: '14:00', student: 'Isabela Torres', category: 'B', status: 'confirmed' },
  ],
  '2026-06-26': [
    { time: '09:00', student: 'João Pedro', category: 'B', status: 'cancelled' },
    { time: '15:00', student: 'Karla Santos', category: 'B', status: 'confirmed' },
  ],
};

function getWeekDays(baseDate: Date) {
  const day = baseDate.getDay();
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function toKey(date: Date) {
  return date.toISOString().split('T')[0];
}

export default function InstructorAgendaScreen({ onNavigate }: Props) {
  const [currentWeekBase, setCurrentWeekBase] = useState(new Date(2026, 5, 19)); // June 19, 2026
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 5, 20));

  const weekDays = getWeekDays(currentWeekBase);
  const selectedKey = toKey(selectedDate);
  const lessonsForDay = mockLessons[selectedKey] ?? [];

  const prevWeek = () => {
    const d = new Date(currentWeekBase);
    d.setDate(d.getDate() - 7);
    setCurrentWeekBase(d);
  };
  const nextWeek = () => {
    const d = new Date(currentWeekBase);
    d.setDate(d.getDate() + 7);
    setCurrentWeekBase(d);
  };

  const totalWeekLessons = weekDays.reduce((acc, d) => acc + (mockLessons[toKey(d)]?.length ?? 0), 0);
  const totalWeekEarnings = weekDays.reduce((acc, d) => {
    const lessons = mockLessons[toKey(d)] ?? [];
    return acc + lessons.filter(l => l.status === 'confirmed').length * 120;
  }, 0);

  const statusColors: Record<string, string> = {
    confirmed: colors.success,
    pending: colors.warning,
    cancelled: colors.error,
  };
  const statusLabels: Record<string, string> = {
    confirmed: 'Confirmada',
    pending: 'Aguardando',
    cancelled: 'Cancelada',
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <CalendarIcon size={22} color="#FFFFFF" />
        <Text style={styles.headerTitle}>Minha Agenda</Text>
      </View>

      {/* Week summary */}
      <View style={[styles.weekSummary, shadow.sm]}>
        <View style={styles.weekSummaryItem}>
          <Text style={styles.weekSummaryValue}>{totalWeekLessons}</Text>
          <Text style={styles.weekSummaryLabel}>Aulas esta semana</Text>
        </View>
        <View style={styles.weekSummaryDiv} />
        <View style={styles.weekSummaryItem}>
          <Text style={[styles.weekSummaryValue, { color: colors.success }]}>
            R${totalWeekEarnings.toLocaleString('pt-BR')}
          </Text>
          <Text style={styles.weekSummaryLabel}>Ganhos previstos</Text>
        </View>
      </View>

      {/* Week Calendar */}
      <View style={[styles.calendarCard, shadow.sm]}>
        <View style={styles.calendarNav}>
          <TouchableOpacity onPress={prevWeek} style={styles.navBtn}>
            <ChevronLeftIcon size={20} />
          </TouchableOpacity>
          <Text style={styles.calendarMonth}>
            {MONTHS[weekDays[3].getMonth()]} {weekDays[3].getFullYear()}
          </Text>
          <TouchableOpacity onPress={nextWeek} style={styles.navBtn}>
            <ChevronRightIcon size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.weekRow}>
          {weekDays.map((day, i) => {
            const isSelected = toKey(day) === selectedKey;
            const hasLessons = !!(mockLessons[toKey(day)]?.length);
            return (
              <TouchableOpacity
                key={i}
                style={[styles.dayCell, isSelected && styles.dayCellActive]}
                onPress={() => setSelectedDate(day)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dayName, isSelected && styles.dayNameActive]}>
                  {DAYS[day.getDay()]}
                </Text>
                <Text style={[styles.dayNum, isSelected && styles.dayNumActive]}>
                  {day.getDate()}
                </Text>
                {hasLessons && (
                  <View style={[styles.lessonDot, isSelected && { backgroundColor: '#FFFFFF' }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Day Lessons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {DAYS[selectedDate.getDay()]}, {selectedDate.getDate()} de {MONTHS[selectedDate.getMonth()]}
        </Text>

        {lessonsForDay.length === 0 ? (
          <View style={[styles.emptyDay, shadow.sm]}>
            <CalendarIcon size={32} color={colors.textLight} />
            <Text style={styles.emptyText}>Nenhuma aula neste dia</Text>
            <Text style={styles.emptySubtext}>Seu dia está livre!</Text>
          </View>
        ) : (
          lessonsForDay.map((lesson, i) => (
            <View key={i} style={[styles.lessonItem, shadow.sm]}>
              <View style={[styles.timeBar, { backgroundColor: statusColors[lesson.status] }]} />
              <View style={styles.lessonTime}>
                <Text style={styles.timeText}>{lesson.time}</Text>
              </View>
              <View style={styles.lessonDetails}>
                <Text style={styles.lessonStudent}>{lesson.student}</Text>
                <Text style={styles.lessonCategory}>Cat. {lesson.category}</Text>
              </View>
              <View style={[styles.statusPill, { backgroundColor: statusColors[lesson.status] + '20' }]}>
                <Text style={[styles.statusText, { color: statusColors[lesson.status] }]}>
                  {statusLabels[lesson.status]}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary, paddingTop: 56, paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  weekSummary: {
    margin: spacing.lg, marginTop: -12, backgroundColor: colors.surface,
    borderRadius: radius.xl, padding: spacing.lg, flexDirection: 'row',
  },
  weekSummaryItem: { flex: 1, alignItems: 'center' },
  weekSummaryDiv: { width: 1, backgroundColor: colors.borderLight },
  weekSummaryValue: { fontSize: 24, fontWeight: '800', color: colors.primary },
  weekSummaryLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  calendarCard: {
    marginHorizontal: spacing.lg, marginBottom: spacing.lg,
    backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.md,
  },
  calendarNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md,
  },
  navBtn: { padding: spacing.sm },
  calendarMonth: { fontSize: 15, fontWeight: '700', color: colors.text },
  weekRow: { flexDirection: 'row' },
  dayCell: {
    flex: 1, alignItems: 'center', paddingVertical: spacing.sm,
    borderRadius: radius.md, gap: 2,
  },
  dayCellActive: { backgroundColor: colors.primary },
  dayName: { fontSize: 10, color: colors.textSecondary, fontWeight: '500', textTransform: 'uppercase' },
  dayNameActive: { color: 'rgba(255,255,255,0.8)' },
  dayNum: { fontSize: 16, fontWeight: '700', color: colors.text },
  dayNumActive: { color: '#FFFFFF' },
  lessonDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.secondary },
  section: { paddingHorizontal: spacing.lg },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  emptyDay: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    padding: spacing.xl, alignItems: 'center', gap: spacing.sm,
  },
  emptyText: { fontSize: 15, fontWeight: '600', color: colors.text },
  emptySubtext: { fontSize: 13, color: colors.textSecondary },
  lessonItem: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  timeBar: { width: 4, alignSelf: 'stretch' },
  lessonTime: { paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  timeText: { fontSize: 15, fontWeight: '700', color: colors.text },
  lessonDetails: { flex: 1, paddingVertical: spacing.md },
  lessonStudent: { fontSize: 14, fontWeight: '600', color: colors.text },
  lessonCategory: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  statusPill: { marginRight: spacing.md, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  statusText: { fontSize: 11, fontWeight: '700' },
});
