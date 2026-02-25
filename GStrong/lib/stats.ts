import { supabase } from './supabase';

const XP_PER_LEVEL = 600;

export const POINTS = {
  BINGO_SQUARE: 10,
  BINGO_LINE: 50,
  BINGO_FULL_CARD: 200,
  SAVE_WORKOUT: 20,
};

export async function addPoints(userId: string, amount: number) {
  // 1. Get current stats
  const { data: stats, error: fetchError } = await supabase
    .from('user_stats')
    .select('points, xp, level')
    .eq('id', userId)
    .single();

  if (fetchError || !stats) {
    console.error('Failed to fetch user stats:', fetchError);
    return;
  }

  const newPoints = stats.points + amount;
  const newXp = stats.xp + amount;
  const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;

  // 2. Update stats
  const { error: updateError } = await supabase
    .from('user_stats')
    .update({
      points: newPoints,
      xp: newXp,
      level: newLevel,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (updateError) {
    console.error('Failed to update user stats:', updateError);
  }
}

export async function incrementWorkoutsCompleted(userId: string) {
  const { data: stats, error: fetchError } = await supabase
    .from('user_stats')
    .select('workouts_completed')
    .eq('id', userId)
    .single();

  if (fetchError || !stats) return;

  await supabase
    .from('user_stats')
    .update({
      workouts_completed: stats.workouts_completed + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
}

export async function incrementBingoSquares(userId: string) {
  const { data: stats, error: fetchError } = await supabase
    .from('user_stats')
    .select('bingo_squares_completed')
    .eq('id', userId)
    .single();

  if (fetchError || !stats) return;

  await supabase
    .from('user_stats')
    .update({
      bingo_squares_completed: stats.bingo_squares_completed + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
}

export async function getUserStats(userId: string) {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Failed to get user stats:', error);
    return null;
  }
  return data;
}

export function xpForNextLevel(currentXp: number): number {
  const currentLevel = Math.floor(currentXp / XP_PER_LEVEL) + 1;
  return currentLevel * XP_PER_LEVEL - currentXp;
}

export function xpProgressInLevel(currentXp: number): number {
  return currentXp % XP_PER_LEVEL;
}