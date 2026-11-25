import { ArrowRight, Check, Shuffle, Sparkles } from 'lucide-react';
import { ACTIVITY_OPTIONS, CUSTOMIZATION_BY_ACTIVITY } from '../data/dateOptions';
import { ActivityId } from '../types/datePlan';
import StepHeader from './StepHeader';

interface CustomizeStepProps {
  activityId: ActivityId;
  selectedDetailId: string | null;
  revealedDetailText: string | null;
  onSelectDetail: (detailId: string, revealedText?: string | null) => void;
  onBack: () => void;
  onContinue: () => void;
  onBurst: () => void;
}

export default function CustomizeStep({
  activityId,
  selectedDetailId,
  revealedDetailText,
  onSelectDetail,
  onBack,
  onContinue,
  onBurst,
}: CustomizeStepProps) {
  const activity =
    ACTIVITY_OPTIONS.find((item) => item.id === activityId) ?? ACTIVITY_OPTIONS[0];
  const choices = CUSTOMIZATION_BY_ACTIVITY[activityId] ?? [];
  const selectedChoice = choices.find((c) => c.id === selectedDetailId) ?? null;

  const pickRandomChoice = () => {
    const nonSurprise = choices.filter((c) => !c.isSurprise);
    if (nonSurprise.length === 0) return null;
    const picked = nonSurprise[Math.floor(Math.random() * nonSurprise.length)];
    return picked;
  };

  const handleChoiceClick = (choiceId: string, isSurprise?: boolean) => {
    if (isSurprise) {
      onBurst();
      const picked = pickRandomChoice();
      onSelectDetail(
        choiceId,
        picked ? `${picked.emoji} ${picked.title}` : null
      );
    } else {
      onSelectDetail(choiceId, null);
    }
  };

  return (
    <section
      aria-label={`Customize ${activity.title}`}
      className="flex w-full justify-center"
    >
      <div className="relative z-10 w-full max-w-3xl rounded-[2rem] border border-rose-200/80 bg-white/90 p-5 shadow-[0_24px_60px_-15px_rgba(190,24,93,0.15)] backdrop-blur-md sm:p-9">
        <StepHeader currentStep="customize" onBack={onBack} />

        <div className="text-center">
          <p className="text-sm font-medium text-rose-700">
            {activity.emoji} {activity.title}
          </p>
          <h1
            className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#3d0e1e] sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            {activity.customHeading}
          </h1>
          <p className="mx-auto mt-2.5 max-w-lg text-sm leading-relaxed text-[#6b283f] sm:text-base">
            {activity.customSubheading}
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {choices.map((choice) => {
            const isSelected = selectedDetailId === choice.id;

            return (
              <button
                key={choice.id}
                type="button"
                onClick={() => handleChoiceClick(choice.id, choice.isSurprise)}
                aria-pressed={isSelected}
                className={`group flex flex-col items-start rounded-2xl border p-4 text-left transition-all duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/90 shadow-[0_10px_24px_-10px_rgba(225,29,72,0.3)]'
                    : choice.isSurprise
                    ? 'border-rose-200 bg-gradient-to-br from-rose-50/80 to-pink-50/80 hover:border-rose-300'
                    : 'border-rose-100 bg-white/85 hover:border-rose-300 hover:bg-rose-50/40'
                }`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100/75 text-xl transition-transform duration-150 group-hover:scale-105"
                    aria-hidden="true"
                  >
                    {choice.emoji}
                  </span>
                  {isSelected && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  )}
                </div>

                <span className="mt-3 text-base font-semibold text-[#3d0e1e]">
                  {choice.title}
                </span>
                <span className="mt-1 text-xs leading-relaxed text-[#7c354d]">
                  {choice.description}
                </span>
              </button>
            );
          })}
        </div>

        {selectedChoice?.isSurprise && revealedDetailText && (
          <div
            aria-live="polite"
            className="mt-5 flex flex-col items-start justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 sm:flex-row sm:items-center"
          >
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Surprise Picked for Usha
              </p>
              <p className="mt-0.5 font-display text-lg font-semibold text-[#3d0e1e]">
                {revealedDetailText}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleChoiceClick(selectedChoice.id, true)}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#5c1d33] transition-colors hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 whitespace-nowrap shrink-0"
            >
              <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
              Shuffle Again
            </button>
          </div>
        )}

        <div className="mt-7 flex flex-col items-center gap-2">
          {!selectedDetailId && (
            <p className="text-xs font-medium text-[#7c354d]">
              Choose one of the options above to continue.
            </p>
          )}
          <button
            type="button"
            disabled={!selectedDetailId}
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
