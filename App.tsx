import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import InstructorProfileScreen from './src/screens/InstructorProfileScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import BookingConfirmScreen from './src/screens/BookingConfirmScreen';
import SimuladosScreen from './src/screens/SimuladosScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import MinhasAulasScreen from './src/screens/MinhasAulasScreen';
import ProfileScreen from './src/screens/ProfileScreen';

import { colors, spacing, radius } from './src/theme';
import { Instructor } from './src/data';

// ─── Types ─────────────────────────────────────────────────────────────────

type AppState = 'splash' | 'onboarding' | 'main';

type Screen =
  | 'Home'
  | 'Buscar'
  | 'InstructorProfile'
  | 'Schedule'
  | 'BookingConfirm'
  | 'Simulados'
  | 'Progresso'
  | 'MinhasAulas'
  | 'Perfil';

interface NavParams {
  instructor?: Instructor;
  date?: string;
  dayLabel?: string;
  time?: string;
}

// ─── Bottom Tab Bar ──────────────────────────────────────────────────────────

const TABS = [
  { id: 'Home', emoji: '🏠', label: 'Início' },
  { id: 'Buscar', emoji: '🔍', label: 'Buscar' },
  { id: 'Simulados', emoji: '📝', label: 'Simulados' },
  { id: 'Progresso', emoji: '📈', label: 'Progresso' },
  { id: 'Perfil', emoji: '👤', label: 'Perfil' },
] as const;

type TabId = (typeof TABS)[number]['id'];
const TAB_IDS = TABS.map((t) => t.id) as TabId[];

function BottomTabBar({
  activeTab,
  onPress,
}: {
  activeTab: TabId;
  onPress: (id: TabId) => void;
}) {
  return (
    <View style={tabStyles.bar}>
      {TABS.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={tabStyles.tab}
            onPress={() => onPress(tab.id)}
          >
            <Text style={[tabStyles.emoji, active && tabStyles.emojiActive]}>
              {tab.emoji}
            </Text>
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
    gap: 2,
  },
  emoji: {
    fontSize: 22,
    opacity: 0.4,
  },
  emojiActive: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [activeTab, setActiveTab] = useState<TabId>('Home');
  const [currentScreen, setCurrentScreen] = useState<Screen>('Home');
  const [navParams, setNavParams] = useState<NavParams>({});
  const [navStack, setNavStack] = useState<{ screen: Screen; params: NavParams }[]>([]);

  useEffect(() => {
    // Check if user has completed onboarding
    AsyncStorage.getItem('cnhora_onboarding_done').then((val) => {
      // We'll navigate to onboarding from splash
    });
  }, []);

  const navigate = (screen: string, params: any = {}) => {
    const s = screen as Screen;
    setNavStack((prev) => [...prev, { screen: currentScreen, params: navParams }]);
    setCurrentScreen(s);
    setNavParams(params);
    // If navigating to a tab screen, update active tab
    if (TAB_IDS.includes(s as TabId)) {
      setActiveTab(s as TabId);
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

  const handleTabPress = (id: TabId) => {
    setActiveTab(id);
    setCurrentScreen(id as Screen);
    setNavParams({});
    setNavStack([]);
  };

  const handleSplashFinish = () => {
    AsyncStorage.getItem('cnhora_onboarding_done').then((val) => {
      if (val === 'true') {
        setAppState('main');
      } else {
        setAppState('onboarding');
      }
    });
  };

  const handleOnboardingFinish = async () => {
    await AsyncStorage.setItem('cnhora_onboarding_done', 'true');
    setAppState('main');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('cnhora_onboarding_done');
    setAppState('onboarding');
  };

  const showTabBar = TAB_IDS.includes(currentScreen as TabId);

  // ─── Render ────────────────────────────────────────────────────────────────

  if (appState === 'splash') {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (appState === 'onboarding') {
    return <OnboardingScreen onFinish={handleOnboardingFinish} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen onNavigate={navigate} />;

      case 'Buscar':
        return <SearchScreen onNavigate={navigate} />;

      case 'InstructorProfile':
        if (!navParams.instructor) return null;
        return (
          <InstructorProfileScreen
            instructor={navParams.instructor}
            onNavigate={navigate}
            onBack={goBack}
          />
        );

      case 'Schedule':
        if (!navParams.instructor) return null;
        return (
          <ScheduleScreen
            instructor={navParams.instructor}
            onNavigate={navigate}
            onBack={goBack}
          />
        );

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
        return <ProfileScreen onNavigate={navigate} onLogout={handleLogout} />;

      default:
        return <HomeScreen onNavigate={navigate} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary}
      />
      <View style={styles.screenContainer}>{renderScreen()}</View>
      {showTabBar && (
        <BottomTabBar activeTab={activeTab} onPress={handleTabPress} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
