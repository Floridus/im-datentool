import React, { useState } from 'react';

import './BattleCalculator.scss';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { areTheseObjectsEqual } from '../../utils/functions';

function BattleCalculator () {
  const [isWave, setIsWave] = useState(false);

  const attackValues = {
    es: 9,
    sp: 32,
    bs: 56,
    sk: 90,
  };
  const defenseValues = {
    es: 19,
    sp: 42,
    bs: 66,
    sk: 100,
  };
  const [offenseUnits, setOffenseUnits] = useState({
    es: 0,
    sp: 0,
    bs: 0,
    sk: 0,
  });
  const [defenseUnits, setDefenseUnits] = useState({
    es: 0,
    sp: 0,
    bs: 0,
    sk: 0,
    wt: 0,
    sm: 0,
    hh: 0,
  });
  const [remainingUnits, setRemainingUnits] = useState(null);

  /**
   * Calculate the total defense sum of main house and all units + stone wall + watch tower
   * 50 is the development defense level 10 * 5
   *
   * @returns {[number, number]}
   */
  const calculateDefense = (units) => {
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

    return [defenseSum, mainHouseSum];
  };

  /**
   * Main house and stone wall have multiplier 5
   * Watch tower has multiplier 1
   * 50 is the development defense level 10 * 5
   *
   * @param level
   * @param multiplier
   * @returns {number}
   */
  const getBuildingValue = (level, multiplier) => {
    return 1 + ((level * multiplier) * level) + 50;
  };

  /**
   * Calculate the total offense sum value
   *
   * @param units
   * @returns {number}
   */
  const calculateOffense = (units) => {
    let attackSum = 0;

    Object.keys(units)
    .map(offenseUnit => {
      if (units[offenseUnit] > 0)
        attackSum += units[offenseUnit] * attackValues[offenseUnit];

      return null;
    });

    return attackSum;
  };

  const setAllUnitsToZero = (units, maxIndex = null) => {
    Object.keys(units)
    .map((unit, index) => {
      if ((maxIndex !== null && index <= maxIndex) || maxIndex === null)
        units[unit] = 0;
      return null;
    });

    return units;
  };

  /**
   * Calculate the loses of offense and defense
   *
   * @param attackSum
   * @param defenseSum
   * @param mainHouseSum
   */
  const calculateLoses = (attackSum, defenseSum, mainHouseSum) => {
    let attacker = { ...offenseUnits };
    let defender = { ...defenseUnits };

    const hasDefenderWon = defenseSum > attackSum;

    let value = hasDefenderWon ? (attackSum / defenseSum) : 1 - (defenseSum / attackSum);

    if (!hasDefenderWon) {
      // set all defending units and buildings without main house to zero
      defender = setAllUnitsToZero(defender, 3);
      // own lose calculation for stone wall and watch tower
      const defensePercent = (100 / (attackSum + defenseSum)) * defenseSum;
      defender.sm = Math.round(defender.sm * (defensePercent / 100));
      defender.wt = Math.round(defender.wt * (defensePercent / 100));

      const newAttackSum = Math.round(attackSum * value);

      if (newAttackSum > mainHouseSum) { // attacker won
        defender.hh = 0;
        if (value === 1) // if no defense units or buildings without main house are there
          value = 1 - (mainHouseSum / attackSum);

        Object.keys(attacker)
        .map(unit => {
          attacker[unit] = Math.round(attacker[unit] * value);

          return null;
        });
      } else { // defender with main house won
        value = newAttackSum / mainHouseSum;

        defender.hh -= Math.round(defenseUnits.hh * value);

        attacker = setAllUnitsToZero(attacker);
      }

    } else {
      // set all attacking units to zero
      attacker = setAllUnitsToZero(attacker);

      Object.keys(defender)
      .map((unit, index) => {
        if (index < 6)
          defender[unit] -= Math.round(defender[unit] * value);

        return null;
      });
    }

    return [attacker, defender];
  };

  /**
   * Calculate offense and defense of all waves
   *
   */
  const calculateWave = (attacker, defender) => {
    const [defenseSum, mainHouseSum] = calculateDefense(defender);
    const attackSum = calculateOffense(attacker);

    return calculateLoses(attackSum, defenseSum, mainHouseSum);
  };

  const checkIfUnitsAreDead = (units) => {
    let unitsAreDead = true;

    Object.keys(units)
    .map(unit => {
      if (units[unit] > 0)
        unitsAreDead = false;

      return null;
    });

    return unitsAreDead;
  };

  const calculateWaves = () => {
    const tmpRemainingUnits = [];
    let [attacker, defender] = calculateWave(offenseUnits, defenseUnits);
    tmpRemainingUnits.push(defender);

    if (isWave) {
      while (!checkIfUnitsAreDead(defender)) {
        [attacker, defender] = calculateWave(offenseUnits, defender);
        // check if the last wave result is the same defender result to break the while loop
        if (tmpRemainingUnits.length > 0 && areTheseObjectsEqual(defender, tmpRemainingUnits[tmpRemainingUnits.length - 1])) {
          break;
        } else
          tmpRemainingUnits.push(defender);
      }
    }
    setRemainingUnits(tmpRemainingUnits);

    console.log(tmpRemainingUnits);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    calculateWaves();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let parsedValue = parseInt(value);

    if (name.includes('attack')) {
      const newUnits = {};
      newUnits[name.replace('attack', '')
      .toLowerCase()] = parsedValue;

      setOffenseUnits({ ...offenseUnits, ...newUnits });
    } else if (name.includes('defend')) {
      const code = name.replace('defend', '')
      .toLowerCase();

      if (code === 'hh' || code === 'wt' || code === 'sm') {
        if (parsedValue > 20)
          parsedValue = 20;
        else if (parsedValue < 0)
          parsedValue = 0;
      }

      const newUnits = {};
      newUnits[code] = parsedValue;

      setDefenseUnits({ ...defenseUnits, ...newUnits });
    }
  };

  const offenseForm = [
    { code: 'ES', name: 'Einfache Soldaten' },
    { code: 'SP', name: 'Speerträger' },
    { code: 'BS', name: 'Bogenschützen' },
    { code: 'SK', name: 'Schwertkämpfer' },
  ];

  const defenseForm = offenseForm.concat([
    { code: 'HH', name: 'Haupthaus' },
    { code: 'SM', name: 'Steinmauer' },
    { code: 'WT', name: 'Wachturm' },
  ]);

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={4}>
            <h3>Angreifer</h3>
            {offenseForm.map(offenseFormGroup => {
              let value = offenseUnits[offenseFormGroup.code.toLowerCase()];
              if (Number.isNaN(value)) // if the number is removed
                value = '';

              return (
                <Form.Group as={Row} key={`OffenseKey${offenseFormGroup.code}`}>
                  <Form.Label column sm={6}>{offenseFormGroup.name}</Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      onChange={handleChange}
                      name={`attack${offenseFormGroup.code}`}
                      size="sm"
                      type="number"
                      min="0"
                      value={value}
                      placeholder={offenseFormGroup.code}
                    />
                  </Col>
                </Form.Group>
              );
            })}
            <Form.Group>
              <Form.Check
                type={'checkbox'}
                id={`wave-calculation`}
                label="Wellenberechnung"
                value={isWave}
                onChange={() => setIsWave(!isWave)}
              />
            </Form.Group>
          </Col>
          <Col sm={4}>
            <h3>Verteidiger</h3>
            {defenseForm.map(defenseFormGroup => {
              let value = defenseUnits[defenseFormGroup.code.toLowerCase()];
              if (Number.isNaN(value))
                value = '';

              return (
                <Form.Group as={Row} key={`DefenseKey${defenseFormGroup.code}`}>
                  <Form.Label column sm={6}>{defenseFormGroup.name}</Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      onChange={handleChange}
                      name={`defend${defenseFormGroup.code}`}
                      size="sm"
                      type="number"
                      min="0"
                      value={value}
                      placeholder={defenseFormGroup.code}
                    />
                  </Col>
                </Form.Group>
              );
            })}
          </Col>
        </Row>

        <Button variant="primary" type="submit">
          Calculate
        </Button>
      </Form>
    </>
  );
}

export default BattleCalculator;
