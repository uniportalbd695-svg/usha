export type FlowStep =
  | 'landing'
  | 'date'
  | 'activity'
  | 'customize'
  | 'outfit'
  | 'confirmation';

export type ActivityId =
  | 'dinner'
  | 'picnic'
  | 'arcade'
  | 'beach'
  | 'cafe'
  | 'movie'
  | 'shopping'
  | 'walk'
  | 'creative'
  | 'surprise';

export type OutfitId =
  | 'saree'
  | 'ethnic'
  | 'western'
  | 'casual'
  | 'chic'
  | 'floral'
  | 'glam'
  | 'surprise';

export interface ActivityOption {
  id: ActivityId;
  emoji: string;
  title: string;
  description: string;
  customHeading: string;
  customSubheading: string;
}

export interface CustomizationChoice {
  id: string;
  emoji: string;
  title: string;
  description: string;
  isSurprise?: boolean;
}

export interface OutfitOption {
  id: OutfitId;
  emoji: string;
  title: string;
  description: string;
  vibeNote: string;
}

export interface DatePlanState {
  step: FlowStep;
  selectedDate: string | null;
  selectedActivityId: ActivityId | null;
  selectedDetailId: string | null;
  revealedDetailText: string | null;
  selectedOutfitId: OutfitId | null;
  outfitSkipped: boolean;
  confirmed: boolean;
}
