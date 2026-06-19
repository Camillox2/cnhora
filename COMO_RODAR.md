# CNHora — App Mobile

React Native + Expo · Sem backend · Dados cacheados com AsyncStorage

## Pré-requisitos
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Conta gratuita em https://expo.dev (para gerar APK)

## Rodar no celular (mais rápido)
```bash
cd cnhora-app
npm install
npx expo start
```
Escanear o QR Code com o app **Expo Go** (Android ou iOS).

## Gerar APK
```bash
npm install -g eas-cli
eas login          # login com conta expo.dev
eas build --platform android --profile preview
```
O APK é gerado na nuvem (~5 min). Link para download aparece no terminal.

## Estrutura
```
App.tsx               # Navegação principal + Bottom Tab Bar
src/
  theme.ts            # Cores, espaçamentos, tipografia
  data.ts             # Dados mockados (instrutores, aulas, simulado)
  screens/
    SplashScreen       # Tela de carregamento
    OnboardingScreen   # 3 slides de apresentação
    HomeScreen         # Dashboard com progresso
    SearchScreen       # Busca e filtro de instrutores
    InstructorProfileScreen  # Perfil + avaliações
    ScheduleScreen     # Calendário + horários
    BookingConfirmScreen     # Confirmação de agendamento
    SimuladosScreen    # Quiz de 10 questões CTB
    ProgressScreen     # Progresso da jornada CNH
    MinhasAulasScreen  # Histórico de aulas
    ProfileScreen      # Perfil do usuário + configurações
```

## Telas do app
1. Splash → Onboarding (3 slides)
2. Home / Dashboard — progresso CNH, próxima aula, ações rápidas
3. Buscar instrutor — filtros por bairro, categoria, preço
4. Perfil do instrutor — bio, avaliações, disponibilidade
5. Agendar aula — calendário semanal + horários
6. Confirmação — feedback de sucesso
7. Simulados — 10 questões CTB com explicações
8. Meu Progresso — marcos da jornada, estatísticas
9. Minhas Aulas — histórico com filtros
10. Perfil — conta, notificações, LGPD

## Persistência (AsyncStorage)
- `cnhora_onboarding_done`: salva se o usuário completou o onboarding
- Dados de instrutores e aulas são carregados do `src/data.ts`
- Para adicionar um backend real: substituir os dados em `src/data.ts` por chamadas à API

## Equipe
Gabriel Wolff · Wellington Fonseca · Vitor Camillo · João Alvarez · Lucas Ashikaga
Universidade Positivo · 2026
