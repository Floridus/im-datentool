import React from 'react';
import { Table } from 'react-bootstrap';

import { getAllyCode, getNumberFormat } from '../../utils/functions';

function Ranking (props) {
  const { ranking, allyList } = props;

  return (
    <div className="ranking">
      <b>Besten Spieler</b>
      <Table striped hover size="sm" responsive variant="dark">
        <thead>
        <tr>
          <th>#</th>
          <th>Spieler</th>
          <th>Ally</th>
          <th className="textCenter">Inseln</th>
          <th className="textRight">Punkte</th>
        </tr>
        </thead>
        <tbody>
        {ranking.map((rank, index) => {
          const ally = allyList.find(ally => rank.player.alliance && ally.code === rank.player.alliance.code);

          return (
            <tr
              key={`Player${rank.player.id}`}
              style={ally ? { backgroundColor: ally.color, color: 'white' } : {}}
            >
              <td>{index + 1}.</td>
              <td>{rank.player.name}</td>
              <td>{getAllyCode(rank.player.alliance, false)}</td>
              <td className="textCenter">{rank.islands}</td>
              <td className="textRight">
                {getNumberFormat(rank.points)}
              </td>
            </tr>
          );
        })}
        </tbody>
      </Table>
    </div>
  );
}

export default Ranking;
