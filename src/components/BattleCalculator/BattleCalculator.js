import React, { useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import './BattleCalculator.scss';

import { calculateWaves } from '../../utils/warFunctions';
import Error from '../Error/Error';
import BattleCalculatorSpyImport from './BattleCalculatorSpyImport';
import CustomTooltip from '../CustomTooltip/CustomTooltip';

function BattleCalculator () {
  const [isWave, setIsWave] = useState(true);

  const startUnits = { es: 0, sp: 0, bs: 0, sk: 0 };
  const [offenseUnits, setOffenseUnits] = useState(startUnits);
  const [defenseUnits, setDefenseUnits] = useState({
    ...startUnits,
    ...{ wt: 0, sm: 0, hh: 0 },
  });
  const startShips = { ksk: 0, ksg: 0, kb: 0, kbg: 0, hb: 0 };
  const [offenseShips, setOffenseShips] = useState(startShips);
  const [defenseShips, setDefenseShips] = useState({
    ...startShips,
    ...{ al: 0 },
  });
  const [remainingUnits, setRemainingUnits] = useState(null);
  const [remainingShips, setRemainingShips] = useState(null);
  const [notWorking, setNotWorking] = useState(false);
  const [shipsNotWorking, setShipsNotWorking] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (notWorking)
      setNotWorking(false);
    if (shipsNotWorking)
      setShipsNotWorking(false);

    const [tmpNotWorking, tmpShipsNotWorking, tmpRemainingUnits, tmpRemainingShips] = calculateWaves(isWave, offenseUnits, defenseUnits, offenseShips, defenseShips);

    if (tmpNotWorking)
      setNotWorking(true);
    if (tmpShipsNotWorking)
      setShipsNotWorking(true);

    if (tmpRemainingUnits && tmpRemainingUnits.length > 0)
      setRemainingUnits(tmpRemainingUnits);
    if (tmpRemainingShips && tmpRemainingShips.length > 0)
      setRemainingShips(tmpRemainingShips);
  };

  const handleShipChange = (event) => {
    const { name, value } = event.target;
    let parsedValue = parseInt(value);

    if (name.includes('attack')) {
      const newShips = {};
      newShips[name.replace('attack', '')
      .toLowerCase()] = parsedValue;

      setOffenseShips({ ...offenseShips, ...newShips });
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

      setDefenseShips({ ...defenseShips, ...newShips });
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
              let value = offenseShips[offenseShipFormGroup.code.toLowerCase()];
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
              let value = defenseShips[defenseShipFormGroup.code.toLowerCase()];
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
            {remainingShips &&
            <>
              <b>Seeschlacht</b>
              <Table striped bordered hover size="sm">
                <thead>
                <tr>
                  <th>#</th>
                  <th>KSk</th>
                  <th>KSg</th>
                  <th>KB</th>
                  <th>KBg</th>
                  <th>HB</th>
                  <th>AL</th>
                </tr>
                </thead>
                <tbody>
                {remainingShips.map((remainingShipsWave, index) =>
                  <tr key={`remainingWave${index}`}>
                    <td>{index + 1}.</td>
                    <td>{remainingShipsWave.ksk}</td>
                    <td>{remainingShipsWave.ksg}</td>
                    <td>{remainingShipsWave.kb}</td>
                    <td>{remainingShipsWave.kbg}</td>
                    <td>{remainingShipsWave.hb}</td>
                    <td>{remainingShipsWave.al}</td>
                  </tr>,
                )}
                </tbody>
              </Table>
            </>
            }
            {shipsNotWorking &&
            <Error
              error={{ message: 'Mit den Angreifer See Einheiten kann der Verteidiger auf See nicht bezwungen werden' }}
              title="Kein Durchkommen auf See"
            />
            }
            {remainingUnits &&
            <>
              <b>Landkampf</b>
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
            </>
            }
            {notWorking &&
            <Error
              error={{ message: 'Mit den Angreifer Land Einheiten kann der Verteidiger am Land nicht bezwungen werden' }}
              title="Kein Durchkommen am Land"
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
          setDefenseShips={setDefenseShips}
        />
      </Form>
    </>
  );
}

export default BattleCalculator;
