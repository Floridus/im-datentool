import React from 'react';
import { Table } from 'react-bootstrap';
import moment from 'moment';
import 'moment/locale/de';

import { getAllyCode, text_truncate } from '../../utils/functions';

function IslandChanges (props) {
  const { islandChanges, allyList } = props;

  return (
    <div className="island-changes">
      <b>Letzten Inselwechsel</b>
      <Table striped hover size="sm" responsive variant="dark">
        <thead>
        <tr>
          <th>Insel</th>
          <th>Alter Besitzer</th>
          <th>Alte Ally</th>
          <th>Neuer Besitzer</th>
          <th>Neue Ally</th>
          <th>Zeitraum</th>
        </tr>
        </thead>
        <tbody>
        {islandChanges.map(islandChange => {
          const ally = allyList.find(ally => islandChange.ally_new && ally.code === islandChange.ally_new);

          return (
            <tr
              key={`IslandChange${islandChange.insel+islandChange.user_old}`}
              style={ally ? { backgroundColor: ally.color, color: 'white' } : {}}
            >
              <td>{islandChange.insel}</td>
              <td>{text_truncate(islandChange.user_old, 14)}</td>
              <td>{text_truncate(getAllyCode(islandChange.ally_old, false), 14)}</td>
              <td>{text_truncate(islandChange.user_new, 14)}</td>
              <td>{text_truncate(getAllyCode(islandChange.ally_new, false), 14)}</td>
              <td>{moment(islandChange.timestamp)
              .format('DD.MM.YYYY HH:mm')}</td>
            </tr>
          );
        })}
        </tbody>
      </Table>
    </div>
  );
}

export default IslandChanges;
