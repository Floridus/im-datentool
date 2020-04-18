import React, { useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import './BattleCalculator.scss';

import { areTheseObjectsEqual } from '../../utils/functions';
import Error from '../Error/Error';
import BattleCalculatorSpyImport from './BattleCalculatorSpyImport';
import CustomTooltip from '../CustomTooltip/CustomTooltip';

function BattleCalculator () {
  const [isWave, setIsWave] = useState(true);

  // ship values are the same for attacking and defending
  const shipValues = {
    ksk: 990 + 100, // cannon development 10 * 10
    ksg: 2454 + 100, // cannon development 10 * 10
    kb: 7272 + 100, // cannon development 10 * 10
    kbg: 12232 + 100, // cannon development 10 * 10
    hb: 29356 + 100, // cannon development 10 * 10
  };
  const attackValues = {
    ...{
      es: 9,
      sp: 22 + 10, // spear development 10
      bs: 46 + 10, // bow development 10
      sk: 80 + 10, // sword development 10
    },
    ...shipValues,
  };
  const defenseValues = {
    ...{
      es: 9 + 10, // defense development 10
      sp: 22 + 6 + 10, // spear and defense development 10
      bs: 46 + 10 + 10, // bow and defense development 10
      sk: 80 + 10 + 10, // sword and defense development 10
    },
    ...shipValues,
    ...{
      al: 6972 + 100, // cannon development 10 * 10
    },
  };
  const startUnits = { es: 0, sp: 0, bs: 0, sk: 0 };
  const [offenseUnits, setOffenseUnits] = useState(startUnits);
  const [defenseUnits, setDefenseUnits] = useState({
    ...startUnits,
    ...{ wt: 0, sm: 0, hh: 0 },
  });
  const startShipUnits = { ksk: 0, ksg: 0, kb: 0, kbg: 0, hb: 0 };
  const [offenseShipUnits, setOffenseShipUnits] = useState(startShipUnits);
  const [defenseShipUnits, setDefenseShipUnits] = useState({
    ...startShipUnits,
    ...{ al: 0 },
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

  const handleShipChange = (event) => {
    const { name, value } = event.target;
    let parsedValue = parseInt(value);

    if (name.includes('attack')) {
      const newShips = {};
      newShips[name.replace('attack', '')
      .toLowerCase()] = parsedValue;

      setOffenseShipUnits({ ...offenseShipUnits, ...newShips });
    } else if (name.includes('defend')) {
      const code = name.replace('defend', '')
      .toLowerCase();

      if (code === 'al') {
        if (parsedValue > 20)
          parsedValue = 20;
        else if (parsedValue < 0)
          parsedValue = 0;
      }

      const newShips = {};
      newShips[code] = parsedValue;

      setDefenseShipUnits({ ...defenseShipUnits, ...newShips });
    }
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

  const shipForm = [
    { code: 'KSk', name: 'Kriegsschiffe (klein)', research: 'Kanonen Forschung 10' },
    { code: 'KSg', name: 'Kriegsschiffe (groß)', research: 'Kanonen Forschung 10' },
    { code: 'KB', name: 'Kanonenschiffe', research: 'Kanonen Forschung 10' },
    { code: 'KBg', name: 'Kanonenschiffe (groß)', research: 'Kanonen Forschung 10' },
    { code: 'HB', name: 'Hafenbrecher', research: 'Kanonen Forschung 10' },
  ];

  const defenseShipForm = shipForm.concat([
    { code: 'AL', name: 'Auslieger', research: 'Kanonen Forschung 10' },
  ]);

  const offenseForm = [
    { code: 'ES', name: 'Einfache Soldaten' },
    { code: 'SP', name: 'Speerträger', research: 'Speer Forschung 10' },
    { code: 'BS', name: 'Bogenschützen', research: 'Bogen Forschung 10' },
    { code: 'SK', name: 'Schwertkämpfer', research: 'Schwert Forschung 10' },
  ];

  const defenseForm = [
    { code: 'HH', name: 'Haupthaus', research: 'Abwehr Forschung 10' },
    { code: 'SM', name: 'Steinmauer', research: 'Abwehr Forschung 10' },
    { code: 'WT', name: 'Wachturm', research: 'Abwehr Forschung 10' },
  ].concat(offenseForm);

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={4}>
            <h3>Angreifer</h3>
            <b>Seeschlacht</b>
            {shipForm.map(offenseShipFormGroup => {
              let value = offenseShipUnits[offenseShipFormGroup.code.toLowerCase()];
              if (Number.isNaN(value)) // if the number is removed
                value = '';

              return (
                <Form.Group as={Row} key={`OffenseShipKey${offenseShipFormGroup.code}`}>
                  <Form.Label column sm={6}>{offenseShipFormGroup.name}</Form.Label>
                  <Col sm={5}>
                    <Form.Control
                      onChange={handleShipChange}
                      name={`attack${offenseShipFormGroup.code}`}
                      size="sm"
                      type="number"
                      min="0"
                      value={value}
                      placeholder={offenseShipFormGroup.code}
                    />
                  </Col>
                  <Col sm={1} style={{ paddingLeft: 0 }}>
                    <CustomTooltip
                      id={`OffenseShipKey${offenseShipFormGroup.code}`}
                      text={offenseShipFormGroup.research}
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </CustomTooltip>
                  </Col>
                </Form.Group>
              );
            })}
            <div className="areaPlaceholder" />
            <b>Landkampf</b>
            {offenseForm.map(offenseFormGroup => {
              let value = offenseUnits[offenseFormGroup.code.toLowerCase()];
              if (Number.isNaN(value)) // if the number is removed
                value = '';

              return (
                <Form.Group as={Row} key={`OffenseKey${offenseFormGroup.code}`}>
                  <Form.Label column sm={6}>{offenseFormGroup.name}</Form.Label>
                  <Col sm={5}>
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
                  <Col sm={1} style={{ paddingLeft: 0 }}>
                    {offenseFormGroup.research &&
                    <CustomTooltip
                      id={`OffenseKey${offenseFormGroup.code}`}
                      text={offenseFormGroup.research}
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </CustomTooltip>
                    }
                  </Col>
                </Form.Group>
              );
            })}
          </Col>
          <Col sm={4}>
            <h3>Verteidiger</h3>
            <b>Seeschlacht</b>
            {defenseShipForm.map(defenseShipFormGroup => {
              let value = defenseShipUnits[defenseShipFormGroup.code.toLowerCase()];
              if (Number.isNaN(value)) // if the number is removed
                value = '';

              return (
                <Form.Group as={Row} key={`DefenseKey${defenseShipFormGroup.code}`}>
                  <Form.Label column sm={6}>{defenseShipFormGroup.name}</Form.Label>
                  <Col sm={5}>
                    <Form.Control
                      onChange={handleShipChange}
                      name={`defend${defenseShipFormGroup.code}`}
                      size="sm"
                      type="number"
                      min="0"
                      value={value}
                      placeholder={defenseShipFormGroup.code}
                    />
                  </Col>
                  <Col sm={1} style={{ paddingLeft: 0 }}>
                    <CustomTooltip
                      id={`DefenseShipKey${defenseShipFormGroup.code}`}
                      text={defenseShipFormGroup.research}
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </CustomTooltip>
                  </Col>
                </Form.Group>
              );
            })}
            <b>Landkampf</b>
            {defenseForm.map(defenseFormGroup => {
              let value = defenseUnits[defenseFormGroup.code.toLowerCase()];
              if (Number.isNaN(value))
                value = '';

              return (
                <Form.Group as={Row} key={`DefenseKey${defenseFormGroup.code}`}>
                  <Form.Label column sm={6}>{defenseFormGroup.name}</Form.Label>
                  <Col sm={5}>
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
                  <Col sm={1} style={{ paddingLeft: 0 }}>
                    {defenseFormGroup.research &&
                    <CustomTooltip
                      id={`DefenseKey${defenseFormGroup.code}`}
                      text={defenseFormGroup.research.includes('Abwehr') ? defenseFormGroup.research : `Abwehr und ${defenseFormGroup.research}`}
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </CustomTooltip>
                    }
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
        <BattleCalculatorSpyImport
          setDefenseUnits={setDefenseUnits}
          setDefenseShipUnits={setDefenseShipUnits}
        />
      </Form>
    </>
  );
}

export default BattleCalculator;
