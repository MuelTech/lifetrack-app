import { LifestyleStatus, MealQuality, StressLevel } from '@prisma/client';
import type { Log } from '@prisma/client';

export class PatternDetectionEngine {
  // Weights (Wi) based on our lifetrack_cleaned_dataset.csv analysis
  private static WEIGHTS = {
    sleep: 0.35,
    study: 0.35,
    activity: 0.20,
    nutrition: 0.05,
    screenTime: 0.05,
  };

  /**
   * Evaluates the recent logs using the Normalized Weighted Scoring Method (Ni * Wi)
   * @param recentLogs The last 4 daily logs (including today)
   * @param currentLog Today's log
   * @returns { status, patterns }
   */
  public static evaluate(recentLogs: Log[], currentLog: Log): { status: LifestyleStatus, patterns: string[] } {
    if (recentLogs.length === 0) {
      return { status: LifestyleStatus.BALANCED, patterns: [] };
    }

    const patterns: Set<string> = new Set();

    // Calculate rolling averages
    const avgSleep = recentLogs.reduce((sum, log) => sum + log.sleepHours, 0) / recentLogs.length;
    const avgStudy = recentLogs.reduce((sum, log) => sum + log.studyHours, 0) / recentLogs.length;
    const avgActivity = recentLogs.reduce((sum, log) => sum + log.activityDuration, 0) / recentLogs.length;
    const avgWater = recentLogs.reduce((sum, log) => sum + log.waterCups, 0) / recentLogs.length;
    const avgScreen = recentLogs.reduce((sum, log) => sum + log.screenTimeHours, 0) / recentLogs.length;

    let badMealsCount = 0;
    recentLogs.forEach(log => {
      if (log.breakfast === MealQuality.JUNK || log.breakfast === MealQuality.SKIPPED) badMealsCount++;
      if (log.lunch === MealQuality.JUNK || log.lunch === MealQuality.SKIPPED) badMealsCount++;
      if (log.dinner === MealQuality.JUNK || log.dinner === MealQuality.SKIPPED) badMealsCount++;
    });

    // ==========================================
    // Step 1: Data Normalization (Ni: 1 to 5)
    // ==========================================

    // 1. Sleep Ni (Healthy >= 8.0, High Risk <= 6.0)
    let nSleep = 3;
    if (avgSleep >= 8.0) nSleep = 1;
    else if (avgSleep >= 7.5) nSleep = 2;
    else if (avgSleep >= 7.0) nSleep = 3;
    else if (avgSleep >= 6.5) nSleep = 4;
    else nSleep = 5;

    if (nSleep >= 4) patterns.add('Sleep Deprivation');

    // 2. Study Ni (Healthy <= 5.5, High Risk >= 8.4)
    let nStudy = 3;
    if (avgStudy <= 5.5) nStudy = 1;
    else if (avgStudy <= 6.5) nStudy = 2;
    else if (avgStudy <= 7.5) nStudy = 3;
    else if (avgStudy <= 8.3) nStudy = 4;
    else nStudy = 5;

    if (nStudy >= 4) patterns.add('High Stress Alert'); // Overworking directly correlates to high stress

    // 3. Activity Ni (Healthy >= 115, High Risk <= 105)
    let nActivity = 3;
    if (avgActivity >= 115) nActivity = 1;
    else if (avgActivity >= 110) nActivity = 3;
    else nActivity = 5;

    if (nActivity >= 4) patterns.add('Sedentary Lifestyle');

    // 4. Nutrition Ni
    let nNutrition = 3;
    if (badMealsCount <= 1 && avgWater >= 8) nNutrition = 1;
    else if (badMealsCount >= 4 || avgWater < 5) nNutrition = 5;
    
    if (badMealsCount >= 4) patterns.add('Poor Nutrition');
    if (avgWater < 5) patterns.add('Dehydration Trend');

    // 5. Screen Time Ni (from baseline)
    let nScreen = 3;
    if (avgScreen <= 3.5) nScreen = 1;
    else if (avgScreen >= 5.0) nScreen = 5;

    if (nScreen >= 4 || (avgStudy + avgScreen) > 8.0) patterns.add('Excessive Screen Time');

    // ==========================================
    // Step 2: Weighted Risk Formula
    // ==========================================
    
    // Sm (Academic Stress Modifier) is defaulted to 1.0 per system requirements (no exam logs)
    const Sm = 1.0;

    const totalScore = (
      (nSleep * this.WEIGHTS.sleep) +
      (nStudy * this.WEIGHTS.study) +
      (nActivity * this.WEIGHTS.activity) +
      (nNutrition * this.WEIGHTS.nutrition) +
      (nScreen * this.WEIGHTS.screenTime)
    ) * Sm;

    // Daily Real-Time Stress Override
    if (currentLog.stressLevel === StressLevel.HIGH) {
      patterns.add('High Stress Alert');
    }

    // ==========================================
    // Step 3: Status Classification
    // ==========================================
    let status: LifestyleStatus = LifestyleStatus.BALANCED;
    
    if (totalScore >= 4.0) {
      status = LifestyleStatus.UNHEALTHY_PATTERN_DETECTED;
    } else if (totalScore >= 2.5) {
      status = LifestyleStatus.NEEDS_IMPROVEMENT;
    }

    // Edge case: User reported HIGH stress today but averages are balanced
    if (currentLog.stressLevel === StressLevel.HIGH && status === LifestyleStatus.BALANCED) {
      status = LifestyleStatus.NEEDS_IMPROVEMENT;
    }

    return { 
      status, 
      patterns: Array.from(patterns) 
    };
  }
}
