import { ArrowRight, Check } from 'lucide-react';
import { OUTFIT_OPTIONS } from '../data/dateOptions';
import { OutfitId } from '../types/datePlan';
import StepHeader from './StepHeader';

interface OutfitStepProps {
  selectedOutfitId: OutfitId | null;
  onSelectOutfit: (id: OutfitId) => void;
  onSkip: () => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function OutfitStep({
  selectedOutfitId,
  onSelectOutfit,
  onSkip,
  onBack,
  onContinue,
}: OutfitStepProps) {
  return (
    <section aria-label="Choose an outfit" className="flex w-full justify-center">
      <div className="relative z-10 w-full max-w-3xl rounded-[2rem] border border-rose-200/80 bg-white/90 p-5 shadow-[0_24px_60px_-15px_rgba(190,24,93,0.15)] backdrop-blur-md sm:p-9">
        <StepHeader currentStep="outfit" onBack={onBack} />

        <div className="text-center">
          <h1
            className="font-display text-3xl font-semibold tracking-tight text-[#3d0e1e] sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Now, What Are You Going to Wear? 🎀
          </h1>
          <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-[#6b283f] sm:text-base">
            Let&apos;s find the perfect outfit for our special day.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {OUTFIT_OPTIONS.map((outfit) => {
            const isSelected = selectedOutfitId === outfit.id;

            return (
              <button
                key={outfit.id}
                type="button"
                onClick={() => onSelectOutfit(outfit.id)}
                aria-pressed={isSelected}
                className={`group flex flex-col items-start rounded-2xl border p-4 text-left transition-all duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/90 shadow-[0_10px_24px_-10px_rgba(225,29,72,0.3)]'
                    : 'border-rose-100 bg-white/85 hover:border-rose-300 hover:bg-rose-50/40'
                }`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100/75 text-xl transition-transform duration-150 group-hover:scale-105"
                    aria-hidden="true"
                  >
                    {outfit.emoji}
                  </span>
                  {isSelected && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  )}
                </div>

                <span className="mt-3 text-base font-semibold text-[#3d0e1e]">
                  {outfit.title}
                </span>
                <span className="mt-1 text-xs leading-relaxed text-[#7c354d]">
                  {outfit.description}
                </span>
                <span className="mt-2.5 text-[11px] font-medium text-rose-700">
                  {outfit.vibeNote}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-7 flex flex-col-reverse items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-rose-200 bg-white px-6 py-3 text-sm font-semibold text-[#5c1d33] transition-colors hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:w-auto whitespace-nowrap shrink-0"
          >
            Skip This Step
          </button>

          <button
            type="button"
            disabled={!selectedOutfitId}
            onClick={onContinue}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 px-8 py-3 text-base font-semibold text-white shadow-[0_12px_26px_-8px_rgba(225,29,72,0.45)] transition-all duration-150 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:w-auto sm:min-w-[210px] whitespace-nowrap shrink-0"
          >
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
