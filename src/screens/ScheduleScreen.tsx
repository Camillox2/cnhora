import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import { timeSlots, Instructor } from '../data';

interface Props {
  instructor: Instructor;
  onNavigate: (screen: string, params?: any) => void;
  onBack: () => void;
}

const DAYS = [
  { label: 'Seg', date: '23/06' },
  { label: 'Ter', date: '24/06' },
  { label: 'Qua', date: '25/06' },
  { label: 'Qui', date: '26/06' },
  { label: 'Sex', date: '27/06' },
  { label: 'Sáb', date: '28/06' },
];

export default function ScheduleScreen({ instructor, onNavigate, onBack }: Props) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!selectedSlot) return;
    const slot = timeSlots.find((s) => s.id === selectedSlot);
    onNavigate('BookingConfirm', {
      instructor,
      date: DAYS[selectedDay].date,
      dayLabel: DAYS[selectedDay].label,
      time: slot?.time,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agendar aula</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Instructor mini card */}
        <View style={[styles.instructorCard, shadow.sm]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{instructor.initials}</Text>
          </View>
          <View style={styles.instructorInfo}>
            <Text style={styles.instructorName}>{instructor.name}</Text>
            <Text style={styles.instructorMeta}>
              ★ {instructor.rating} · {instructor.neighborhood} · R$ {instructor.pricePerLesson}/aula
            </Text>
          </View>
        </View>

        {/* Day selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Escolha o dia</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.daysRow}>
              {DAYS.map((day, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.dayBtn, selectedDay === i && styles.dayBtnActive]}
                  onPress={() => {
                    setSelectedDay(i);
                    setSelectedSlot(null);
                  }}
                >
                  <Text style={[styles.dayLabel, selectedDay === i && styles.dayLabelActive]}>
                    {day.label}
                  </Text>
                  <Text style={[styles.dayDate, selectedDay === i && styles.dayDateActive]}>
                    {day.date}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Time slots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horários disponíveis</Text>
          <View style={styles.slotsGrid}>
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.slotBtn,
                  !slot.available && styles.slotBtnUnavailable,
                  selectedSlot === slot.id && styles.slotBtnSelected,
                ]}
                onPress={() => slot.available && setSelectedSlot(slot.id)}
                disabled={!slot.available}
              >
                <Text
                  style={[
                    styles.slotTime,
                    !slot.available && styles.slotTimeUnavailable,
                    selectedSlot === slot.id && styles.slotTimeSelected,
                  ]}
                >
                  {slot.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
              <Text style={styles.legendText}>Disponível</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.border }]} />
              <Text style={styles.legendText}>Ocupado</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendText}>Selecionado</Text>
            </View>
          </View>
        </View>

        {/* Summary */}
        {selectedSlot && (
          <View style={[styles.summaryCard, shadow.sm]}>
            <Text style={styles.summaryTitle}>Resumo do agendamento</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Data</Text>
              <Text style={styles.summaryValue}>
                {DAYS[selectedDay].label}, {DAYS[selectedDay].date}/2026
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Horário</Text>
              <Text style={styles.summaryValue}>
                {timeSlots.find((s) => s.id === selectedSlot)?.time}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Instrutor</Text>
              <Text style={styles.summaryValue}>{instructor.name.split(' ')[0]}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Categoria</Text>
              <Text style={styles.summaryValue}>B — Carro passeio</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryRowTotal]}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>R$ {instructor.pricePerLesson},00</Text>
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmBtn, !selectedSlot && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={!selectedSlot}
        >
          <Text style={styles.confirmBtnText}>
            {selectedSlot ? `Confirmar agendamento · R$ ${instructor.pricePerLesson}` : 'Selecione um horário'}
          </Text>
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
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon: { color: '#FFFFFF', fontSize: 20, fontWeight: '600' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  instructorCard: {
    margin: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  instructorInfo: { flex: 1 },
  instructorName: { fontSize: 15, fontWeight: '700', color: colors.text },
  instructorMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  daysRow: { flexDirection: 'row', gap: spacing.sm },
  dayBtn: {
    width: 60,
    paddingVertical: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  dayBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  dayLabelActive: { color: '#FFFFFF' },
  dayDate: { fontSize: 11, color: colors.textLight, marginTop: 2 },
  dayDateActive: { color: 'rgba(255,255,255,0.7)' },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  slotBtn: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.success,
    alignItems: 'center',
    backgroundColor: colors.successLight,
  },
  slotBtnUnavailable: {
    borderColor: colors.border,
    backgroundColor: colors.borderLight,
  },
  slotBtnSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  slotTime: { fontSize: 14, fontWeight: '600', color: colors.success },
  slotTimeUnavailable: { color: colors.textLight },
  slotTimeSelected: { color: '#FFFFFF' },
  legend: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: colors.textSecondary },
  summaryCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  summaryTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 13, color: colors.textSecondary },
  summaryValue: { fontSize: 13, fontWeight: '500', color: colors.text },
  summaryRowTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.sm,
    marginTop: 4,
  },
  summaryTotalLabel: { fontSize: 15, fontWeight: '700', color: colors.text },
  summaryTotalValue: { fontSize: 18, fontWeight: '800', color: colors.primary },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  confirmBtnDisabled: { backgroundColor: colors.textLight },
  confirmBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
