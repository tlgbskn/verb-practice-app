export type VerbStatus = 'new' | 'learning' | 'mastered';

export interface VerbProgress {
  verbId: string;
  verbType: 'irregular' | 'phrasal' | 'stative';
  status: VerbStatus;
  correctCount: number;
  incorrectCount: number;
  lastReviewed: string;
  nextReview: string;
  reviewInterval: number;
}

const STORAGE_KEY = 'english_verbs_progress';

export function getProgress(): Record<string, VerbProgress> {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

export function saveProgress(progress: Record<string, VerbProgress>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getVerbProgress(verbId: string): VerbProgress | null {
  const allProgress = getProgress();
  return allProgress[verbId] || null;
}

export function updateVerbProgress(
  verbId: string,
  verbType: 'irregular' | 'phrasal' | 'stative',
  wasCorrect: boolean
): VerbProgress {
  const allProgress = getProgress();
  const existing = allProgress[verbId];

  const now = new Date().toISOString();
  let newInterval = 1;
  let newStatus: VerbStatus = 'learning';

  if (existing) {
    if (wasCorrect) {
      newInterval = Math.min(existing.reviewInterval * 2, 30);
      const correctCount = existing.correctCount + 1;

      if (correctCount >= 5 && existing.reviewInterval >= 7) {
        newStatus = 'mastered';
      } else {
        newStatus = 'learning';
      }

      const progress: VerbProgress = {
        ...existing,
        status: newStatus,
        correctCount,
        lastReviewed: now,
        nextReview: getNextReviewDate(newInterval),
        reviewInterval: newInterval,
      };

      allProgress[verbId] = progress;
      saveProgress(allProgress);
      return progress;
    } else {
      newInterval = 1;
      const progress: VerbProgress = {
        ...existing,
        status: 'learning',
        incorrectCount: existing.incorrectCount + 1,
        lastReviewed: now,
        nextReview: getNextReviewDate(newInterval),
        reviewInterval: newInterval,
      };

      allProgress[verbId] = progress;
      saveProgress(allProgress);
      return progress;
    }
  } else {
    const progress: VerbProgress = {
      verbId,
      verbType,
      status: wasCorrect ? 'learning' : 'new',
      correctCount: wasCorrect ? 1 : 0,
      incorrectCount: wasCorrect ? 0 : 1,
      lastReviewed: now,
      nextReview: getNextReviewDate(newInterval),
      reviewInterval: newInterval,
    };

    allProgress[verbId] = progress;
    saveProgress(allProgress);
    return progress;
  }
}

export function markVerbAsKnown(verbId: string, verbType: 'irregular' | 'phrasal' | 'stative'): void {
  const allProgress = getProgress();
  const progress: VerbProgress = {
    verbId,
    verbType,
    status: 'mastered',
    correctCount: 5,
    incorrectCount: 0,
    lastReviewed: new Date().toISOString(),
    nextReview: getNextReviewDate(30),
    reviewInterval: 30,
  };

  allProgress[verbId] = progress;
  saveProgress(allProgress);
}

export function resetVerbProgress(verbId: string): void {
  const allProgress = getProgress();
  delete allProgress[verbId];
  saveProgress(allProgress);
}

export function getVerbsDueForReview(): VerbProgress[] {
  const allProgress = getProgress();
  const now = new Date();

  return Object.values(allProgress).filter((progress) => {
    const nextReview = new Date(progress.nextReview);
    return nextReview <= now && progress.status !== 'mastered';
  });
}

export function getStatistics() {
  const allProgress = getProgress();
  const progressArray = Object.values(allProgress);

  const newCount = progressArray.filter((p) => p.status === 'new').length;
  const learningCount = progressArray.filter((p) => p.status === 'learning').length;
  const masteredCount = progressArray.filter((p) => p.status === 'mastered').length;
  const dueForReview = getVerbsDueForReview().length;

  const totalCorrect = progressArray.reduce((sum, p) => sum + p.correctCount, 0);
  const totalIncorrect = progressArray.reduce((sum, p) => sum + p.incorrectCount, 0);
  const totalAttempts = totalCorrect + totalIncorrect;
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return {
    totalVerbs: progressArray.length,
    newCount,
    learningCount,
    masteredCount,
    dueForReview,
    accuracy,
    totalCorrect,
    totalIncorrect,
  };
}

function getNextReviewDate(intervalDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + intervalDays);
  return date.toISOString();
}
