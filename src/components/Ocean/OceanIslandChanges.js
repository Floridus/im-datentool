import React from 'react';
import { Table } from 'react-bootstrap';
import moment from 'moment';

import { getAllyCode, text_truncate } from '../../utils/functions';

function OceanIslandChanges (props) {
  const { islandChanges, ocean, allyList } = props;

  return (
    <div className="island-changes">
      <Table striped hover size="sm" responsive variant="dark">
        <thead>
        <tr>
          <th>Insel</th>
          <th>Alter Besitzer</th>
          <th>Alte Ally</th>
          <th>Neuer Besitzer</th>
          <th>Neue Ally</th>
          <th>Zeitpunkt</th>
        </tr>
        </thead>
        <tbody>
        {islandChanges.map((islandChange, index) => {
          const ally = allyList.find(ally => islandChange.newOwner.alliance && ally.code === islandChange.newOwner.alliance.code);

          return (
            <tr
              key={`Ocean${ocean}IslandChange${islandChange.id}`}
              style={ally ? { backgroundColor: ally.color, color: 'white' } : {}}
            >
              <td>{islandChange.island.number}</td>
              <td>{text_truncate(islandChange.oldOwner.name, 14)}</td>
              <td>{text_truncate(getAllyCode(islandChange.oldOwner.alliance, false), 14)}</td>
              <td>{text_truncate(islandChange.newOwner.name, 14)}</td>
              <td>{text_truncate(getAllyCode(islandChange.newOwner.alliance, false), 14)}</td>
              <td>{moment(islandChange.createdAt)
              .format('DD.MM.YYYY HH:mm')}</td>
            </tr>
          );
        })}
        </tbody>
      </Table>
    </div>
  );
}

export default OceanIslandChanges;
