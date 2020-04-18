import { checkIfUnitsAreDead } from './warFunctions';
import { areTheseObjectsEqual } from './functions';

const attackValues = {
  ksk: 990 + 100, // cannon development 10 * 10
  ksg: 2454 + 100, // cannon development 10 * 10
  kb: 7272 + 100, // cannon development 10 * 10
  kbg: 12232 + 100, // cannon development 10 * 10
  hb: 29356 + 100, // cannon development 10 * 10
};
const defenseValues = {
  ksk: 987 + 100, // cannon development 10 * 10
  ksg: 2452 + 100, // cannon development 10 * 10
  kb: 6198 + 100, // cannon development 10 * 10
  kbg: 12212 + 100, // cannon development 10 * 10
  hb: 21981 + 100, // cannon development 10 * 10
  al: 6972 + 100, // cannon development 10 * 10
};

/**
 *
 * @param ships
 * @param values
 * @returns {number}
 */
export function calculateShips (ships, values) {
  let totalSum = 0;

  Object.keys(ships)
  .map(shipKey => {
    if (ships[shipKey] > 0)
      totalSum += ships[shipKey] * values[shipKey];

    return null;
  });

  if (totalSum === 0)
    totalSum = 1;

  return totalSum;
}

/**
 *
 * @param outrigger
 * @returns {number}
 */
export function calculateOutrigger (outrigger) {
  let outriggerSum = outrigger * defenseValues.al;
  if (outriggerSum === 0)
    outriggerSum = 1;

  return outriggerSum;
}

/**
 * Calculate new attacking naval ship
 *
 * @param ships
 * @param keyShip
 * @param percent
 * @returns {number}
 */
export function calculateAttackerShip (ships, keyShip, percent) {
  const shipSum = ships[keyShip] * attackValues[keyShip];
  return Math.round((shipSum - (shipSum * percent / 100)) / attackValues[keyShip]);
}

/**
 * Calculate new defending naval ship
 *
 * @param ships
 * @param keyShip
 * @param percent
 * @returns {number}
 */
export function calculateDefenderShip (ships, keyShip, percent) {
  return Math.round((ships[keyShip] * defenseValues[keyShip] * percent / 100) / defenseValues[keyShip]);
}

export function checkIfOutriggerAreAlone (ships) {
  let areOutriggerAlone = true;

  Object.keys(ships)
  .map(shipKey => {
    if (shipKey !== 'al' && ships[shipKey] > 0)
      areOutriggerAlone = false;

    return null;
  });

  return areOutriggerAlone;
}

/**
 * Calculate the loses of offense and defense
 *
 * @param attObj
 * @param defObj
 * @param attackSum
 * @param defenseSum
 * @param outriggerSum
 */
export function calculateLoses (attObj, defObj, attackSum, defenseSum, outriggerSum) {
  let attacker = { ...attObj };
  let defender = { ...defObj };

  while (!checkIfUnitsAreDead(attacker) && !checkIfUnitsAreDead(defender)) {
    if (checkIfOutriggerAreAlone(defender)) {
      const percent = (100 / (attackSum + outriggerSum)) * outriggerSum;

      Object.keys(attacker)
      .map(shipKey => {
        attacker[shipKey] = calculateAttackerShip(attacker, shipKey, percent);
        return null;
      });
      defender.al = calculateDefenderShip(defender, 'al', percent);
    } else {
      const percent = (100 / (attackSum + defenseSum)) * defenseSum;

      Object.keys(defender)
      .map(shipKey => {
        if (shipKey !== 'al') {
          defender[shipKey] = calculateDefenderShip(defender, shipKey, percent);
          attacker[shipKey] = calculateAttackerShip(attacker, shipKey, percent);
        }
        return null;
      });
    }
  }

  return defender;
}

/**
 * Calculate offense and defense of all waves
 *
 * @param attacker
 * @param defender
 * @returns {[*, *]}
 */
export function calculateShipWave (attacker, defender) {
  const defenseSum = calculateShips(defender, defenseValues);
  const outriggerSum = calculateOutrigger(defender.al);
  const attackSum = calculateShips(attacker, attackValues);

  return calculateLoses(attacker, defender, attackSum, defenseSum, outriggerSum);
}

/**
 *
 *
 * @param isWave
 * @param offenseShips
 * @param defenseShips
 * @returns {(boolean|[])[]}
 */
export function calculateShipWaves (isWave, offenseShips, defenseShips) {
  const tmpRemainingShips = [];
  let shipsNotWorking = false;
  // if attacker ships are not filled
  if (!checkIfUnitsAreDead(offenseShips)) {
    let wave = 1;
    let defendShips = calculateShipWave(offenseShips, defenseShips);
    tmpRemainingShips.push(defendShips);

    if (isWave) {
      // for each ship wave
      while (!checkIfUnitsAreDead(defendShips)) {
        wave += 1;
        defendShips = calculateShipWave(offenseShips, defendShips);
        // check if the last wave result is the same defender result to break the while loop
        if (tmpRemainingShips.length > 0 && areTheseObjectsEqual(defendShips, tmpRemainingShips[tmpRemainingShips.length - 1])) { // if is the last defenders wave are the same as the defenders now
          shipsNotWorking = true;
          break;
        } else if (wave === 21) { // max 20 waves
          break;
        } else
          tmpRemainingShips.push(defendShips);
      }
    }
  }

  return [shipsNotWorking, tmpRemainingShips];
}