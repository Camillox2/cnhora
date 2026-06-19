import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import { studentProgress } from '../data';

interface Props {
  onNavigate: (screen: string, params?: any) => void;
  onLogout: () => void;
}

function MenuItem({
  emoji,
  label,
  value,
  onPress,
  isSwitch,
  switchValue,
  onSwitchChange,
  danger,
}: {
  emoji: string;
  label: string;
  value?: string;
  onPress?: () => void;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (v: boolean) => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      disabled={isSwitch || !onPress}
    >
      <Text style={styles.menuEmoji}>{emoji}</Text>
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ true: colors.primary }}
        />
      ) : (
        <>
          {value && <Text style={styles.menuValue}>{value}</Text>}
          {!danger && <Text style={styles.menuArrow}>›</Text>}
        </>
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ onNavigate, onLogout }: Props) {
  const [notifications, setNotifications] = useState(true);
  const [reminderBefore, setReminderBefore] = useState(true);
  const p = studentProgress;

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: onLogout },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarLg}>
          <Text style={styles.avatarText}>VC</Text>
        </View>
        <Text style={styles.name}>{p.name}</Text>
        <Text style={styles.category}>Habilitação Categoria B</Text>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✓ LGPD Aceita</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: 'rgba(34,197,94,0.2)' }]}>
            <Text style={[styles.badgeText, { color: colors.success }]}>🔒 Pagamento seguro</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={[styles.statsCard, shadow.sm]}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{p.lessonsCompleted}</Text>
          <Text style={styles.statLabel}>Aulas feitas</Text>
        </View>
        <View style={styles.statDiv} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{p.theoryProgress}%</Text>
          <Text style={styles.statLabel}>Teoria</Text>
        </View>
        <View style={styles.statDiv} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{p.practicalHours}h</Text>
          <Text style={styles.statLabel}>Prática</Text>
        </View>
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Minha conta</Text>
        <View style={[styles.menuGroup, shadow.sm]}>
          <MenuItem emoji="👤" label="Dados pessoais" onPress={() => {}} />
          <View style={styles.menuSep} />
          <MenuItem emoji="🔒" label="Alterar senha" onPress={() => {}} />
          <View style={styles.menuSep} />
          <MenuItem emoji="📱" label="WhatsApp vinculado" value="(41) 99999-0000" onPress={() => {}} />
          <View style={styles.menuSep} />
          <MenuItem emoji="🎯" label="Categoria" value="B — Carro" onPress={() => {}} />
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificações</Text>
        <View style={[styles.menuGroup, shadow.sm]}>
          <MenuItem
            emoji="🔔"
            label="Notificações de aula"
            isSwitch
            switchValue={notifications}
            onSwitchChange={setNotifications}
          />
          <View style={styles.menuSep} />
          <MenuItem
            emoji="⏰"
            label="Lembrete 1h antes"
            isSwitch
            switchValue={reminderBefore}
            onSwitchChange={setReminderBefore}
          />
        </View>
      </View>

      {/* Sobre */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre</Text>
        <View style={[styles.menuGroup, shadow.sm]}>
          <MenuItem emoji="📄" label="Termos de uso" onPress={() => {}} />
          <View style={styles.menuSep} />
          <MenuItem emoji="🔐" label="Política de privacidade (LGPD)" onPress={() => {}} />
          <View style={styles.menuSep} />
          <MenuItem emoji="💬" label="Suporte via WhatsApp" onPress={() => {}} />
          <View style={styles.menuSep} />
          <MenuItem emoji="ℹ️" label="Versão do app" value="1.0.0" />
        </View>
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <View style={[styles.menuGroup, shadow.sm]}>
          <MenuItem emoji="🚪" label="Sair da conta" onPress={handleLogout} danger />
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
    backgroundColor: colors.primary,
    paddingTop: 56,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarLg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#FFFFFF' },
  name: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  category: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  badges: { flexDirection: 'row', gap: spacing.sm, marginTop: 4 },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeText: { fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: '500' },
  statsCard: {
    margin: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    flexDirection: 'row',
  },
  stat: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm },
  statDiv: { width: 1, backgroundColor: colors.borderLight },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  menuGroup: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    gap: spacing.md,
  },
  menuEmoji: { fontSize: 20, width: 28 },
  menuLabel: { flex: 1, fontSize: 14, color: colors.text, fontWeight: '500' },
  menuLabelDanger: { color: colors.error },
  menuValue: { fontSize: 13, color: colors.textSecondary },
  menuArrow: { fontSize: 18, color: colors.textLight },
  menuSep: { height: 1, backgroundColor: colors.borderLight, marginLeft: 60 },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: 4,
  },
  footerText: { fontSize: 12, color: colors.textLight },
});
