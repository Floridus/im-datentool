import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { connect } from 'react-redux';

import { getPlayersCount, getPlayers } from '../../apollo/queries';

import Loading from '../../components/Loading/Loading';
import Error from '../../components/Error/Error';
import PlayerRanking from '../../components/PlayerRanking/PlayerRanking';

function PlayerRankingContainer(props) {
  const { allys, world } = props;
  const [page, setPage] = useState(1);
  const perPage = 50;

  const getPlayersCountQuery = useQuery(getPlayersCount, {
    variables: {
      world: world.id,
      perPage,
    },
  });
  const { data, loading, error } = useQuery(getPlayers, {
    variables: {
      pagination: {
        perPage,
        page,
      },
      sorting: {
        field: 'points',
        order: 'DESC',
      },
      world: world.id,
    },
  });
  if (loading || getPlayersCountQuery.loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (getPlayersCountQuery.error) return <Error error={getPlayersCountQuery.error} />;

  const { players } = data;
  const { playersCount } = getPlayersCountQuery.data;

  return (
    <PlayerRanking
      players={players}
      allyList={allys.list}
      perPage={perPage}
      setPage={setPage}
      page={page}
      maxPages={playersCount}
    />
  );
}

const mapStateToProps = (state) => {
  const { allys, world } = state;
  return { allys, world };
};

export default connect(mapStateToProps)(PlayerRankingContainer);
