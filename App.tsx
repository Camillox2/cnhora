import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import InstructorProfileScreen from './src/screens/InstructorProfileScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import BookingConfirmScreen from './src/screens/BookingConfirmScreen';
import SimuladosScreen from './src/screens/SimuladosScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import MinhasAulasScreen from './src/screens/MinhasAulasScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import InstructorDashboardScreen from './src/screens/InstructorDashboardScreen';
import InstructorAgendaScreen from './src/screens/InstructorAgendaScreen';
import InstructorProfileEditScreen from './src/screens/InstructorProfileEditScreen';

import { colors, spacing, radius } from './src/theme';
import { Instructor } from './src/data';
import {
  HomeIcon, SearchIcon, FileTextIcon, TrendingUpIcon, UserIcon, GridIcon, CalendarIcon,
} from './src/components/Icons';

// ─── Types ─────────────────────────────────────────────────────────────────

type AppState = 'splash' | 'auth' | 'register' | 'main';

type Screen =
  | 'Home' | 'Buscar' | 'InstructorProfile' | 'Schedule'
  | 'BookingConfirm' | 'Simulados' | 'Progresso' | 'MinhasAulas' | 'Perfil'
  | 'InstructorDashboard' | 'InstructorAgenda' | 'InstructorPerfil';

interface NavParams {
  instructor?: Instructor;
  date?: string;
  dayLabel?: string;
  time?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor';
}

// ─── Tab Configs ────────────────────────────────────────────────────────────

const STUDENT_TABS = [
  { id: 'Home', label: 'Início', Icon: HomeIcon },
  { id: 'Buscar', label: 'Buscar', Icon: SearchIcon },
  { id: 'Simulados', label: 'Simulados', Icon: FileTextIcon },
  { id: 'Progresso', label: 'Progresso', Icon: TrendingUpIcon },
  { id: 'Perfil', label: 'Perfil', Icon: UserIcon },
] as const;

const INSTRUCTOR_TABS = [
  { id: 'InstructorDashboard', label: 'Dashboard', Icon: GridIcon },
  { id: 'InstructorAgenda', label: 'Agenda', Icon: CalendarIcon },
  { id: 'InstructorPerfil', label: 'Meu Perfil', Icon: UserIcon },
] as const;

type StudentTabId = (typeof STUDENT_TABS)[number]['id'];
type InstructorTabId = (typeof INSTRUCTOR_TABS)[number]['id'];
type TabId = StudentTabId | InstructorTabId;

const { width } = Dimensions.get('window');

// ─── Bottom Tab Bar ──────────────────────────────────────────────────────────

