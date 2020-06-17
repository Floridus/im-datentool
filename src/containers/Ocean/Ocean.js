import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@apollo/react-hooks';
import { connect } from 'react-redux';

import { getIslands, getOceansCount } from '../../apollo/queries';

import Loading from '../../components/Loading/Loading';
import Error from '../../components/Error/Error';
import Ocean from '../../components/Ocean/Ocean';

function OceanContainer (props) {
  const { oce } = useParams();
  const { world } = props;

  const [ocean, setOcean] = useState(oce ? parseInt(oce) : 1);

  const getOceansCountQuery = useQuery(getOceansCount, {
    variables: {
      world: world.id,
    },
  });
  const { data, loading, error } = useQuery(getIslands, {
    variables: {
      pagination: {
        perPage: 100,
        page: ocean,
      },
      world: world.id,
    },
  });
  if (loading || getOceansCountQuery.loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (getOceansCountQuery.error) return <Error error={getOceansCountQuery.error} />;

  const { islands } = data;
  const { oceansCount } = getOceansCountQuery.data;

  const ranking = [];
  let islandChanges = [];
  islands.map(island => {
    const index = ranking.findIndex(item => item.player.id === island.player.id);
    islandChanges = islandChanges.concat(island.islandChanges);

    if (index !== -1) {
      ranking[index].points += island.points;
      ranking[index].islands += 1;
    } else {
      ranking.push({
        player: island.player,
        islands: 1,
        points: island.points,
      });
    }
    return null;
  });
  ranking.sort((a, b) => b.points - a.points);
  islandChanges.sort((a, b) => b.createdAt - a.createdAt);

  return (
    <Ocean
      islands={islands}
      ocean={ocean}
      setOcean={setOcean}
      maxOcean={oceansCount}
      ranking={ranking.slice(0, 10)}
      islandChanges={islandChanges.slice(0, 10)}
    />
  );
}

const mapStateToProps = (state) => {
  const { allys, world } = state;
  return { allys, world };
};

export default connect(mapStateToProps)(OceanContainer);
