import React from 'react';
import { getAllyCode } from '../../utils/functions';

import './Ocean.scss';

function Island (props) {
  const { island, allyList } = props;

  const ally = allyList.find(ally => island.player.alliance && ally.code === island.player.alliance.code);

  return (
    <div
      className="island-area"
      style={ally ? { backgroundColor: ally.color, color: 'white' } : {}}
    >
      <div>{island.number}</div>
      <div>{island.player.name}</div>
      <div>{getAllyCode(island.player.alliance)}</div>
      <div>{island.points} Punkte</div>
    </div>
  );
}

export default Island;
