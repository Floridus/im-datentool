import React, { useState } from 'react';

import './BattleCalculator.scss';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { areTheseObjectsEqual } from '../../utils/functions';
import Error from '../Error/Error';

function BattleCalculator () {
  const [isWave, setIsWave] = useState(true);

  const attackValues = {
    es: 9,
    sp: 22 + 10, // spear development 10
    bs: 46 + 10, // bow development 10
    sk: 80 + 10, // sword development 10
  };
  const defenseValues = {
    es: 9 + 10, // defense development 10
    sp: 22 + 6 + 10, // spear and defense development 10
    bs: 46 + 10 + 10, // bow and defense development 10
    sk: 80 + 10 + 10, // sword and defense development 10
  };
  const startUnits = { es: 0, sp: 0, bs: 0, sk: 0 };
  const [offenseUnits, setOffenseUnits] = useState(startUnits);
  const [defenseUnits, setDefenseUnits] = useState({
    ...startUnits,
    ...{ wt: 0, sm: 0, hh: 0 },
  });
  const [remainingUnits, setRemainingUnits] = useState(null);
  const [notWorking, setNotWorking] = useState(false);

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

    if (defenseSum === 0)
      defenseSum = 1;

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
    console.log('getBuildingValue', level, multiplier);
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

    if (attackSum === 0)
      attackSum = 1;

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

  const calculateNewUnit = (units, keyUnit, sum, value) => {
    if (['es', 'sp', 'bs', 'sk'].includes(keyUnit)) {
      return Math.round((value * ((units[keyUnit] * defenseValues[keyUnit]) * 100 / sum) / 100) / defenseValues[keyUnit]);
    } else {
      const multiplier = keyUnit === 'wt' ? 1 : 5;
      return Math.round((value * ((units[keyUnit] * getBuildingValue(units[keyUnit], multiplier)) * 100 / sum) / 100) / getBuildingValue(units[keyUnit], multiplier));
    }
  };

  /**
   * Calculate the loses of offense and defense
   *
   * @param attObj
   * @param defObj
   * @param attackSum
   * @param defenseSum
   * @param mainHouseSum
   */
  const calculateLoses = (attObj, defObj, attackSum, defenseSum, mainHouseSum) => {
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

    return [attacker, defender];
  };

  /**
   * Calculate offense and defense of all waves
   *
   */
  const calculateWave = (attacker, defender) => {
    console.log('start', defender);
    const [defenseSum, mainHouseSum] = calculateDefense(defender);
    const attackSum = calculateOffense(attacker);

    return calculateLoses(attacker, defender, attackSum, defenseSum, mainHouseSum);
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
    let wave = 1;
    let [attacker, defender] = calculateWave(offenseUnits, defenseUnits);
    tmpRemainingUnits.push(defender);

    if (isWave) {
      while (!checkIfUnitsAreDead(defender)) {
        wave += 1;
        [attacker, defender] = calculateWave(offenseUnits, defender);
        // check if the last wave result is the same defender result to break the while loop
        if (tmpRemainingUnits.length > 0 && areTheseObjectsEqual(defender, tmpRemainingUnits[tmpRemainingUnits.length - 1])) { // if is the last defenders wave are the same as the defenders now
          setNotWorking(true);
          break;
        } else if (wave === 21) { // max 20 waves
          break;
        } else
          tmpRemainingUnits.push(defender);
      }
    }
    setRemainingUnits(tmpRemainingUnits);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (notWorking)
      setNotWorking(false);
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

  const defenseForm = [
    { code: 'HH', name: 'Haupthaus' },
    { code: 'SM', name: 'Steinmauer' },
    { code: 'WT', name: 'Wachturm' },
  ].concat(offenseForm);

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
          <Col sm={4}>
            {remainingUnits &&
            <Table striped bordered hover size="sm">
              <thead>
              <tr>
                <th>#</th>
                <th>HH</th>
                <th>SM</th>
                <th>WT</th>
                <th>ES</th>
                <th>SP</th>
                <th>BS</th>
                <th>SK</th>
              </tr>
              </thead>
              <tbody>
              {remainingUnits.map((remainingUnitsWave, index) =>
                <tr key={`remainingWave${index}`}>
                  <td>{index + 1}.</td>
                  <td>{remainingUnitsWave.hh}</td>
                  <td>{remainingUnitsWave.sm}</td>
                  <td>{remainingUnitsWave.wt}</td>
                  <td>{remainingUnitsWave.es}</td>
                  <td>{remainingUnitsWave.sp}</td>
                  <td>{remainingUnitsWave.bs}</td>
                  <td>{remainingUnitsWave.sk}</td>
                </tr>,
              )}
              </tbody>
            </Table>
            }
            {notWorking &&
            <Error
              error={{ message: 'Mit den Angreifer Einheiten kann der Verteidiger nicht bezwungen werden' }}
              title="Kein Durchkommen"
            />
            }
          </Col>
        </Row>

        <Form.Group>
          <Form.Check
            type={'checkbox'}
            id={`wave-calculation`}
            label="Wellenberechnung"
            checked={isWave}
            value={isWave}
            onChange={() => setIsWave(!isWave)}
          />
        </Form.Group>

        <Button variant="dark" type="submit">
          Berechnen
        </Button>
      </Form>
    </>
  );
}

export default BattleCalculator;
