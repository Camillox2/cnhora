import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import { instructors, Instructor, Category } from '../data';

interface Props {
  onNavigate: (screen: string, params?: any) => void;
}

const neighborhoods = ['Todos', 'Água Verde', 'Batel', 'Centro', 'Portão', 'CIC'];
const categories: Category[] = ['A', 'B', 'C', 'D', 'E'];

function InstructorCard({
  instructor,
  onPress,
}: {
  instructor: Instructor;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.card, shadow.sm]} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{instructor.initials}</Text>
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {instructor.name}
            </Text>
            {instructor.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verificado</Text>
              </View>
            )}
          </View>
          <Text style={styles.neighborhood}>
            📍 {instructor.neighborhood} · {instructor.experience} anos exp.
          </Text>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingStars}>★ {instructor.rating.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({instructor.reviewCount} avaliações)</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.categories}>
          {instructor.categories.map((cat) => (
            <View key={cat} style={styles.catBadge}>
              <Text style={styles.catText}>Cat. {cat}</Text>
            </View>
          ))}
          <View style={styles.approvalBadge}>
            <Text style={styles.approvalText}>{instructor.approvalRate}% aprovação</Text>
          </View>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>por aula</Text>
          <Text style={styles.price}>R$ {instructor.pricePerLesson}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function SearchScreen({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [maxPrice, setMaxPrice] = useState(200);

  const filtered = instructors.filter((i) => {
    const matchSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.neighborhood.toLowerCase().includes(search.toLowerCase());
    const matchNeighborhood =
      selectedNeighborhood === 'Todos' || i.neighborhood === selectedNeighborhood;
    const matchCategory = !selectedCategory || i.categories.includes(selectedCategory);
    const matchPrice = i.pricePerLesson <= maxPrice;
    return matchSearch && matchNeighborhood && matchCategory && matchPrice;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buscar instrutor</Text>
        <Text style={styles.headerSub}>{filtered.length} disponíveis em Curitiba</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Nome ou bairro..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={colors.textLight}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        <View style={styles.filterGroup}>
          {neighborhoods.map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.filterChip, selectedNeighborhood === n && styles.filterChipActive]}
              onPress={() => setSelectedNeighborhood(n)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedNeighborhood === n && styles.filterChipTextActive,
                ]}
              >
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        <View style={styles.filterGroup}>
          <TouchableOpacity
            style={[styles.filterChip, !selectedCategory && styles.filterChipActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.filterChipText, !selectedCategory && styles.filterChipTextActive]}>
              Todas categorias
            </Text>
          </TouchableOpacity>
          {categories.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.filterChip, selectedCategory === c && styles.filterChipActive]}
              onPress={() => setSelectedCategory(c)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedCategory === c && styles.filterChipTextActive,
                ]}
              >
                Cat. {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Results */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>😔</Text>
            <Text style={styles.emptyText}>Nenhum instrutor encontrado</Text>
            <Text style={styles.emptySub}>Tente ajustar os filtros</Text>
          </View>
        }
        renderItem={({ item }) => (
          <InstructorCard
            instructor={item}
            onPress={() => onNavigate('InstructorProfile', { instructor: item })}
          />
        )}
      />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    ...shadow.sm,
  },
  searchIcon: { fontSize: 16, marginRight: spacing.sm },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  clearIcon: { fontSize: 14, color: colors.textLight, padding: 4 },
  filterRow: { paddingLeft: spacing.lg, marginBottom: 4 },
  filterGroup: { flexDirection: 'row', gap: spacing.sm, paddingRight: spacing.lg },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  filterChipTextActive: { color: '#FFFFFF' },
  list: { padding: spacing.lg, gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.md,
  },
  cardHeader: { flexDirection: 'row', gap: spacing.md },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  cardInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  name: { fontSize: 15, fontWeight: '700', color: colors.text, flex: 1 },
  verifiedBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: { fontSize: 10, color: colors.success, fontWeight: '600' },
  neighborhood: { fontSize: 12, color: colors.textSecondary, marginTop: 3 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  ratingStars: { fontSize: 13, color: '#F59E0B', fontWeight: '700' },
  ratingCount: { fontSize: 12, color: colors.textLight },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.sm,
  },
  categories: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
  catBadge: {
    backgroundColor: colors.primary + '12',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  catText: { fontSize: 11, color: colors.primary, fontWeight: '600' },
  approvalBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  approvalText: { fontSize: 11, color: colors.success, fontWeight: '600' },
  priceRow: { alignItems: 'flex-end' },
  priceLabel: { fontSize: 10, color: colors.textLight },
  price: { fontSize: 18, fontWeight: '800', color: colors.primary },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { fontSize: 16, fontWeight: '600', color: colors.text },
  emptySub: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
});
