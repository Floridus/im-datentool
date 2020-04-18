import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

function BattleCalculatorSpyImport (props) {
  const { setDefenseUnits, setDefenseShips } = props;

  const [show, setShow] = useState(false);
  const [spyText, setSpyText] = useState('');

  const shipUnits = {
    ksk: 0,
    ksg: 0,
    kb: 0,
    kbg: 0,
    hb: 0,
    al: 0,
  };
  const islandUnitsAndBuildings = {
    es: 0,
    sp: 0,
    bs: 0,
    sk: 0,
    wt: 0,
    sm: 0,
    hh: 0,
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleChange = (event) => setSpyText(event.target.value);

  const importSpyText = () => {
    handleClose();

    if (spyText.length > 0) {
      const lines = spyText.split('\n');

      const includeStrings = [
        { name: 'Haupthaus', key: 'hh' },
        { name: 'Wachturm', key: 'wt' },
        { name: 'Steinmauer', key: 'sm' },
        { name: 'Einfache Soldaten', key: 'es' },
        { name: 'Speertraeger', key: 'sp' },
        { name: 'Bogenschuetzen', key: 'bs' },
        { name: 'Schwertkaempfer', key: 'sk' },
      ];
      const includeShipStrings = [
        { name: 'Kriegsschiffe (klein)', key: 'ksk' },
        { name: 'Kriegsschiffe (gross)', key: 'ksg' },
        { name: 'Kanonenschiffe', key: 'kb' },
        { name: 'Kanonenschiffe (gross)', key: 'kbg' },
        { name: 'Hafenbrecher', key: 'hb' },
        { name: 'Auslieger', key: 'al' },
      ];

      let i;
      for (i = 0; i < lines.length; i++) {
        checkIncludeStrings(includeStrings, lines[i], false);
        checkIncludeStrings(includeShipStrings, lines[i], true);
      }

      setDefenseUnits(islandUnitsAndBuildings);
      setDefenseShips(shipUnits);
    }
  };

  const checkIncludeStrings = (includeStrings, line, isShip) => {
    let x;
    for (x = 0; x < includeStrings.length; x++) {
      if (line.includes(includeStrings[x].name)) {
        const arrParts = line.split(' -> ');
        if (isShip)
          shipUnits[includeStrings[x].key] = parseInt(arrParts[1]);
        else
          islandUnitsAndBuildings[includeStrings[x].key] = parseInt(arrParts[1]);
      }
    }
  };

  return (
    <>
      <Button variant="light" className="spyButton" onClick={handleShow}>
        Spionage Bericht einfügen
      </Button>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Spionage Bericht einfügen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Gesamten Spionagebericht kopieren und einfügen</Form.Label>
            <Form.Control as="textarea" rows="16" onChange={handleChange} value={spyText} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={importSpyText}>
            Einfügen
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BattleCalculatorSpyImport;
