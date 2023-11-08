import React from 'react';
import { connect } from 'react-redux';

import './Ocean.scss';
import Island from './Island';
import Ranking from '../Ranking/Ranking';
import IslandChanges from '../IslandChanges/IslandChanges';
import Pagination from '../Pagination/Pagination';

function Ocean (props) {
  const { islands, setOcean, ocean, allys, maxOcean, ranking, islandChanges, timeRangeFrom } = props;

  return (
    <>
      <Pagination
        page={ocean}
        maxPages={maxOcean}
        prevText="Vorheriger Ozean"
        nextText="Nächster Ozean"
        setPage={setOcean}
        text="Ozean"
      />
      <div className="statistic-area">
        <Ranking ranking={ranking} allyList={allys.list} />
        <IslandChanges islandChanges={islandChanges} allyList={allys.list} />
      </div>
      <div className="ocean">
        {islands
        .map(island => {
          return (
            <Island
              key={`Island#${island.id}`}
              timeRangeFrom={timeRangeFrom}
              island={island}
              allyList={allys.list}
            />
          );
        })
        }
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  const { allys } = state;
  return { allys };
};

export default connect(mapStateToProps)(Ocean);
