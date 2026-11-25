import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import ParticleCanvas, { ParticleMode } from './components/ParticleCanvas';
import LandingStep from './components/LandingStep';
import DateStep from './components/DateStep';
import ActivityStep from './components/ActivityStep';
import CustomizeStep from './components/CustomizeStep';
import OutfitStep from './components/OutfitStep';
import ConfirmationStep from './components/ConfirmationStep';
import { ActivityId, DatePlanState, FlowStep, OutfitId } from './types/datePlan';

const STORAGE_KEY = 'usha_date_invitation_v1';

const INITIAL_STATE: DatePlanState = {
  step: 'landing',
  selectedDate: null,
  selectedActivityId: null,
  selectedDetailId: null,
  revealedDetailText: null,
  selectedOutfitId: null,
  outfitSkipped: false,
  confirmed: false,
};

const VALID_STEPS: FlowStep[] = [
  'landing',
  'date',
  'activity',
  'customize',
  'outfit',
  'confirmation',
];

function loadSavedPlan(): DatePlanState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as Partial<DatePlanState>;
    const step =
      parsed.step && VALID_STEPS.includes(parsed.step) ? parsed.step : 'landing';

    // Guard against restoring mid-flow without prerequisite state
    if (step === 'customize' && !parsed.selectedActivityId) {
      return { ...INITIAL_STATE, ...parsed, step: 'activity' };
    }
    if (step === 'confirmation' && (!parsed.selectedDate || !parsed.selectedActivityId)) {
      return { ...INITIAL_STATE, ...parsed, step: 'date' };
    }

    return {
      ...INITIAL_STATE,
      ...parsed,
      step,
    };
  } catch {
    return INITIAL_STATE;
  }
}

export default function App() {
  const [plan, setPlan] = useState<DatePlanState>(loadSavedPlan);
  const [particleMode, setParticleMode] = useState<ParticleMode>('hearts');
  const [burstTrigger, setBurstTrigger] = useState(0);
  const [clearTrigger] = useState(0);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch {
      // Ignore storage quota errors
    }
  }, [plan]);

  const triggerBurst = () => {
    setBurstTrigger((n) => n + 1);
  };

  const goToStep = (nextStep: FlowStep) => {
    setPlan((prev) => ({ ...prev, step: nextStep }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDate = (isoDate: string) => {
    setPlan((prev) => ({
      ...prev,
      selectedDate: isoDate,
      confirmed: false,
    }));
  };

  const handleSelectActivity = (id: ActivityId) => {
    setPlan((prev) => ({
      ...prev,
      selectedActivityId: id,
      selectedDetailId: prev.selectedActivityId === id ? prev.selectedDetailId : null,
      revealedDetailText:
        prev.selectedActivityId === id ? prev.revealedDetailText : null,
      confirmed: false,
    }));
  };

  const handleSelectDetail = (detailId: string, revealedText?: string | null) => {
    setPlan((prev) => ({
      ...prev,
      selectedDetailId: detailId,
      revealedDetailText: revealedText ?? null,
      confirmed: false,
    }));
  };

  const handleSelectOutfit = (id: OutfitId) => {
    setPlan((prev) => ({
      ...prev,
      selectedOutfitId: id,
      outfitSkipped: false,
      confirmed: false,
    }));
  };

  const handleSkipOutfit = () => {
    setPlan((prev) => ({
      ...prev,
      selectedOutfitId: null,
      outfitSkipped: true,
      confirmed: false,
      step: 'confirmation',
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirm = () => {
    setPlan((prev) => ({ ...prev, confirmed: true }));
    triggerBurst();
  };

  const handleRestart = () => {
    setPlan(INITIAL_STATE);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCelebrating = plan.step === 'confirmation' && plan.confirmed;

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative flex min-h-screen flex-col justify-between">
        <ParticleCanvas
          mode={particleMode}
          celebrating={isCelebrating}
          burstTrigger={burstTrigger}
          clearTrigger={clearTrigger}
          density={isCelebrating ? 'lush' : 'gentle'}
        />

        {/* Minimal Header */}
        <header className="relative z-20 mx-auto flex w-full max-w-5xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => goToStep('landing')}
            className="font-display text-lg font-semibold tracking-tight text-[#3d0e1e] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 whitespace-nowrap shrink-0"
          >
            For Usha 💗
          </button>

          <button
            type="button"
            onClick={triggerBurst}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-rose-200/90 bg-white/85 px-4 py-2 text-xs font-semibold text-rose-700 backdrop-blur-sm transition-colors hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 whitespace-nowrap shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Bloom Hearts
          </button>
        </header>

        {/* Main Interactive Stage */}
        <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-4 py-4 sm:px-8 sm:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={plan.step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-full justify-center"
            >
              {plan.step === 'landing' && (
                <LandingStep
                  onYesClick={() => goToStep('date')}
                  onBurst={triggerBurst}
                />
              )}

              {plan.step === 'date' && (
                <DateStep
                  selectedDate={plan.selectedDate}
                  onSelectDate={handleSelectDate}
                  onBack={() => goToStep('landing')}
                  onContinue={() => goToStep('activity')}
                />
              )}

              {plan.step === 'activity' && (
                <ActivityStep
                  selectedActivityId={plan.selectedActivityId}
                  onSelectActivity={handleSelectActivity}
                  onBack={() => goToStep('date')}
                  onContinue={() => goToStep('customize')}
                  onBurst={triggerBurst}
                />
              )}

              {plan.step === 'customize' && plan.selectedActivityId && (
                <CustomizeStep
                  activityId={plan.selectedActivityId}
                  selectedDetailId={plan.selectedDetailId}
                  revealedDetailText={plan.revealedDetailText}
                  onSelectDetail={handleSelectDetail}
                  onBack={() => goToStep('activity')}
                  onContinue={() => goToStep('outfit')}
                  onBurst={triggerBurst}
                />
              )}

              {plan.step === 'outfit' && (
                <OutfitStep
                  selectedOutfitId={plan.selectedOutfitId}
                  onSelectOutfit={handleSelectOutfit}
                  onSkip={handleSkipOutfit}
                  onBack={() => goToStep('customize')}
                  onContinue={() => goToStep('confirmation')}
                />
              )}

              {plan.step === 'confirmation' && (
                <ConfirmationStep
                  plan={plan}
                  onConfirm={handleConfirm}
                  onEditStep={goToStep}
                  onBack={() => goToStep('outfit')}
                  onRestart={handleRestart}
                  onBurst={triggerBurst}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Quiet Footer with Particle Art Mode Selector */}
        <footer className="relative z-10 mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-[#7c354d] sm:px-8">
          <span>Crafted with pink roses &amp; love for USHA</span>

          <div
            className="flex items-center gap-1 rounded-xl border border-rose-200/70 bg-white/75 p-1 backdrop-blur-sm"
            role="group"
            aria-label="Background particle style"
          >
            {(
              [
                { id: 'hearts', label: 'Hearts' },
                { id: 'petals', label: 'Petals' },
                { id: 'starlight', label: 'Sparkles' },
              ] as const
            ).map((modeItem) => (
              <button
                key={modeItem.id}
                type="button"
                onClick={() => setParticleMode(modeItem.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 whitespace-nowrap shrink-0 ${
                  particleMode === modeItem.id
                    ? 'bg-rose-600 text-white'
                    : 'text-[#6b283f] hover:bg-rose-100/70'
                }`}
              >
                {modeItem.label}
              </button>
            ))}
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