function BottomTabBar({
  tabs,
  activeTab,
  onPress,
}: {
  tabs: readonly { id: string; label: string; Icon: React.ComponentType<any> }[];
  activeTab: string;
  onPress: (id: string) => void;
}) {
  return (
    <View style={tabStyles.bar}>
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={tabStyles.tab}
            onPress={() => onPress(tab.id)}
            activeOpacity={0.7}
          >
            <View style={[tabStyles.iconWrap, active && tabStyles.iconWrapActive]}>
              <tab.Icon
                size={20}
                color={active ? colors.secondary : colors.textLight}
                strokeWidth={active ? 2.5 : 1.8}
              />
            </View>
            <Text style={[tabStyles.label, active && tabStyles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 20,
    paddingTop: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  iconWrap: {
    padding: 4,
    borderRadius: 8,
  },
  iconWrapActive: {
    backgroundColor: colors.secondary + '15',
  },
  label: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.secondary,
    fontWeight: '700',
  },
});

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [currentScreen, setCurrentScreen] = useState<Screen>('Home');
  const [navParams, setNavParams] = useState<NavParams>({});
  const [navStack, setNavStack] = useState<{ screen: Screen; params: NavParams }[]>([]);

  useEffect(() => {
    // no-op – handled in handleSplashFinish
  }, []);

  const navigate = (screen: string, params: any = {}) => {
    const s = screen as Screen;
    setNavStack((prev) => [...prev, { screen: currentScreen, params: navParams }]);
    setCurrentScreen(s);
    setNavParams(params);
    const allTabIds = [...STUDENT_TABS.map(t => t.id), ...INSTRUCTOR_TABS.map(t => t.id)];
    if (allTabIds.includes(s as any)) {
      setActiveTab(s);
    }
  };

  const goBack = () => {
    const prev = navStack[navStack.length - 1];
    if (prev) {
      setCurrentScreen(prev.screen);
      setNavParams(prev.params);
      setNavStack((stack) => stack.slice(0, -1));
    }
  };

  const handleTabPress = (id: string) => {
    setActiveTab(id);
    setCurrentScreen(id as Screen);
    setNavParams({});
    setNavStack([]);
  };

  const handleSplashFinish = async () => {
    try {
      const raw = await AsyncStorage.getItem('cnhora_current_user');
      if (raw) {
        const user = JSON.parse(raw);
        setCurrentUser(user);
        const defaultScreen = user.role === 'instructor' ? 'InstructorDashboard' : 'Home';
        setCurrentScreen(defaultScreen as Screen);
        setActiveTab(defaultScreen);
        setAppState('main');
      } else {
        setAppState('auth');
      }
    } catch {
      setAppState('auth');
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    const defaultScreen = user.role === 'instructor' ? 'InstructorDashboard' : 'Home';
    setCurrentScreen(defaultScreen as Screen);
    setActiveTab(defaultScreen);
    setNavStack([]);
    setNavParams({});
    setAppState('main');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('cnhora_current_user');
    setCurrentUser(null);
    setAppState('auth');
    setCurrentScreen('Home');
    setActiveTab('Home');
    setNavStack([]);
  };

  const isInstructor = currentUser?.role === 'instructor';
  const tabs = isInstructor ? INSTRUCTOR_TABS : STUDENT_TABS;
  const allTabIds = tabs.map((t) => t.id);
  const showTabBar = allTabIds.includes(currentScreen as any);

  // ─── Splash ────────────────────────────────────────────────────────────────

  if (appState === 'splash') {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (appState === 'auth') {
    return <LoginScreen onLogin={handleLogin} onNavigateToRegister={() => setAppState('register')} />;
  }

  if (appState === 'register') {
    return (
      <RegisterScreen
        onRegister={handleLogin}
        onNavigateToLogin={() => setAppState('auth')}
      />
    );
  }

  // ─── Main App ──────────────────────────────────────────────────────────────

  const renderScreen = () => {
    switch (currentScreen) {
      // Student screens
      case 'Home':
        return <HomeScreen onNavigate={navigate} user={currentUser} />;
      case 'Buscar':
        return <SearchScreen onNavigate={navigate} />;
      case 'InstructorProfile':
        if (!navParams.instructor) return null;
        return <InstructorProfileScreen instructor={navParams.instructor} onNavigate={navigate} onBack={goBack} />;
      case 'Schedule':
        if (!navParams.instructor) return null;
        return <ScheduleScreen instructor={navParams.instructor} onNavigate={navigate} onBack={goBack} />;
      case 'BookingConfirm':
        if (!navParams.instructor || !navParams.date || !navParams.time) return null;
        return (
          <BookingConfirmScreen
            instructor={navParams.instructor}
            date={navParams.date}
            dayLabel={navParams.dayLabel ?? ''}
            time={navParams.time}
            onNavigate={navigate}
          />
        );
      case 'Simulados':
        return <SimuladosScreen onNavigate={navigate} />;
      case 'Progresso':
        return <ProgressScreen />;
      case 'MinhasAulas':
        return <MinhasAulasScreen onNavigate={navigate} />;
      case 'Perfil':
        return <ProfileScreen onNavigate={navigate} onLogout={handleLogout} user={currentUser} />;

      // Instructor screens
      case 'InstructorDashboard':
        return <InstructorDashboardScreen onNavigate={navigate} user={currentUser} />;
      case 'InstructorAgenda':
        return <InstructorAgendaScreen onNavigate={navigate} />;
      case 'InstructorPerfil':
        return <InstructorProfileEditScreen onNavigate={navigate} onLogout={handleLogout} user={currentUser} />;

      default:
        return <HomeScreen onNavigate={navigate} user={currentUser} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.screenContainer}>{renderScreen()}</View>
      {showTabBar && (
        <BottomTabBar tabs={tabs} activeTab={activeTab} onPress={handleTabPress} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  screenContainer: { flex: 1, backgroundColor: colors.background },
});
