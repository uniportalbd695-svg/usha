import { useState } from 'react';
import { ArrowRight, Check, Shuffle, Sparkles } from 'lucide-react';
import { ACTIVITY_OPTIONS, SURPRISE_POOL } from '../data/dateOptions';
import { ActivityId } from '../types/datePlan';
import StepHeader from './StepHeader';

interface ActivityStepProps {
  selectedActivityId: ActivityId | null;
  onSelectActivity: (id: ActivityId) => void;
  onBack: () => void;
  onContinue: () => void;
  onBurst: () => void;
}

export default function ActivityStep({
  selectedActivityId,
  onSelectActivity,
  onBack,
  onContinue,
  onBurst,
}: ActivityStepProps) {
  const [surprisePreview, setSurprisePreview] = useState<{
    activityId: ActivityId;
    tagline: string;
  } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const rollSurprise = () => {
    setIsSpinning(true);
    onBurst();
    window.setTimeout(() => {
      const pool = SURPRISE_POOL.filter(
        (item) => item.activityId !== surprisePreview?.activityId
      );
      const picked = pool[Math.floor(Math.random() * pool.length)] ?? SURPRISE_POOL[0];
      setSurprisePreview(picked);
      setIsSpinning(false);
    }, 320);
  };

  const handleCardClick = (id: ActivityId) => {
    onSelectActivity(id);
    if (id === 'surprise') {
      rollSurprise();
    }
  };

  const revealedActivityObj = surprisePreview
    ? ACTIVITY_OPTIONS.find((a) => a.id === surprisePreview.activityId)
    : null;

  return (
    <section aria-label="Choose an activity" className="flex w-full justify-center">
      <div className="relative z-10 w-full max-w-3xl rounded-[2rem] border border-rose-200/80 bg-white/90 p-5 shadow-[0_24px_60px_-15px_rgba(190,24,93,0.15)] backdrop-blur-md sm:p-9">
        <StepHeader currentStep="activity" onBack={onBack} />

        <div className="text-center">
          <h1
            className="font-display text-3xl font-semibold tracking-tight text-[#3d0e1e] sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Where Should Our Little Adventure Be? 🌷
          </h1>
          <p className="mx-auto mt-2.5 max-w-lg text-sm leading-relaxed text-[#6b283f] sm:text-base">
            Pick the kind of date that makes you smile most, or let fate surprise you.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIVITY_OPTIONS.map((activity) => {
            const isSelected = selectedActivityId === activity.id;
            const isSurpriseCard = activity.id === 'surprise';

            return (
              <button
                key={activity.id}
                type="button"
                onClick={() => handleCardClick(activity.id)}
                aria-pressed={isSelected}
                className={`group relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/90 shadow-[0_10px_24px_-10px_rgba(225,29,72,0.3)]'
                    : isSurpriseCard
                    ? 'border-rose-200 bg-gradient-to-br from-rose-50/80 to-pink-50/80 hover:border-rose-300 hover:shadow-sm'
                    : 'border-rose-100 bg-white/85 hover:border-rose-300 hover:bg-rose-50/40'
                }`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100/75 text-xl transition-transform duration-150 group-hover:scale-105"
                    aria-hidden="true"
                  >
                    {activity.emoji}
                  </span>
                  {isSelected && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  )}
                </div>

                <span className="mt-3 text-base font-semibold text-[#3d0e1e]">
                  {activity.title}
                </span>
                <span className="mt-1 text-xs leading-relaxed text-[#7c354d]">
                  {activity.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Delightful Surprise Me! interactive reveal panel */}
        {selectedActivityId === 'surprise' && (
          <div
            aria-live="polite"
            className="mt-5 rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 via-white to-pink-50 p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Surprise Date Reveal
                </p>
                {isSpinning ? (
                  <p className="font-display text-lg font-semibold text-[#3d0e1e]">
                    Picking something sweet for Usha...
                  </p>
                ) : revealedActivityObj && surprisePreview ? (
                  <>
                    <p className="font-display text-xl font-semibold text-[#3d0e1e]">
                      {revealedActivityObj.emoji} {revealedActivityObj.title}
                    </p>
                    <p className="text-sm text-[#6b283f]">
                      {surprisePreview.tagline}
                    </p>
                  </>
                ) : null}
              </div>

              {!isSpinning && revealedActivityObj && (
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={rollSurprise}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-[#5c1d33] transition-colors hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 whitespace-nowrap shrink-0"
                  >
                    <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
                    Another Idea
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectActivity(revealedActivityObj.id);
                      onBurst();
                    }}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 whitespace-nowrap shrink-0"
                  >
                    Love This Idea!
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-7 flex flex-col items-center gap-2">
          {!selectedActivityId && (
            <p className="text-xs font-medium text-[#7c354d]">
              Select any adventure card above to continue.
            </p>
          )}
          <button
            type="button"
            disabled={!selectedActivityId}
            onClick={onContinue}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 px-8 py-3 text-base font-semibold text-white shadow-[0_12px_26px_-8px_rgba(225,29,72,0.45)] transition-all duration-150 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:w-auto sm:min-w-[220px] whitespace-nowrap shrink-0"
          >
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
