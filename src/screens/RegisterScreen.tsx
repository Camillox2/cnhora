import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius, shadow } from '../theme';
import { CNHoraLogo, EyeIcon, EyeOffIcon, GraduationCapIcon, AwardIcon, ChevronLeftIcon } from '../components/Icons';

interface Props {
  onRegister: (user: any) => void;
  onNavigateToLogin: () => void;
}

type Role = 'student' | 'instructor';

export default function RegisterScreen({ onRegister, onNavigateToLogin }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 3) e.name = 'Nome deve ter ao menos 3 caracteres';
    if (!email.trim()) e.email = 'Informe seu e-mail';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'E-mail inválido';
    if (!password || password.length < 6) e.password = 'Senha deve ter ao menos 6 caracteres';
    if (password !== confirmPassword) e.confirmPassword = 'As senhas não coincidem';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const usersRaw = await AsyncStorage.getItem('cnhora_users');
      const users: any[] = usersRaw ? JSON.parse(usersRaw) : [];
      if (users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim())) {
        Alert.alert('E-mail já cadastrado', 'Este e-mail já está em uso. Tente outro ou faça login.');
        setLoading(false);
        return;
      }
      const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        role,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      await AsyncStorage.setItem('cnhora_users', JSON.stringify(users));
      await AsyncStorage.setItem('cnhora_current_user', JSON.stringify(newUser));
      await AsyncStorage.setItem('cnhora_onboarding_done', 'true');
      onRegister(newUser);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível criar a conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({
    label, value, onChangeText, placeholder, error, secureTextEntry, keyboardType, rightElement, autoCapitalize,
  }: any) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput
          style={[styles.input, error && styles.inputError, rightElement && styles.inputWithRight]}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          value={value}
          onChangeText={(t) => { onChangeText(t); setErrors((e) => ({ ...e, [label]: undefined })); }}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType || 'default'}
          autoCapitalize={autoCapitalize || 'sentences'}
          autoCorrect={false}
        />
        {rightElement && <View style={styles.inputRight}>{rightElement}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

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
          <TouchableOpacity style={styles.backBtn} onPress={onNavigateToLogin}>
            <ChevronLeftIcon color="#FFFFFF" size={22} />
          </TouchableOpacity>
          <View style={styles.logoRow}>
            <CNHoraLogo size={40} />
            <Text style={styles.brandName}>CNHora</Text>
          </View>
          <Text style={styles.headerTitle}>Criar conta grátis</Text>
          <Text style={styles.headerSub}>Comece sua jornada rumo à CNH</Text>
        </View>

        {/* Card */}
        <View style={[styles.card, shadow.md]}>

          {/* Role Selector */}
          <Text style={styles.roleLabel}>Você é:</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleCard, role === 'student' && styles.roleCardActive]}
              onPress={() => setRole('student')}
            >
              <GraduationCapIcon size={28} color={role === 'student' ? colors.secondary : colors.textSecondary} />
              <Text style={[styles.roleTitle, role === 'student' && styles.roleTitleActive]}>Aluno</Text>
              <Text style={styles.roleDesc}>Quero tirar minha CNH</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleCard, role === 'instructor' && styles.roleCardActive]}
              onPress={() => setRole('instructor')}
            >
              <AwardIcon size={28} color={role === 'instructor' ? colors.secondary : colors.textSecondary} />
              <Text style={[styles.roleTitle, role === 'instructor' && styles.roleTitleActive]}>Instrutor</Text>
              <Text style={styles.roleDesc}>Quero dar aulas</Text>
            </TouchableOpacity>
          </View>

          {/* Fields */}
          <Field
            label="Nome completo"
            value={name}
            onChangeText={setName}
            placeholder="Seu nome completo"
            error={errors.name}
          />
          <Field
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Field
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            error={errors.password}
            secureTextEntry={!showPassword}
            rightElement={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </TouchableOpacity>
            }
          />
          <Field
            label="Confirmar senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repita a senha"
            error={errors.confirmPassword}
            secureTextEntry={!showPassword}
          />

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerBtn, loading && styles.registerBtnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerBtnText}>
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles.terms}>
            Ao criar uma conta, você concorda com nossos{' '}
            <Text style={styles.termsLink}>Termos de Uso</Text> e{' '}
            <Text style={styles.termsLink}>Política de Privacidade</Text>.
          </Text>

          {/* Login link */}
          <TouchableOpacity style={styles.loginLink} onPress={onNavigateToLogin}>
            <Text style={styles.loginLinkText}>
              Já tem conta?{' '}
              <Text style={styles.loginLinkBold}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 60, paddingHorizontal: spacing.xl, paddingBottom: spacing.xl,
  },
  backBtn: { marginBottom: spacing.lg },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  brandName: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.65)' },
  card: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: spacing.xl, paddingBottom: spacing.xxl, flex: 1,
  },
  roleLabel: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  roleRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  roleCard: {
    flex: 1, borderWidth: 2, borderColor: colors.border,
    borderRadius: radius.lg, padding: spacing.md,
    alignItems: 'center', gap: 6,
  },
  roleCardActive: { borderColor: colors.secondary, backgroundColor: colors.secondary + '0D' },
  roleTitle: { fontSize: 15, fontWeight: '700', color: colors.textSecondary },
  roleTitleActive: { color: colors.secondary },
  roleDesc: { fontSize: 11, color: colors.textLight, textAlign: 'center' },
  fieldGroup: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  inputWrap: { position: 'relative' },
  input: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: 14,
    fontSize: 15, color: colors.text, backgroundColor: colors.background,
  },
  inputWithRight: { paddingRight: 50 },
  inputRight: { position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' },
  inputError: { borderColor: colors.error },
  errorText: { fontSize: 12, color: colors.error, marginTop: 4 },
  registerBtn: {
    backgroundColor: colors.primary, borderRadius: radius.lg,
    paddingVertical: 16, alignItems: 'center', marginTop: spacing.sm,
  },
  registerBtnDisabled: { opacity: 0.6 },
  registerBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  terms: { fontSize: 11, color: colors.textLight, textAlign: 'center', marginTop: spacing.md, lineHeight: 16 },
  termsLink: { color: colors.secondary, fontWeight: '500' },
  loginLink: { alignItems: 'center', paddingVertical: spacing.md },
  loginLinkText: { fontSize: 14, color: colors.textSecondary },
  loginLinkBold: { color: colors.secondary, fontWeight: '700' },
});
