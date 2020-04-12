import React from 'react';

import './World.scss';
import { rangeArray } from '../../utils/functions';
import WorldOcean from './WorldOcean';

function World (props) {
  const { islands } = props;
  const oceans = Math.ceil(islands.length / 100);

  return (
    <>
      <div>
        Eine Übersicht über die herrschende Allianz jedes Ozeans.<br />
        (<i>Wing Allianzen die ein ähnliches Kürzel haben wie die Hauptallianz, werden als eine
        Allianz farblich markiert</i>)
      </div>
      <div className="world">
        {rangeArray(1, oceans)
        .map(ocean => {
          const oceanIslands = islands.slice(100 * (ocean - 1), 100 * ocean);
          return (
            <WorldOcean
              key={`Ocean#${ocean}`}
              ocean={ocean}
              islands={oceanIslands}
            />
          );
        })
        }
      </div>
    </>
  );
}

export default World;
