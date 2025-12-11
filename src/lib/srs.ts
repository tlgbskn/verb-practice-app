/**
 * SuperMemo-2 Algorithm Implementation
 * 
 * Inputs:
 * - quality: 0-5 rating of how well the user remembered the item.
 *   0: Total blackout
 *   1: Incorrect, but remembered after seeing answer
 *   2: Incorrect, but seemed easy
 *   3: Correct, but required difficulty
 *   4: Correct, after hesitation
 *   5: Perfect, immediate recall
 * 
 * - previousInterval: The last interval in days.
 * - repetitions: Number of times accurately recalled in a row.
 * - easeFactor: The "easiness" of the item (starts at 2.5).
 * 
 * Output:
 * - nextInterval: Next interval in days.
 * - nextEaseFactor: New ease factor.
 * - nextRepetitions: New repetition count.
 */

export interface SRSResult {
    nextInterval: number; // In days
    nextEaseFactor: number;
    nextRepetitions: number;
    nextReviewDate: Date;
}

export const INITIAL_EASE_FACTOR = 2.5;

export function calculateSRS(
    quality: number,
    previousInterval: number,
    repetitions: number,
    easeFactor: number
): SRSResult {
    let nextInterval: number;
    let nextRepetitions: number;
    let nextEaseFactor: number;

    if (quality >= 3) {
        // Correct response
        if (repetitions === 0) {
            nextInterval = 1;
        } else if (repetitions === 1) {
            nextInterval = 6;
        } else {
            nextInterval = Math.round(previousInterval * easeFactor);
        }
        nextRepetitions = repetitions + 1;
    } else {
        // Incorrect response - Reset progress
        nextRepetitions = 0;
        nextInterval = 1;
    }

    // Update Ease Factor
    // Formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    nextEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    // Ease Factor cannot drop below 1.3
    if (nextEaseFactor < 1.3) {
        nextEaseFactor = 1.3;
    }

    // Calculate review date
    const nextReviewDate = new Date();
    // Add 'nextInterval' days to current time
    nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);
    // Add a little randomness (fuzz) to prevent "clumping" of reviews if many are due same day
    // (Optional, simplified here to just be clean days)

    return {
        nextInterval,
        nextEaseFactor,
        nextRepetitions,
        nextReviewDate
    };
}
