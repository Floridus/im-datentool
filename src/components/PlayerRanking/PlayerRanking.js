import React from 'react';
import { Table } from 'react-bootstrap';

import './PlayerRanking.scss';
import { getNumberFormat, getRightDirection } from '../../utils/functions';
import Pagination from '../Pagination/Pagination';

function PlayerRanking (props) {
  const { players, perPage, allyList, page, setPage, maxPages } = props;

  return (
    <>
      <Pagination
        page={page}
        maxPages={maxPages}
        prevText="Vorherige Seite"
        nextText="Nächste Seite"
        setPage={setPage}
        text="Seite"
      />
      <div className="ranking">
        <b>Spieler Rangliste</b><br />
        <i>Der Wert in der Klammer steht für den Zeitraum zwischen 00:00 bis 24:00 des aktuellen Tages</i>
        <Table striped hover responsive variant="dark">
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
          {players.map((player, index) => {
            const ally = allyList.find(ally => player.alliance && ally.code === player.alliance.code);

            const increase = player.playerPointsIncreases[0];

            return (
              <tr
                key={`Player${player.id}`}
                style={ally ? { backgroundColor: ally.color, color: 'white' } : {}}
              >
                <td>{perPage * (page - 1) + (index + 1)}.</td>
                <td><b>{player.name}</b></td>
                <td><i>{player.alliance && player.alliance.code}</i></td>
                <td className="textCenter">
                  {getNumberFormat(player.islands.length)} {getRightDirection(increase.islandsIncrease)}
                </td>
                <td className="textRight">
                  {getNumberFormat(player.points)} {getRightDirection(increase.pointsIncrease)}
                </td>
              </tr>
            );
          })}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default PlayerRanking;
