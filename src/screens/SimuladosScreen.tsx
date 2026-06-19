import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
import { simuladoQuestions } from '../data';

interface Props {
  onNavigate: (screen: string, params?: any) => void;
}

type State = 'start' | 'quiz' | 'result';

export default function SimuladosScreen({ onNavigate }: Props) {
  const [state, setState] = useState<State>('start');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(simuladoQuestions.length).fill(null)
  );
  const [showExplanation, setShowExplanation] = useState(false);

  const question = simuladoQuestions[currentQ];
  const selectedAnswer = answers[currentQ];
  const correctCount = answers.filter((a, i) => a === simuladoQuestions[i].correct).length;

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = index;
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentQ < simuladoQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setState('result');
    }
  };

  const handleRestart = () => {
    setState('start');
    setCurrentQ(0);
    setAnswers(new Array(simuladoQuestions.length).fill(null));
    setShowExplanation(false);
  };

  if (state === 'start') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Simulados</Text>
          <Text style={styles.headerSub}>Prepare-se para a prova teórica</Text>
        </View>
        <ScrollView contentContainerStyle={styles.startContent}>
          <View style={styles.startHero}>
            <Text style={styles.startEmoji}>📝</Text>
            <Text style={styles.startTitle}>Simulado Categoria B</Text>
            <Text style={styles.startSub}>
              {simuladoQuestions.length} questões sobre legislação, sinalização e direção defensiva
            </Text>
          </View>

          <View style={[styles.infoGrid, shadow.sm]}>
            {[
              { emoji: '❓', label: 'Questões', value: `${simuladoQuestions.length}` },
              { emoji: '⏱️', label: 'Tempo estimado', value: '8 min' },
              { emoji: '✅', label: 'Mínimo para aprovação', value: '70%' },
              { emoji: '📖', label: 'Categoria', value: 'Cat. B' },
            ].map((item, i) => (
              <View key={i} style={styles.infoItem}>
                <Text style={styles.infoEmoji}>{item.emoji}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
                <Text style={styles.infoLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Dicas antes de começar</Text>
            <Text style={styles.tipsText}>• Leia cada questão com atenção</Text>
            <Text style={styles.tipsText}>• Lembre-se do CTB e resoluções CONTRAN</Text>
            <Text style={styles.tipsText}>• Revise as questões erradas na explicação</Text>
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={() => setState('quiz')}>
            <Text style={styles.startBtnText}>Iniciar simulado</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (state === 'result') {
    const pct = Math.round((correctCount / simuladoQuestions.length) * 100);
    const approved = pct >= 70;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Resultado</Text>
          <Text style={styles.headerSub}>Simulado concluído</Text>
        </View>
        <ScrollView contentContainerStyle={styles.resultContent}>
          <View style={[styles.resultCard, approved ? styles.resultCardPass : styles.resultCardFail, shadow.md]}>
            <Text style={styles.resultEmoji}>{approved ? '🎉' : '📚'}</Text>
            <Text style={styles.resultTitle}>{approved ? 'Aprovado!' : 'Continue estudando'}</Text>
            <Text style={styles.resultScore}>{correctCount}/{simuladoQuestions.length}</Text>
            <Text style={styles.resultPct}>{pct}% de acertos</Text>
          </View>

          <View style={styles.resultStats}>
            <View style={[styles.resultStat, shadow.sm]}>
              <Text style={styles.resultStatValue}>{correctCount}</Text>
              <Text style={styles.resultStatLabel}>Corretas</Text>
            </View>
            <View style={[styles.resultStat, shadow.sm]}>
              <Text style={[styles.resultStatValue, { color: colors.error }]}>
                {simuladoQuestions.length - correctCount}
              </Text>
              <Text style={styles.resultStatLabel}>Erradas</Text>
            </View>
            <View style={[styles.resultStat, shadow.sm]}>
              <Text style={[styles.resultStatValue, { color: approved ? colors.success : colors.warning }]}>
                {pct}%
              </Text>
              <Text style={styles.resultStatLabel}>Aproveitamento</Text>
            </View>
          </View>

          <View style={styles.reviewSection}>
            <Text style={styles.reviewTitle}>Revisão das questões</Text>
            {simuladoQuestions.map((q, i) => {
              const ans = answers[i];
              const correct = ans === q.correct;
              return (
                <View key={i} style={[styles.reviewItem, shadow.sm]}>
                  <View style={styles.reviewHeader}>
                    <Text style={[styles.reviewStatus, { color: correct ? colors.success : colors.error }]}>
                      {correct ? '✓ Correta' : '✗ Errada'}
                    </Text>
                    <Text style={styles.reviewNum}>Q{i + 1}</Text>
                  </View>
                  <Text style={styles.reviewQuestion} numberOfLines={2}>{q.question}</Text>
                  {!correct && (
                    <Text style={styles.reviewCorrect}>
                      Correta: {q.options[q.correct]}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>

          <TouchableOpacity style={styles.restartBtn} onPress={handleRestart}>
            <Text style={styles.restartBtnText}>Refazer simulado</Text>
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    );
  }

  // Quiz
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.quizMeta}>
          <Text style={styles.quizCount}>
            {currentQ + 1} / {simuladoQuestions.length}
          </Text>
          <Text style={styles.quizScore}>✓ {answers.filter((a, i) => a !== null && a === simuladoQuestions[i].correct).length} certas</Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${((currentQ) / simuladoQuestions.length) * 100}%` }]}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.quizContent}>
        <Text style={styles.questionText}>{question.question}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((opt, i) => {
            let optStyle = styles.option;
            let textStyle = styles.optionText;
            if (selectedAnswer !== null) {
              if (i === question.correct) {
                optStyle = { ...styles.option, ...styles.optionCorrect };
                textStyle = { ...styles.optionText, ...styles.optionTextCorrect };
              } else if (i === selectedAnswer) {
                optStyle = { ...styles.option, ...styles.optionWrong };
                textStyle = { ...styles.optionText, ...styles.optionTextWrong };
              }
            }
            return (
              <TouchableOpacity
                key={i}
                style={optStyle}
                onPress={() => handleAnswer(i)}
                disabled={selectedAnswer !== null}
              >
                <View style={styles.optionLetter}>
                  <Text style={styles.optionLetterText}>
                    {['A', 'B', 'C', 'D'][i]}
                  </Text>
                </View>
                <Text style={[textStyle, { flex: 1 }]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {showExplanation && (
          <View style={[styles.explanationCard, shadow.sm]}>
            <Text style={styles.explanationTitle}>
              {selectedAnswer === question.correct ? '✅ Resposta correta!' : '❌ Resposta incorreta'}
            </Text>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}
      </ScrollView>

      {selectedAnswer !== null && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {currentQ < simuladoQuestions.length - 1 ? 'Próxima questão →' : 'Ver resultado'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  quizMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  quizCount: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  quizScore: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  progressTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: '#FFFFFF', borderRadius: 2 },
  startContent: { padding: spacing.lg, gap: spacing.lg },
  startHero: { alignItems: 'center', paddingVertical: spacing.xl },
  startEmoji: { fontSize: 64, marginBottom: spacing.md },
  startTitle: { fontSize: 24, fontWeight: '700', color: colors.text },
  startSub: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 22 },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  infoItem: { width: '45%', alignItems: 'center' },
  infoEmoji: { fontSize: 24, marginBottom: 4 },
  infoValue: { fontSize: 18, fontWeight: '700', color: colors.text },
  infoLabel: { fontSize: 11, color: colors.textSecondary, textAlign: 'center' },
  tipsCard: {
    backgroundColor: colors.primary + '10',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 4,
  },
  tipsTitle: { fontSize: 14, fontWeight: '700', color: colors.primary, marginBottom: 4 },
  tipsText: { fontSize: 13, color: colors.textSecondary, lineHeight: 22 },
  startBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  startBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  quizContent: { padding: spacing.lg, gap: spacing.lg },
  questionText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 26,
    marginTop: spacing.sm,
  },
  optionsContainer: { gap: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionCorrect: { borderColor: colors.success, backgroundColor: colors.successLight },
  optionWrong: { borderColor: colors.error, backgroundColor: colors.errorLight },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterText: { fontWeight: '700', color: colors.textSecondary, fontSize: 13 },
  optionText: { fontSize: 14, color: colors.text, lineHeight: 20 },
  optionTextCorrect: { color: colors.success, fontWeight: '600' },
  optionTextWrong: { color: colors.error },
  explanationCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  explanationTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  explanationText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  footer: {
    padding: spacing.lg,
    paddingBottom: 32,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  nextBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  nextBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  resultContent: { padding: spacing.lg, gap: spacing.lg },
  resultCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  resultCardPass: { backgroundColor: colors.successLight },
  resultCardFail: { backgroundColor: colors.warningLight },
  resultEmoji: { fontSize: 48 },
  resultTitle: { fontSize: 24, fontWeight: '800', color: colors.text },
  resultScore: { fontSize: 48, fontWeight: '800', color: colors.primary },
  resultPct: { fontSize: 16, color: colors.textSecondary },
  resultStats: { flexDirection: 'row', gap: spacing.md },
  resultStat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  resultStatValue: { fontSize: 28, fontWeight: '800', color: colors.success },
  resultStatLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  reviewSection: { gap: spacing.sm },
  reviewTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  reviewItem: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 4,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  reviewStatus: { fontSize: 12, fontWeight: '700' },
  reviewNum: { fontSize: 12, color: colors.textLight },
  reviewQuestion: { fontSize: 13, color: colors.text, lineHeight: 19 },
  reviewCorrect: { fontSize: 12, color: colors.success, fontWeight: '500' },
  restartBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  restartBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
