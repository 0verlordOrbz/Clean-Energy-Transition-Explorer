import React, { useState } from 'react';
import {
  X,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  XCircle,
  Award,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  DollarSign,
  Clock,
  Gauge,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { FACILITY_DETAILS, FacilityDetail } from '../data/facilityLearningData';
import { AnimatedEnergyFlow } from './AnimatedEnergyFlow';

interface FacilityModalProps {
  facilityId: string;
  onClose: () => void;
  onGrantEarned?: (facilityId: string, amountMillion: number) => void;
  completedQuizzes: string[];
}

type TabType = 'overview' | 'generation' | 'tradeoffs' | 'quiz';

export const FacilityModal: React.FC<FacilityModalProps> = ({
  facilityId,
  onClose,
  onGrantEarned,
  completedQuizzes,
}) => {
  const facility: FacilityDetail | undefined = FACILITY_DETAILS[facilityId];
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Quiz state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  if (!facility) return null;

  const isQuizAlreadyCompleted = completedQuizzes.includes(facility.id);
  const currentQuestion = facility.quiz[currentQuestionIdx];

  const handleSelectOption = (idx: number) => {
    if (hasSubmittedAnswer) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setHasSubmittedAnswer(true);

    if (selectedOption === currentQuestion.correctIndex) {
      setUserScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < facility.quiz.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setHasSubmittedAnswer(false);
    } else {
      setQuizFinished(true);
      // If passed quiz and not already claimed, award research grant
      if (userScore + (selectedOption === currentQuestion.correctIndex ? 1 : 0) >= 2 && !isQuizAlreadyCompleted) {
        if (onGrantEarned) {
          onGrantEarned(facility.id, facility.grantRewardMillion);
        }
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setHasSubmittedAnswer(false);
    setUserScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  {facility.name}
                </h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {facility.type.split(' ')[0]}
                </span>
                {isQuizAlreadyCompleted && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> Grant Awarded
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">{facility.tagline}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/60 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" /> Overview & Specs
          </button>
          <button
            onClick={() => setActiveTab('generation')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'generation'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" /> Generation Flow
          </button>
          <button
            onClick={() => setActiveTab('tradeoffs')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'tradeoffs'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ThumbsUp className="w-4 h-4" /> Pros & Limitations
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Facility Quiz
            {isQuizAlreadyCompleted && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW & SPECS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Engineering Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                    <Gauge className="w-3.5 h-3.5 text-emerald-400" /> Nameplate Capacity
                  </span>
                  <span className="text-base font-bold text-white font-mono">
                    {facility.capacityMW}
                  </span>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" /> Capacity Factor
                  </span>
                  <span className="text-base font-bold text-white font-mono">
                    {facility.capacityFactor}
                  </span>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Levelized Cost (LCOE)
                  </span>
                  <span className="text-base font-bold text-white font-mono">
                    {facility.levelizedCost}
                  </span>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" /> Design Lifespan
                  </span>
                  <span className="text-base font-bold text-white font-mono">
                    {facility.lifespan}
                  </span>
                </div>
              </div>

              {/* Core Thermodynamics & Principles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 space-y-1.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Primary Energy Source
                  </span>
                  <p className="text-sm font-semibold text-emerald-300">
                    {facility.primaryEnergySource}
                  </p>
                  <p className="text-xs text-slate-400">
                    Naturally occurring ambient potential harvested without ongoing extraction operations.
                  </p>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 space-y-1.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Conversion Principle
                  </span>
                  <p className="text-sm font-semibold text-cyan-300">
                    {facility.conversionPrinciple}
                  </p>
                  <p className="text-xs text-slate-400">
                    Physical transformation of raw source potential into synchronous Alternating Current.
                  </p>
                </div>
              </div>

              {/* Call to action */}
              <div className="flex items-center justify-between bg-gradient-to-r from-emerald-950/50 to-slate-900 border border-emerald-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Explore Energy Generation Flow</h4>
                    <p className="text-[11px] text-slate-400">Watch the step-by-step physics animation</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('generation')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  View Flow <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ANIMATED GENERATION FLOW */}
          {activeTab === 'generation' && (
            <AnimatedEnergyFlow facility={facility} />
          )}

          {/* TAB 3: ADVANTAGES & LIMITATIONS */}
          {activeTab === 'tradeoffs' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" /> Technical & Environmental Advantages
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {facility.advantages.map((adv, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-xs font-bold text-emerald-200">{adv.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed pl-6">
                        {adv.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-2">
                  <ThumbsDown className="w-4 h-4" /> Engineering Challenges & Limitations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {facility.limitations.map((lim, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        <span className="text-xs font-bold text-rose-200">{lim.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed pl-6">
                        {lim.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INTERACTIVE QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              {!quizFinished ? (
                <div className="space-y-5">
                  {/* Quiz Progress */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Question <span className="text-white font-bold">{currentQuestionIdx + 1}</span> of{' '}
                      {facility.quiz.length}
                    </span>
                    <span className="text-emerald-400 font-mono">
                      Reward: +₱{facility.grantRewardMillion}M Research Grant
                    </span>
                  </div>

                  {/* Question Prompt */}
                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                    <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                      {currentQuestion.question}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {currentQuestion.options.map((option, idx) => {
                      let optionStyle =
                        'bg-slate-800/60 border-slate-700/80 hover:bg-slate-700/80 text-slate-200';

                      if (selectedOption === idx) {
                        optionStyle = 'bg-emerald-950/50 border-emerald-500 text-white shadow-sm';
                      }

                      if (hasSubmittedAnswer) {
                        if (idx === currentQuestion.correctIndex) {
                          optionStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-semibold';
                        } else if (selectedOption === idx) {
                          optionStyle = 'bg-rose-950/70 border-rose-500 text-rose-200';
                        } else {
                          optionStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          disabled={hasSubmittedAnswer}
                          className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${optionStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full bg-slate-900/60 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1 leading-relaxed">{option}</span>
                          {hasSubmittedAnswer && idx === currentQuestion.correctIndex && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          )}
                          {hasSubmittedAnswer && selectedOption === idx && idx !== currentQuestion.correctIndex && (
                            <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {hasSubmittedAnswer && (
                    <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 text-xs space-y-1.5 animate-in fade-in duration-200">
                      <div className="flex items-center gap-1.5 font-bold text-slate-200">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <span>Engineering Explanation:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  )}

                  {/* Bottom Action Button */}
                  <div className="flex justify-end pt-2">
                    {!hasSubmittedAnswer ? (
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={selectedOption === null}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold transition-all shadow-lg"
                      >
                        Confirm Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg"
                      >
                        <span>
                          {currentQuestionIdx < facility.quiz.length - 1
                            ? 'Next Question'
                            : 'View Results'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Quiz Finished Summary */
                <div className="text-center py-6 space-y-5">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl">
                    <Award className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">Quiz Completed!</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      You scored <span className="text-emerald-400 font-bold">{userScore}</span> out of{' '}
                      {facility.quiz.length} questions.
                    </p>
                  </div>

                  {userScore >= 2 ? (
                    <div className="max-w-md mx-auto bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 text-xs space-y-2">
                      <div className="flex items-center justify-center gap-2 text-emerald-300 font-bold text-sm">
                        <Sparkles className="w-4 h-4" /> Clean Transition Grant Awarded!
                      </div>
                      <p className="text-slate-300">
                        +₱{facility.grantRewardMillion} Million (PHP) added to your regional Transition Investment
                        Budget in Mission Control!
                      </p>
                    </div>
                  ) : (
                    <div className="max-w-md mx-auto bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 text-xs space-y-1 text-amber-200">
                      <p>You need at least 2 correct answers to claim the transition grant.</p>
                      <p className="text-[11px] text-slate-400">Review the generation flow and try again!</p>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleRestartQuiz}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Retry Quiz
                    </button>
                    <button
                      onClick={() => setActiveTab('generation')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                    >
                      Review Generation Flow
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
