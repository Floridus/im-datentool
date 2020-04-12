import React from 'react';
import moment from 'moment';
import 'moment/locale/de';
import { Table } from 'react-bootstrap';

import './Changes.scss';
import { getAllyCode, text_truncate } from '../../utils/functions';

function AllianceChanges (props) {
  const { allianceChanges, allyList } = props;

  return (
    <div className="alliance-changes">
      <b>Letzten Allianzwechsel</b>
      <Table striped hover size="sm" responsive variant="dark">
        <thead>
        <tr>
          <th>Spieler</th>
          <th>Alte Ally</th>
          <th>Neue Ally</th>
          <th>Zeitpunkt</th>
        </tr>
        </thead>
        <tbody>
        {allianceChanges.map(allianceChange => {
          const ally = allyList.find(ally => allianceChange.newAlly && ally.code === allianceChange.newAlly.code);

          return (
            <tr
              key={`AllianceChange${allianceChange.id}`}
              style={ally ? { backgroundColor: ally.color, color: 'white' } : {}}
            >
              <td>{text_truncate(allianceChange.player.name, 14)}</td>
              <td>{text_truncate(getAllyCode(allianceChange.oldAlly, false), 14)}</td>
              <td>{text_truncate(getAllyCode(allianceChange.newAlly, false), 14)}</td>
              <td>{moment(allianceChange.createdAt)
              .format('DD.MM.YYYY HH:mm')}</td>
            </tr>
          );
        })}
        </tbody>
      </Table>
    </div>
  );
}

export default AllianceChanges;
