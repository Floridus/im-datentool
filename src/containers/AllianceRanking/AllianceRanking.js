import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { connect } from 'react-redux';

import { getAlliances } from '../../apollo/queries';

import Loading from '../../components/Loading/Loading';
import Error from '../../components/Error/Error';
import AllianceRanking from '../../components/AllianceRanking/AllianceRanking';

function AllianceRankingContainer (props) {
  const { allys, world } = props;

  const { data, loading, error } = useQuery(getAlliances, {
    variables: {
      pagination: {
        perPage: 10000,
        page: 1,
      },
      world: world.id,
    },
  });
  if (loading || allys.list.length === 0) return <Loading />;
  if (error) return <Error error={error} />;

  const { alliances } = data;

  return (
    <AllianceRanking alliances={alliances} allyList={allys.list} />
  );
}

const mapStateToProps = (state) => {
  const { allys, world } = state;
  return { allys, world };
};

export default connect(mapStateToProps)(AllianceRankingContainer);
