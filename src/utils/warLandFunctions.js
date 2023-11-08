import { areTheseObjectsEqual } from './functions';
import { checkIfUnitsAreDead, setAllUnitsToZero } from './warFunctions';

const attackValues = {
  es: 7, // random value between 7 and 11
  sp: 20 + 10, // spear development 10 + random value between 20 and 24
  bs: 44 + 10, // bow development 10 + random value between 44 and 48
  sk: 78 + 10, // sword development 10 + random value between 78 and 82
};
const defenseValues = {
  es: 11 + 10, // defense development 10 + random value between 7 and 11
  sp: 24 + 10 + 10, // spear and defense development 10 + random value between 20 and 24
  bs: 48 + 10 + 10, // bow and defense development 10 + random value between 44 and 48
  sk: 82 + 10 + 10, // sword and defense development 10 + random value between 78 and 82
};

/**
 * Calculate the total defense sum of main house and all units + stone wall + watch tower
 * 50 is the development defense level 10 * 5
 *
 * @returns {[number, number]}
 */
export function calculateDefense (units) {
  let defenseSum = 0;
  let mainHouseSum = 0;

  Object.keys(units)
  .map((defenseUnit, index) => {
    if (units[defenseUnit] > 0) {
      if (index < 4) {
        defenseSum += units[defenseUnit] * defenseValues[defenseUnit];
      } else if (index === 4) { // watchTower
        const watchTower = units[defenseUnit];
        defenseSum += units[defenseUnit] * getBuildingValue(watchTower, 1);
      } else {
        const unitValue = units[defenseUnit];
        const totalValue = units[defenseUnit] * getBuildingValue(unitValue, 5);
        if (index === 5) // stone wall
          defenseSum += totalValue;
        else if (index === 6) // main house
          mainHouseSum += totalValue;
      }
    }

    return null;
  });

  // if the ground value of the island is to low, then the island will get a standard defensive value
  if ((defenseSum + mainHouseSum) < 1500) { // random value between 800 and 1500
    defenseSum += 2500 + 50; // random value between 1500 and 2500
  }

  if (defenseSum === 0)
    defenseSum = 1;

  return [defenseSum, mainHouseSum];
}

/**
 * Main house and stone wall have multiplier 5
 * Watch tower has multiplier 1
 * 50 is the development defense level 10 * 5
 *
 * @param level
 * @param multiplier
 * @returns {number}
 */
export function getBuildingValue (level, multiplier) {
  return 1 + ((level * multiplier) * level) + 50;
}

/**
 * Calculate the total offense sum value
 *
 * @param units
 * @returns {number}
 */
export function calculateOffense (units) {
  let attackSum = 0;

  Object.keys(units)
  .map(offenseUnit => {
    if (units[offenseUnit] > 0)
      attackSum += units[offenseUnit] * attackValues[offenseUnit];

    return null;
  });

  if (attackSum === 0)
    attackSum = 1;

  return attackSum;
}

/**
 * Calculate new land unit
 *
 * @param units
 * @param keyUnit
 * @param sum
 * @param value
 * @returns {number}
 */
export function calculateNewUnit (units, keyUnit, sum, value) {
  if (['es', 'sp', 'bs', 'sk'].includes(keyUnit)) {
    return Math.round((value * ((units[keyUnit] * defenseValues[keyUnit]) * 100 / sum) / 100) / defenseValues[keyUnit]);
  } else {
    const multiplier = keyUnit === 'wt' ? 1 : 5;
    return Math.round((value * ((units[keyUnit] * getBuildingValue(units[keyUnit], multiplier)) * 100 / sum) / 100) / getBuildingValue(units[keyUnit], multiplier));
  }
}

/**
 * Calculate the loses of offense and defense
 *
 * @param attObj
 * @param defObj
 * @param attackSum
 * @param defenseSum
 * @param mainHouseSum
 */
export function calculateLoses (attObj, defObj, attackSum, defenseSum, mainHouseSum) {
  let attacker = { ...attObj };
  let defender = { ...defObj };

  const attackerPercent = (100 / (attackSum + defenseSum)) * attackSum;
  const defenderPercent = (100 / (attackSum + defenseSum)) * defenseSum;

  const attackWon = attackerPercent > defenderPercent;
  let value = attackWon ? attackSum - defenseSum : defenseSum - attackSum;

  if (attackWon) { // attacker won
    // set all defending units and buildings without main house to zero
    defender = setAllUnitsToZero(defender, 3);

    // own lose calculation for stone wall and watch tower
    defender.sm = Math.round((defender.sm * getBuildingValue(defender.sm, 5) * defenderPercent / 100) / getBuildingValue(defender.sm, 5));
    defender.wt = Math.round((defender.wt * getBuildingValue(defender.wt, 1) * defenderPercent / 100) / getBuildingValue(defender.wt, 1));

    Object.keys(attacker)
    .map(unit => {
      attacker[unit] = calculateNewUnit(attacker, unit, attackSum, value);

      return null;
    });

    const newAttackSum = calculateOffense(attacker);

    if (newAttackSum > mainHouseSum) { // attacker won
      defender.hh = 0;

      value = newAttackSum - mainHouseSum;

      Object.keys(attacker)
      .map(unit => {
        // attacker[unit] = Math.round(attacker[unit] * value);
        attacker[unit] = calculateNewUnit(attacker, unit, newAttackSum, value);

        return null;
      });
    } else { // defender with main house won
      value = mainHouseSum - newAttackSum;

      defender.hh = calculateNewUnit(defender, 'hh', mainHouseSum, value);

      attacker = setAllUnitsToZero(attacker);
    }

  } else { // defender won
    // set all attacking units to zero
    attacker = setAllUnitsToZero(attacker);

    Object.keys(defender)
    .map((unit, index) => {
      if (index < 6)
        defender[unit] = calculateNewUnit(defender, unit, defenseSum, value);

      return null;
    });
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
export function calculateWave (attacker, defender) {
  const [defenseSum, mainHouseSum] = calculateDefense(defender);
  const attackSum = calculateOffense(attacker);

  return calculateLoses(attacker, defender, attackSum, defenseSum, mainHouseSum);
}

/**
 *
 *
 * @param isWave
 * @param offenseUnits
 * @param defenseUnits
 * @returns {(boolean|[])[]}
 */
export function calculateLandWaves (isWave, offenseUnits, defenseUnits) {
  const tmpRemainingUnits = [];
  let notWorking = false;
  // if attacker units are not filled
  if (!checkIfUnitsAreDead(offenseUnits)) {
    let wave = 1;
    let defender = calculateWave(offenseUnits, defenseUnits);
    tmpRemainingUnits.push(defender);

    if (isWave) {
      while (!checkIfUnitsAreDead(defender)) {
        wave += 1;
        defender = calculateWave(offenseUnits, defender);
        // check if the last wave result is the same defender result to break the while loop
        if (tmpRemainingUnits.length > 0 && areTheseObjectsEqual(defender, tmpRemainingUnits[tmpRemainingUnits.length - 1])) { // if is the last defenders wave are the same as the defenders now
          notWorking = true;
          break;
        } else if (wave === 21) { // max 20 waves
          break;
        } else
          tmpRemainingUnits.push(defender);
      }
    }
  }

  return [notWorking, tmpRemainingUnits];
}