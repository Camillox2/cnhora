import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import { studentProgress } from '../data';
import { LogOutIcon, ShieldCheckIcon, ChevronRightIcon, UserIcon } from '../components/Icons';

interface Props {
  onNavigate: (screen: string, params?: any) => void;
  onLogout: () => void;
  user?: { name: string; email: string; role: string } | null;
}

function MenuItem({
  label, value, onPress, isSwitch, switchValue, onSwitchChange, danger, leftColor,
}: {
  label: string; value?: string; onPress?: () => void;
  isSwitch?: boolean; switchValue?: boolean; onSwitchChange?: (v: boolean) => void;
  danger?: boolean; leftColor?: string;
}) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      disabled={isSwitch || !onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
      {isSwitch ? (
        <Switch value={switchValue} onValueChange={onSwitchChange} trackColor={{ true: colors.secondary }} />
      ) : (
        <>
          {value && <Text style={styles.menuValue}>{value}</Text>}
          {onPress && !danger && <ChevronRightIcon />}
          {danger && <LogOutIcon size={18} color={colors.error} />}
        </>
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ onNavigate, onLogout, user }: Props) {
  const [notifications, setNotifications] = useState(true);
  const [reminderBefore, setReminderBefore] = useState(true);
  const p = studentProgress;

  const displayName = user?.name ?? p.name;
  const initials = displayName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

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
        <Text style={styles.name}>{displayName}</Text>
        {user?.email && <Text style={styles.email}>{user.email}</Text>}
        <Text style={styles.category}>
          {user?.role === 'instructor' ? 'Instrutor de autoescola' : 'Habilitação Categoria B'}
        </Text>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <ShieldCheckIcon size={12} color={colors.success} />
            <Text style={styles.badgeText}>Conta verificada</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={[styles.statsCard, shadow.sm]}>
        {[
          { value: `${p.lessonsCompleted}`, label: 'Aulas feitas' },
          { value: `${p.theoryProgress}%`, label: 'Teoria' },
          { value: `${p.practicalHours}h`, label: 'Prática' },
        ].map((s, i) => (
          <React.Fragment key={i}>
            {i > 0 && <View style={styles.statDiv} />}
            <View style={styles.stat}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Minha conta</Text>
        <View style={[styles.menuGroup, shadow.sm]}>
          <MenuItem label="Dados pessoais" onPress={() => {}} />
          <View style={styles.menuSep} />
          <MenuItem label="Alterar senha" onPress={() => {}} />
          <View style={styles.menuSep} />
          <MenuItem label="WhatsApp vinculado" value="(41) 99999-0000" onPress={() => {}} />
          <View style={styles.menuSep} />
          <MenuItem label="Categoria" value="B — Carro" onPress={() => {}} />
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificações</Text>
        <View style={[styles.menuGroup, shadow.sm]}>
          <MenuItem label="Notificações de aula" isSwitch switchValue={notifications} onSwitchChange={setNotifications} />
          <View style={styles.menuSep} />
          <MenuItem label="Lembrete 1h antes" isSwitch switchValue={reminderBefore} onSwitchChange={setReminderBefore} />
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre</Text>
        <View style={[styles.menuGroup, shadow.sm]}>
          <MenuItem label="Termos de uso" onPress={() => {}} />
          <View style={styles.menuSep} />
          <MenuItem label="Política de privacidade" onPress={() => {}} />
          <View style={styles.menuSep} />
          <MenuItem label="Suporte" onPress={() => {}} />
          <View style={styles.menuSep} />
          <MenuItem label="Versão do app" value="1.0.0" />
        </View>
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <View style={[styles.menuGroup, shadow.sm]}>
          <MenuItem label="Sair da conta" onPress={handleLogout} danger />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>CNHora © 2026 · Curitiba/PR</Text>
        <Text style={styles.footerText}>contato@cnhora.com.br</Text>
      </View>
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
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  avatarText: { fontSize: 30, fontWeight: '700', color: '#FFFFFF' },
  name: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  email: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  category: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  badges: { flexDirection: 'row', gap: spacing.sm, marginTop: 4 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full,
  },
  badgeText: { fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: '500' },
  statsCard: {
    margin: spacing.lg, backgroundColor: colors.surface,
    borderRadius: radius.xl, padding: spacing.md, flexDirection: 'row',
  },
  stat: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm },
  statDiv: { width: 1, backgroundColor: colors.borderLight },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: colors.textSecondary,
    marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 1,
  },
  menuGroup: { backgroundColor: colors.surface, borderRadius: radius.xl, overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: 16, gap: spacing.md,
  },
  menuLabel: { flex: 1, fontSize: 14, color: colors.text, fontWeight: '500' },
  menuLabelDanger: { color: colors.error },
  menuValue: { fontSize: 13, color: colors.textSecondary },
  menuSep: { height: 1, backgroundColor: colors.borderLight, marginLeft: spacing.md },
  footer: { alignItems: 'center', paddingVertical: spacing.xl, gap: 4 },
  footerText: { fontSize: 12, color: colors.textLight },
});
