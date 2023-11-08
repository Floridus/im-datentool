import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import '../Ocean/Ocean.scss';
import Island from '../Ocean/Island';

function TotalView(props) {
  const { islands, onLoadMore, allys } = props;

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) {
      return;
    }
    onLoadMore();
  };

  return (
    <div className="ocean">
      {islands
      .map(island => {
        return (
          <Island
            key={`Island#${island.id}`}
            island={island}
            allyList={allys.list}
          />
        );
      })
      }
    </div>
  );
}

const mapStateToProps = (state) => {
  const { allys } = state;
  return { allys };
};

export default connect(mapStateToProps)(TotalView);
