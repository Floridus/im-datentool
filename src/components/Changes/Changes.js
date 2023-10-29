import React from 'react';
import { connect } from 'react-redux';

import './Changes.scss';
import AllianceChanges from './AllianceChanges';
import IslandChanges from '../IslandChanges/IslandChanges';

function Changes (props) {
  const { allianceChanges, islandChanges, allys } = props;

  return (
    <>
      <div className="changes-area">
        <IslandChanges islandChanges={islandChanges} allyList={allys.list} />
        <AllianceChanges allianceChanges={allianceChanges} allyList={allys.list} />
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  const { allys } = state;
  return { allys };
};

export default connect(mapStateToProps)(Changes);
