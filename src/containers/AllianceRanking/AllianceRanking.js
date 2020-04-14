import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { getAlliances } from '../../apollo/queries';

import Loading from '../../components/Loading/Loading';
import Error from '../../components/Error/Error';
import AllianceRanking from '../../components/AllianceRanking/AllianceRanking';
import { connect } from 'react-redux';

function AllianceRankingContainer (props) {
  const { allys } = props;
  const { data, loading, error } = useQuery(getAlliances, {
    variables: {
      pagination: {
        perPage: 10000,
        page: 1,
      },
    },
  });
  if (loading) return <Loading />;
  if (error) return <Error error={error} />;

  const { alliances } = data;

  return (
    <AllianceRanking alliances={alliances} allyList={allys.list} />
  );
}

const mapStateToProps = (state) => {
  const { allys } = state;
  return { allys };
};

export default connect(mapStateToProps)(AllianceRankingContainer);
