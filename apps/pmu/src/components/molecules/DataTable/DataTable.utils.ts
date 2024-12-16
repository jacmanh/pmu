import { HorseHistory } from '@pmu/shared';

const calculateDistanceScore = (
  raceDistance: number,
  targetDistance: number
): number => {
  const distanceDiff = Math.abs(raceDistance - targetDistance);
  // En gardant la valeur maximale à 1000 et réduisant proportionnellement
  return Math.max(0, 1000 - distanceDiff); // Plus la distance est proche, plus le score est élevé
};

/**
 * Évalue la performance du cheval sur une distance spécifique.
 * @param raceHistory - Tableau d'historique des courses du cheval
 * @param targetDistance - Distance cible pour l'évaluation
 * @returns Un score de 0 à 100 représentant les performances du cheval sur la distance donnée
 */
export const evaluatePerformanceOnDistance = (
  raceHistory: HorseHistory[],
  targetDistance: number
): number => {
  let totalScore = 0;
  let totalWeight = 0;
  const currentTime = new Date().getTime();

  raceHistory.forEach((record) => {
    const distanceScore = calculateDistanceScore(
      record.race.distance,
      targetDistance
    );
    const timeWeight = calculateRecencyWeight(record.date, currentTime);
    const placeScore = calculatePlaceScore(record.place);

    // Calcul du score total pour ce record
    const recordScore = (distanceScore + placeScore) * timeWeight;
    totalScore += recordScore;
    totalWeight += timeWeight;
  });

  // Moyenne pondérée et normalisation du score sur 100
  const finalScore = totalWeight > 0 ? (totalScore / totalWeight) * 0.1 : 0;
  return Math.min(100, Math.round(finalScore)); // Limite le score à 100
};

/**
 * Calcule un score basé sur la place du cheval dans la course (place basse = meilleur score).
 */
const calculatePlaceScore = (place: number): number => {
  return Math.max(0, 10 - place); // Les premières places reçoivent un score plus élevé
};

/**
 * Calcule un poids basé sur la récence de la course (plus la course est récente, plus le poids est élevé).
 */
const calculateRecencyWeight = (
  dateString: string,
  currentTime: number
): number => {
  const raceTime = new Date(dateString).getTime();
  const timeDiff = currentTime - raceTime;
  return Math.max(1, 1 / (timeDiff / (1000 * 60 * 60 * 24 * 30 * 12))); // Pondération par récence
};

export const evaluatePerformanceOnRope = (
  raceHistory: HorseHistory[],
  targetRope: number
): number => {
  let totalScore = 0;
  let totalWeight = 0;
  const currentTime = new Date().getTime();

  raceHistory.forEach((record) => {
    const ropeScore = calculateRopeScore(record.rope, targetRope);
    const timeWeight = calculateRecencyWeight(record.date, currentTime);
    const placeScore = calculatePlaceScore(record.place);

    const recordScore = (ropeScore + placeScore) * timeWeight;
    totalScore += recordScore;
    totalWeight += timeWeight;
  });

  const finalScore = totalWeight > 0 ? (totalScore / totalWeight) * 10 : 0;
  return Math.min(100, Math.round(finalScore));
};
