import { useState } from 'react';
import {
  Calendar,
  Check,
  Copy,
  Edit3,
  Heart,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  ACTIVITY_OPTIONS,
  CUSTOMIZATION_BY_ACTIVITY,
  OUTFIT_OPTIONS,
} from '../data/dateOptions';
import { DatePlanState, FlowStep } from '../types/datePlan';
import { formatIsoDatePretty } from './DateStep';
import StepHeader from './StepHeader';

interface ConfirmationStepProps {
  plan: DatePlanState;
  onConfirm: () => void;
  onEditStep: (step: FlowStep) => void;
  onBack: () => void;
  onRestart: () => void;
  onBurst: () => void;
}

export default function ConfirmationStep({
  plan,
  onConfirm,
  onEditStep,
  onBack,
  onRestart,
  onBurst,
}: ConfirmationStepProps) {
  const [copied, setCopied] = useState(false);
  const [roseError, setRoseError] = useState(false);

  const activity = ACTIVITY_OPTIONS.find((a) => a.id === plan.selectedActivityId);
  const detailChoices = plan.selectedActivityId
    ? CUSTOMIZATION_BY_ACTIVITY[plan.selectedActivityId] ?? []
    : [];
  const detailChoice = detailChoices.find((d) => d.id === plan.selectedDetailId);
  const outfit =
    !plan.outfitSkipped && plan.selectedOutfitId
      ? OUTFIT_OPTIONS.find((o) => o.id === plan.selectedOutfitId)
      : null;

  const formattedDate = formatIsoDatePretty(plan.selectedDate);
  const detailDisplay = detailChoice
    ? plan.revealedDetailText
      ? `${detailChoice.emoji} ${detailChoice.title} (${plan.revealedDetailText})`
      : `${detailChoice.emoji} ${detailChoice.title}`
    : 'A sweet surprise';

  const handleConfirmClick = () => {
    onConfirm();
    onBurst();
  };

  const handleCopySummary = async () => {
    const lines = [
      'Our Date Plan for USHA',
      `Date: ${formattedDate || 'To be decided'}`,
      `Activity: ${activity ? `${activity.emoji} ${activity.title}` : 'Date'}`,
      `Preference: ${detailDisplay}`,
      outfit ? `Outfit: ${outfit.emoji} ${outfit.title}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(lines);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      aria-label="Date confirmation summary"
      className="flex w-full justify-center"
    >
      <div className="relative z-10 w-full max-w-2xl rounded-[2rem] border border-rose-200/80 bg-white/92 p-5 shadow-[0_24px_60px_-15px_rgba(190,24,93,0.18)] backdrop-blur-md sm:p-9">
        <StepHeader currentStep="confirmation" onBack={onBack} />

        <div className="flex flex-col items-center text-center">
          <div className="h-24 w-24 overflow-hidden rounded-2xl border border-rose-200 bg-rose-50 shadow-sm">
            {!roseError ? (
              <img
                src="/src/assets/images/pink_rose_keepsake_1795633823269.jpg"
                alt="Soft blush pink garden roses tied with a silk ribbon"
                referrerPolicy="no-referrer"
                onError={() => setRoseError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-rose-50 text-rose-500">
                <Heart className="h-9 w-9 fill-rose-400" />
              </div>
            )}
          </div>

          <h1
            className="mt-5 font-display text-3xl font-semibold tracking-tight text-[#3d0e1e] sm:text-5xl"
            style={{ textWrap: 'balance' }}
          >
            It&apos;s Official, USHA! 💖
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#6b283f] sm:text-base">
            Something special is waiting for us. Let&apos;s make this day a beautiful memory. 🌷
          </p>
        </div>

        {/* Summary Card */}
        <div className="mt-7 divide-y divide-rose-100 rounded-2xl border border-rose-200/80 bg-gradient-to-b from-rose-50/55 to-white px-5 py-2">
          <div className="flex items-center justify-between gap-4 py-3.5">
            <div>
              <p className="text-xs font-medium text-[#8c435b]">Guest of Honor</p>
              <p className="mt-0.5 font-display text-lg font-semibold text-[#3d0e1e]">
                USHA 💗
              </p>
            </div>
            <span className="text-xs font-medium text-rose-700">VIP Invite</span>
          </div>

          <div className="flex items-center justify-between gap-4 py-3.5">
            <div>
              <p className="text-xs font-medium text-[#8c435b]">Selected Date</p>
              <p className="mt-0.5 text-sm font-semibold text-[#3d0e1e] sm:text-base">
                {formattedDate || 'Not selected yet'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onEditStep('date')}
              className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 whitespace-nowrap shrink-0"
            >
              <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
              Edit
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 py-3.5">
            <div>
              <p className="text-xs font-medium text-[#8c435b]">Our Adventure</p>
              <p className="mt-0.5 text-sm font-semibold text-[#3d0e1e] sm:text-base">
                {activity ? `${activity.emoji} ${activity.title}` : 'Not selected yet'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onEditStep('activity')}
              className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 whitespace-nowrap shrink-0"
            >
              <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
              Edit
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 py-3.5">
            <div>
              <p className="text-xs font-medium text-[#8c435b]">
                {activity?.id === 'dinner' ? 'Food & Cuisine Mood' : 'Special Preference'}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-[#3d0e1e] sm:text-base">
                {detailDisplay}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onEditStep('customize')}
              className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 whitespace-nowrap shrink-0"
            >
              <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
              Edit
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 py-3.5">
            <div>
              <p className="text-xs font-medium text-[#8c435b]">Outfit Vibe</p>
              <p className="mt-0.5 text-sm font-semibold text-[#3d0e1e] sm:text-base">
                {outfit
                  ? `${outfit.emoji} ${outfit.title}`
                  : 'Kept as a lovely surprise ✨'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onEditStep('outfit')}
              className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 whitespace-nowrap shrink-0"
            >
              <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
              Edit
            </button>
          </div>
        </div>

        {/* Confirmed Celebration Banner */}
        {plan.confirmed && (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 rounded-2xl border border-rose-300 bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 p-5 text-center"
          >
            <p className="inline-flex items-center gap-2 font-display text-xl font-semibold text-[#3d0e1e]">
              <Sparkles className="h-5 w-5 text-rose-600" aria-hidden="true" />
              Counting down the days until I see you, Usha!
            </p>
            <p className="mt-1.5 text-sm text-[#6b283f]">
              I&apos;ll bring the smiles, the pink roses, and the best mood. All you have to bring is yourself. 💗
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-[#5c1d33] transition-colors hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 whitespace-nowrap shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-rose-600" aria-hidden="true" />
                    Copied Date Plan!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    Copy Plan Summary
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onBurst}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 whitespace-nowrap shrink-0"
              >
                <Heart className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                More Pink Hearts
              </button>
            </div>
          </div>
        )}

        {/* Primary & Secondary Footer Actions */}
        <div className="mt-7 flex flex-col items-center gap-3">
          {!plan.confirmed && (
            <button
              type="button"
              onClick={handleConfirmClick}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 px-8 py-3 text-base font-semibold text-white shadow-[0_12px_28px_-6px_rgba(225,29,72,0.48)] transition-all duration-150 hover:brightness-105 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:w-auto sm:min-w-[250px] whitespace-nowrap shrink-0"
            >
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Confirm Our Date 💕
            </button>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
            <button
              type="button"
              onClick={() => onEditStep('date')}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-[#6b283f] transition-colors hover:bg-rose-50 hover:text-[#3d0e1e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 whitespace-nowrap shrink-0"
            >
              <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
              Edit Selections
            </button>

            <button
              type="button"
              onClick={onRestart}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-[#6b283f] transition-colors hover:bg-rose-50 hover:text-[#3d0e1e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Start Over
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
