import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import { Instructor } from '../data';

interface Props {
  instructor: Instructor;
  onNavigate: (screen: string, params?: any) => void;
  onBack: () => void;
}

const reviews = [
  { name: 'Ana P.', rating: 5, text: 'Excelente instrutor! Muito paciente e claro nas explicações.', date: '10/06/2026' },
  { name: 'Carlos M.', rating: 5, text: 'Passei de primeira graças a ele. Recomendo demais!', date: '02/06/2026' },
  { name: 'Fernanda L.', rating: 4, text: 'Ótimo profissional. Só poderia ter mais horários disponíveis.', date: '25/05/2026' },
];

export default function InstructorProfileScreen({ instructor, onNavigate, onBack }: Props) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil do instrutor</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, shadow.md]}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{instructor.initials}</Text>
          </View>
          <Text style={styles.name}>{instructor.name}</Text>
          <Text style={styles.neighborhood}>📍 {instructor.neighborhood}, Curitiba</Text>

          {instructor.verified && (
            <View style={styles.verifiedRow}>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Instrutor verificado pela CNHora</Text>
              </View>
            </View>
          )}

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>★ {instructor.rating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>{instructor.reviewCount} avaliações</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{instructor.experience} anos</Text>
              <Text style={styles.statLabel}>Experiência</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {instructor.approvalRate}%
              </Text>
              <Text style={styles.statLabel}>Aprovação</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{instructor.totalStudents}</Text>
              <Text style={styles.statLabel}>Alunos</Text>
            </View>
          </View>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o instrutor</Text>
          <View style={[styles.bioCard, shadow.sm]}>
            <Text style={styles.bio}>{instructor.bio}</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <View style={styles.catRow}>
            {instructor.categories.map((cat) => (
              <View key={cat} style={styles.catCard}>
                <Text style={styles.catEmoji}>🚗</Text>
                <Text style={styles.catLabel}>Categoria {cat}</Text>
                <Text style={styles.catSub}>
                  {cat === 'A' ? 'Motocicleta' : cat === 'B' ? 'Carro passeio' : 'Profissional'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Availability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disponibilidade</Text>
          <View style={[styles.availCard, shadow.sm]}>
            {instructor.availability.map((a, i) => (
              <View key={i} style={styles.availRow}>
                <Text style={styles.availIcon}>📅</Text>
                <Text style={styles.availText}>{a}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Valor da aula</Text>
          <View style={[styles.priceCard, shadow.sm]}>
            <View>
              <Text style={styles.priceValue}>R$ {instructor.pricePerLesson}</Text>
              <Text style={styles.priceSub}>por aula de 50 minutos</Text>
            </View>
            <View style={styles.priceInfo}>
              <Text style={styles.priceInfoText}>💳 Pagamento seguro via app</Text>
              <Text style={styles.priceInfoText}>🔒 Proteção ao consumidor</Text>
              <Text style={styles.priceInfoText}>↩️ Cancelamento com antecedência</Text>
            </View>
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avaliações recentes</Text>
          <View style={{ gap: spacing.sm }}>
            {reviews.map((r, i) => (
              <View key={i} style={[styles.reviewCard, shadow.sm]}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>{r.name[0]}</Text>
                  </View>
                  <View style={styles.reviewInfo}>
                    <Text style={styles.reviewName}>{r.name}</Text>
                    <Text style={styles.reviewDate}>{r.date}</Text>
                  </View>
                  <Text style={styles.reviewStars}>{'★'.repeat(r.rating)}</Text>
                </View>
                <Text style={styles.reviewText}>{r.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerPriceLabel}>Aula a partir de</Text>
          <Text style={styles.footerPriceValue}>R$ {instructor.pricePerLesson}</Text>
        </View>
        <TouchableOpacity
          style={styles.scheduleBtn}
          onPress={() => onNavigate('Schedule', { instructor })}
        >
          <Text style={styles.scheduleBtnText}>Agendar aula</Text>
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
  profileCard: {
    margin: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: { color: '#FFFFFF', fontSize: 28, fontWeight: '700' },
  name: { fontSize: 20, fontWeight: '700', color: colors.text, textAlign: 'center' },
  neighborhood: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  verifiedRow: { marginTop: spacing.sm },
  verifiedBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  verifiedText: { fontSize: 12, color: colors.success, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: '700', color: colors.primary },
  statLabel: { fontSize: 10, color: colors.textSecondary, textAlign: 'center', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.borderLight },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  bioCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  bio: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  catRow: { flexDirection: 'row', gap: spacing.md },
  catCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadow.sm,
  },
  catEmoji: { fontSize: 28, marginBottom: 4 },
  catLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  catSub: { fontSize: 11, color: colors.textSecondary, textAlign: 'center', marginTop: 2 },
  availCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  availRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  availIcon: { fontSize: 16 },
  availText: { fontSize: 14, color: colors.text },
  priceCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  priceValue: { fontSize: 28, fontWeight: '800', color: colors.primary },
  priceSub: { fontSize: 12, color: colors.textSecondary },
  priceInfo: { gap: 4 },
  priceInfoText: { fontSize: 13, color: colors.textSecondary },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarText: { fontWeight: '700', color: colors.primary },
  reviewInfo: { flex: 1 },
  reviewName: { fontSize: 13, fontWeight: '600', color: colors.text },
  reviewDate: { fontSize: 11, color: colors.textLight },
  reviewStars: { fontSize: 12, color: '#F59E0B' },
  reviewText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 32,
  },
  footerPrice: { flex: 1 },
  footerPriceLabel: { fontSize: 11, color: colors.textSecondary },
  footerPriceValue: { fontSize: 22, fontWeight: '800', color: colors.primary },
  scheduleBtn: {
    flex: 2,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  scheduleBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
