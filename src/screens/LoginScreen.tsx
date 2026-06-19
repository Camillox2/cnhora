import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius, shadow } from '../theme';
import { CNHoraLogo, EyeIcon, EyeOffIcon } from '../components/Icons';

interface Props {
  onLogin: (user: any) => void;
  onNavigateToRegister: () => void;
}

export default function LoginScreen({ onLogin, onNavigateToRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'Informe seu e-mail';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'E-mail inválido';
    if (!password) e.password = 'Informe sua senha';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const usersRaw = await AsyncStorage.getItem('cnhora_users');
      const users: any[] = usersRaw ? JSON.parse(usersRaw) : [];
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
      );
      if (!user) {
        Alert.alert('Erro', 'E-mail ou senha incorretos. Tente novamente.');
        setLoading(false);
        return;
      }
      await AsyncStorage.setItem('cnhora_current_user', JSON.stringify(user));
      onLogin(user);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <CNHoraLogo size={48} />
            <View style={styles.logoText}>
              <Text style={styles.brandName}>CNHora</Text>
              <Text style={styles.brandTagline}>Sua CNH com quem entende</Text>
            </View>
          </View>
          <View style={styles.heroIllustration}>
            {/* SVG illustration: steering wheel */}
            <View style={styles.illustrationCircle}>
              <View style={styles.steeringOuter}>
                <View style={styles.steeringSpoke} />
                <View style={[styles.steeringSpoke, { transform: [{ rotate: '60deg' }] }]} />
                <View style={[styles.steeringSpoke, { transform: [{ rotate: '120deg' }] }]} />
                <View style={styles.steeringCenter} />
              </View>
            </View>
          </View>
        </View>

        {/* Card */}
        <View style={[styles.card, shadow.md]}>
          <Text style={styles.title}>Entrar na sua conta</Text>
          <Text style={styles.subtitle}>Bem-vindo de volta!</Text>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="seu@email.com"
              placeholderTextColor={colors.textLight}
              value={email}
              onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: undefined })); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                placeholder="Sua senha"
                placeholderTextColor={colors.textLight}
                value={password}
                onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: undefined })); }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginBtnText}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Register link */}
          <TouchableOpacity style={styles.registerLink} onPress={onNavigateToRegister}>
            <Text style={styles.registerLinkText}>
              Não tem conta?{' '}
              <Text style={styles.registerLinkBold}>Cadastre-se grátis</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Demo hint */}
        <TouchableOpacity
          style={styles.demoHint}
          onPress={async () => {
            // Seed demo accounts if not existing
            const usersRaw = await AsyncStorage.getItem('cnhora_users');
            const users: any[] = usersRaw ? JSON.parse(usersRaw) : [];
            if (!users.find((u) => u.email === 'aluno@demo.com')) {
              users.push({ id: 'demo1', name: 'Vitor Demo', email: 'aluno@demo.com', password: '123456', role: 'student' });
              users.push({ id: 'demo2', name: 'Instrutor Demo', email: 'instrutor@demo.com', password: '123456', role: 'instructor' });
              await AsyncStorage.setItem('cnhora_users', JSON.stringify(users));
            }
            Alert.alert(
              'Contas de demonstração',
              'Aluno: aluno@demo.com / 123456\nInstrutor: instrutor@demo.com / 123456',
            );
          }}
        >
          <Text style={styles.demoText}>Ver contas demo</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.primary },
  container: { flex: 1 },
  content: { flexGrow: 1 },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  logoText: { gap: 2 },
  brandName: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  brandTagline: { fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: '400' },
  heroIllustration: { marginBottom: spacing.sm },
  illustrationCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  steeringOuter: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 4, borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  steeringSpoke: {
    position: 'absolute', width: 3, height: 28,
    backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 2,
  },
  steeringCenter: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  card: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    flex: 1,
  },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.xl },
  fieldGroup: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, paddingHorizontal: spacing.md,
    paddingVertical: 14, fontSize: 15, color: colors.text,
    backgroundColor: colors.background,
  },
  inputError: { borderColor: colors.error },
  passwordRow: { position: 'relative' },
  passwordInput: { paddingRight: 50 },
  eyeBtn: {
    position: 'absolute', right: 14, top: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
  },
  errorText: { fontSize: 12, color: colors.error, marginTop: 4 },
  loginBtn: {
    backgroundColor: colors.primary, borderRadius: radius.lg,
    paddingVertical: 16, alignItems: 'center', marginTop: spacing.sm,
  },
  loginBtnDisabled: { opacity: 0.6 },
  loginBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  divider: {
    flexDirection: 'row', alignItems: 'center',
    gap: spacing.md, marginVertical: spacing.lg,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 13, color: colors.textSecondary },
  registerLink: { alignItems: 'center', paddingVertical: spacing.sm },
  registerLinkText: { fontSize: 14, color: colors.textSecondary },
  registerLinkBold: { color: colors.secondary, fontWeight: '700' },
  demoHint: { alignItems: 'center', paddingVertical: spacing.lg, backgroundColor: colors.surface },
  demoText: { fontSize: 12, color: colors.textLight, textDecorationLine: 'underline' },
});
