import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius, shadow } from '../theme';
import { UserIcon, LogOutIcon, ShieldCheckIcon, ClockIcon, DollarSignIcon, ChevronRightIcon } from '../components/Icons';

interface Props {
  onNavigate: (screen: string, params?: any) => void;
  onLogout: () => void;
  user?: { name: string; email: string } | null;
}

const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export default function InstructorProfileEditScreen({ onNavigate, onLogout, user }: Props) {
  const [bio, setBio] = useState(
    'Instrutor certificado, especializado em condução defensiva e segurança no trânsito. Metodologia clara e empática para alunos de todos os níveis.'
  );
  const [price, setPrice] = useState('120');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Seg', 'Ter', 'Qua', 'Qui', 'Sex']);
  const [notifications, setNotifications] = useState(true);
  const [editing, setEditing] = useState(false);

  const initials = user?.name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() ?? 'IN';

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    Alert.alert('Perfil atualizado!', 'Suas informações foram salvas com sucesso.');
    setEditing(false);
  };

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: onLogout },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarLg}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user?.name ?? 'Instrutor CNHora'}</Text>
        {user?.email && <Text style={styles.email}>{user.email}</Text>}
        <View style={styles.verifiedBadge}>
          <ShieldCheckIcon size={14} color={colors.success} />
          <Text style={styles.verifiedText}>Perfil verificado</Text>
        </View>
        <TouchableOpacity
          style={styles.editPhotoBtn}
          onPress={() => Alert.alert('Em breve', 'Upload de foto em desenvolvimento.')}
        >
          <Text style={styles.editPhotoBtnText}>Alterar foto</Text>
        </TouchableOpacity>
      </View>

      {/* Bio */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Apresentação</Text>
          <TouchableOpacity onPress={() => setEditing(!editing)}>
            <Text style={styles.editLink}>{editing ? 'Cancelar' : 'Editar'}</Text>
          </TouchableOpacity>
        </View>
        {editing ? (
          <View>
            <TextInput
              style={[styles.bioInput, shadow.sm]}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              placeholder="Descreva sua experiência..."
              placeholderTextColor={colors.textLight}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Salvar alterações</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.bioCard, shadow.sm]}>
            <Text style={styles.bioText}>{bio}</Text>
          </View>
        )}
      </View>

      {/* Price */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Valor por aula</Text>
        <View style={[styles.priceCard, shadow.sm]}>
          <DollarSignIcon size={20} color={colors.success} />
          <Text style={styles.pricePrefix}>R$</Text>
          <TextInput
            style={styles.priceInput}
            value={price}
            onChangeText={(v) => setPrice(v.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            maxLength={4}
          />
          <Text style={styles.priceSuffix}>por aula</Text>
        </View>
        <Text style={styles.priceHint}>
          Média na plataforma: R$110. Instrutores com preço entre R$90-R$130 têm mais agendamentos.
        </Text>
      </View>

      {/* Availability */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dias disponíveis</Text>
        <View style={[styles.daysCard, shadow.sm]}>
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day}
              style={[styles.dayChip, selectedDays.includes(day) && styles.dayChipActive]}
              onPress={() => toggleDay(day)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayChipText, selectedDays.includes(day) && styles.dayChipTextActive]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        <View style={[styles.menuGroup, shadow.sm]}>
          <View style={styles.menuItem}>
            <Text style={styles.menuLabel}>Notificações de agendamento</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ true: colors.secondary }}
            />
          </View>
          <View style={styles.menuSep} />
          <TouchableOpacity style={styles.menuItem} onPress={() => {}} activeOpacity={0.7}>
            <Text style={styles.menuLabel}>Política de cancelamento</Text>
            <ChevronRightIcon />
          </TouchableOpacity>
          <View style={styles.menuSep} />
          <TouchableOpacity style={styles.menuItem} onPress={() => {}} activeOpacity={0.7}>
            <Text style={styles.menuLabel}>Dados bancários (pagamentos)</Text>
            <ChevronRightIcon />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <TouchableOpacity style={[styles.logoutBtn, shadow.sm]} onPress={handleLogout} activeOpacity={0.8}>
          <LogOutIcon color={colors.error} size={20} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary, paddingTop: 56, paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg, alignItems: 'center', gap: spacing.sm,
  },
  avatarLg: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 30, fontWeight: '700', color: '#FFFFFF' },
  name: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginTop: 4 },
  email: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(34,197,94,0.2)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full,
  },
  verifiedText: { fontSize: 12, color: colors.success, fontWeight: '600' },
  editPhotoBtn: {
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: radius.full,
  },
  editPhotoBtnText: { fontSize: 12, color: '#FFFFFF', fontWeight: '600' },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  editLink: { fontSize: 13, color: colors.secondary, fontWeight: '600' },
  bioCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md,
  },
  bioText: { fontSize: 14, color: colors.text, lineHeight: 22 },
  bioInput: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md,
    fontSize: 14, color: colors.text, lineHeight: 22, minHeight: 100,
    borderWidth: 1.5, borderColor: colors.secondary,
  },
  saveBtn: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: 12, alignItems: 'center', marginTop: spacing.md,
  },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  priceCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
  },
  pricePrefix: { fontSize: 20, fontWeight: '700', color: colors.text },
  priceInput: {
    flex: 1, fontSize: 28, fontWeight: '800', color: colors.primary,
    padding: 0,
  },
  priceSuffix: { fontSize: 14, color: colors.textSecondary },
  priceHint: { fontSize: 12, color: colors.textSecondary, marginTop: 6, lineHeight: 18 },
  daysCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm,
  },
  dayChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full,
    borderWidth: 1.5, borderColor: colors.border,
  },
  dayChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayChipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  dayChipTextActive: { color: '#FFFFFF' },
  menuGroup: { backgroundColor: colors.surface, borderRadius: radius.xl, overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: 16,
  },
  menuLabel: { flex: 1, fontSize: 14, color: colors.text, fontWeight: '500' },
  menuSep: { height: 1, backgroundColor: colors.borderLight, marginLeft: spacing.md },
  logoutBtn: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: colors.error },
});
