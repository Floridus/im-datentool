import React from 'react';
import { Table } from 'react-bootstrap';

import './AllianceRanking.scss';
import { getNumberFormat } from '../../utils/functions';

function AllianceRanking (props) {
  const { alliances, allyList } = props;

  const getRightDirection = (value) => {
    if (value > 0) {
      return <i>(+{getNumberFormat(value)})</i>;
    } else if (value < 0) {
      return <i>({getNumberFormat(value)})</i>;
    } else {
      return <i>(0)</i>;
    }
  };

  return (
    <>
      <div className="ranking">
        <b>Besten Allianzen</b><br />
        <i>Der Wert in der Klammer steht für den Zeitraum zwischen 00:00 bis 24:00 des aktuellen Tages</i>
        <Table striped hover responsive variant="dark">
          <thead>
          <tr>
            <th>#</th>
            <th>Ally</th>
            <th className="textCenter">Inseln</th>
            <th className="textRight">Punkte</th>
          </tr>
          </thead>
          <tbody>
          {alliances.map((alliance, index) => {
            const ally = allyList.find(ally => ally.code === alliance.code);

            const increase = alliance.alliancePointsIncreases[0];

            return (
              <tr
                key={`Alliance${alliance.id}`}
                style={{ backgroundColor: ally.color, color: 'white' }}
              >
                <td>{index + 1}.</td>
                <td><b>{alliance.name}</b> - <i>{alliance.code}</i></td>
                <td className="textCenter">
                  {getNumberFormat(alliance.islands)} {getRightDirection(increase.islandsIncrease)}
                </td>
                <td className="textRight">
                  {getNumberFormat(alliance.points)} {getRightDirection(increase.pointsIncrease)}
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

export default AllianceRanking;
