import React from 'react';
import { Table } from 'react-bootstrap';

import { getAllyCode } from '../../utils/functions';

function OceanRanking (props) {
  const { ranking, ocean, allyList } = props;

  return (
    <div className="ranking">
      <Table striped hover size="sm" responsive variant="dark">
        <thead>
        <tr>
          <th>#</th>
          <th>Spieler</th>
          <th>Ally</th>
          <th>Inseln</th>
          <th>Punkte</th>
        </tr>
        </thead>
        <tbody>
        {ranking.map((rank, index) => {
          const ally = allyList.find(ally => rank.player.alliance && ally.code === rank.player.alliance.code);

          return (
            <tr
              key={`Ocean${ocean}Player${rank.player.id}`}
              style={ally ? { backgroundColor: ally.color, color: 'white' } : {}}
            >
              <td>{index + 1}.</td>
              <td>{rank.player.name}</td>
              <td>{getAllyCode(rank.player.alliance, false)}</td>
              <td>{rank.islands}</td>
              <td>{rank.points}</td>
            </tr>
          );
        })}
        </tbody>
      </Table>
    </div>
  );
}

export default OceanRanking;
