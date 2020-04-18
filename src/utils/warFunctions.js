import { calculateLandWaves } from './warLandFunctions';
import { calculateShipWaves } from './warNavalFunctions';

/**
 * Set all units to zero (until max index, if it is set)
 *
 * @param units
 * @param maxIndex
 * @returns {*}
 */
export function setAllUnitsToZero (units, maxIndex = null) {
  Object.keys(units)
  .map((unit, index) => {
    if ((maxIndex !== null && index <= maxIndex) || maxIndex === null)
      units[unit] = 0;
    return null;
  });

  return units;
}

/**
 * Check if units are dead (= 0)
 *
 * @param units
 * @returns {boolean}
 */
export function checkIfUnitsAreDead (units) {
  let unitsAreDead = true;

  Object.keys(units)
  .map(unit => {
    if (units[unit] > 0)
      unitsAreDead = false;

    return null;
  });

  return unitsAreDead;
}

export function calculateWaves (isWave, offenseUnits, defenseUnits, offenseShips, defenseShips) {
  const [shipsNotWorking, remainingShips] = calculateShipWaves(isWave, offenseShips, defenseShips);
  const [notWorking, remainingUnits] = calculateLandWaves(isWave, offenseUnits, defenseUnits);

  return [notWorking, shipsNotWorking, remainingUnits, remainingShips];
}