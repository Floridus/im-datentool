import React from 'react';
import { getAllyCode } from '../../utils/functions';
import moment from 'moment/moment';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Island (props) {
  const { island, allyList, timeRangeFrom } = props;

  const ally = allyList.find(ally => island.player.alliance && ally.code === island.player.alliance.code);
  const changeInLast24H = island.islandChanges.length > 0 ? moment(island.islandChanges[0].createdAt).isAfter(timeRangeFrom) : false;

  return (
    <div
      className="island-area"
      style={ally ? { backgroundColor: ally.color, color: 'white' } : {}}
    >
      <div>{island.number}</div>
      {changeInLast24H && <div className="change-info" />}
      <div>{island.player.name}</div>
      <div>{getAllyCode(island.player.alliance)}</div>
      <div>{island.points} Punkte</div>
    </div>
  );
}

export default Island;
