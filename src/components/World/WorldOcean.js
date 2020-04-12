import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './World.scss';
import { getAllyCode } from '../../utils/functions';

function WorldOcean (props) {
  const { ocean, islands, allys } = props;
  const [showInfo, setShowInfo] = useState(false);
  const allyList = allys.list;

  const acObj = islands.reduce((obj, island) => {
    if (island.player.alliance) {
      const { alliance } = island.player;
      // increment or set the property
      // `(obj[v.status] || 0)` returns the property value if defined
      // or 0 ( since `undefined` is a falsy value
      obj[alliance.code] = (obj[alliance.code] || 0) + 1;
    } else {
      obj['no-ally'] = (obj['no-ally'] || 0) + 1;
    }
    // return the updated object
    return obj;
    // set the initial value as an object
  }, {});

  const alliancesCount = Object.keys(acObj)
  .map((key) => {
    // Using obj[key] to retrieve key value
    return { code: key, count: acObj[key] };
  });
  alliancesCount.sort((a, b) => {
    return b.count - a.count;
  });

  const firstAlliance = alliancesCount[0];

  const ally = allyList.find(ally => ally.code === firstAlliance.code);

  return (
    <Link
      to={`/ocean/${ocean}`}
      className="ocean-area"
      onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
      style={ally ? { backgroundColor: ally.color, color: 'white' } : {}}
    >
      <div>Ozean {ocean}</div>
      <div>{getAllyCode(firstAlliance)}</div>
      <div>{firstAlliance.count} Inseln</div>
      {showInfo &&
      <div className="ocean-info">
        {alliancesCount.map(alliance =>
          <div className="ally-line" key={`Ocean${ocean}Ally${alliance.code}`}>
            <div>{getAllyCode(alliance)}</div>
            <div>{alliance.count} Inseln</div>
          </div>,
        )}
      </div>
      }
    </Link>
  );
}

const mapStateToProps = (state) => {
  const { allys } = state;
  return { allys };
};

export default connect(mapStateToProps)(WorldOcean);
