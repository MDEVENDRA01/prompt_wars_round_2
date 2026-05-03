/**
 * @file Leaderboard.tsx
 * @description Real-time leaderboard component displaying top quiz scores from Firebase Firestore.
 */

import { useState, useEffect } from 'react';
import { firestore, isFirebaseConfigured } from '@/firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { QUIZ_LEADERBOARD_LIMIT } from '@/constants';
import { LeaderboardEntry } from '../types';

/**
 * Icons used for the top ranks in the leaderboard.
 */
const LEADERBOARD_RANK_ICONS = ['🥇', '🥈', '🥉', '4th', '5th'];

/**
 * Displays top quiz scores from Firebase Firestore with real-time updates.
 * 
 * @returns {JSX.Element | null} The rendered leaderboard or null if Firebase is not configured.
 */
export const Leaderboard = () => {
  const [leaderboardScores, setLeaderboardScores] = useState<LeaderboardEntry[]>([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState<boolean>(true);

  useEffect(() => {
    // If Firebase is not configured, we cannot fetch the leaderboard
    if (!isFirebaseConfigured || !firestore) {
      setIsLeaderboardLoading(false);
      return;
    }

    const leaderboardQuery = query(
      collection(firestore, 'quizScores'),
      orderBy('score', 'desc'),
      limit(QUIZ_LEADERBOARD_LIMIT)
    );

    /**
     * Set up a real-time listener for the leaderboard scores.
     * This provides immediate updates when new scores are saved.
     */
    const unsubscribeFromFirestore = onSnapshot(
      leaderboardQuery,
      (querySnapshot) => {
        const fetchedScores = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as LeaderboardEntry)
        );
        setLeaderboardScores(fetchedScores);
        setIsLeaderboardLoading(false);
      },
      (subscriptionError) => {
        console.error('Leaderboard subscription error:', subscriptionError);
        setIsLeaderboardLoading(false);
      }
    );

    // Cleanup listener on unmount to prevent memory leaks and redundant network usage
    return () => unsubscribeFromFirestore();
  }, []);

  if (!isFirebaseConfigured) {
    return null;
  }

  return (
    <div className="leaderboard" aria-label="Top quiz scores leaderboard">
      <div className="lb-title">🏆 Top Scores</div>
      
      {isLeaderboardLoading ? (
        <div className="lb-loading" aria-live="polite">Loading leaderboard scores…</div>
      ) : leaderboardScores.length === 0 ? (
        <div className="lb-empty">No scores yet — be the first to test your knowledge!</div>
      ) : (
        <div className="lb-list" role="list">
          {leaderboardScores.map((entry, index) => (
            <div
              key={entry.id}
              className={`lb-row${index === 0 ? ' lb-first' : ''}`}
              role="listitem"
            >
              <span className="lb-rank" aria-label={`Rank ${index + 1}`}>
                {LEADERBOARD_RANK_ICONS[index] || `${index + 1}th`}
              </span>
              <span className="lb-name">{entry.name || 'Anonymous'}</span>
              <span className="lb-score" aria-label={`Score ${entry.score} out of ${entry.total}`}>
                {entry.score}/{entry.total}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

