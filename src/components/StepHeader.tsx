import { ArrowLeft } from 'lucide-react';
import { FlowStep } from '../types/datePlan';

const STEP_ORDER: FlowStep[] = [
  'date',
  'activity',
  'customize',
  'outfit',
  'confirmation',
];

const STEP_LABELS: Record<Exclude<FlowStep, 'landing'>, string> = {
  date: 'Date',
  activity: 'Activity',
  customize: 'Details',
  outfit: 'Outfit',
  confirmation: 'Confirm',
};

interface StepHeaderProps {
  currentStep: Exclude<FlowStep, 'landing'>;
  onBack: () => void;
}

export default function StepHeader({ currentStep, onBack }: StepHeaderProps) {
  const activeIndex = STEP_ORDER.indexOf(currentStep);
  const progressPercent = ((activeIndex + 1) / STEP_ORDER.length) * 100;

  return (
    <div className="mb-6 w-full">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#6b283f] transition-colors hover:bg-rose-100/70 hover:text-[#3d0e1e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-[#7c354d] tabular-nums">
          <span>
            Step {activeIndex + 1} of {STEP_ORDER.length}
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-rose-700">{STEP_LABELS[currentStep]}</span>
        </div>
      </div>

      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-rose-100"
        role="progressbar"
        aria-valuenow={activeIndex + 1}
        aria-valuemin={1}
        aria-valuemax={STEP_ORDER.length}
        aria-label={`Step ${activeIndex + 1} of ${STEP_ORDER.length}: ${STEP_LABELS[currentStep]}`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
