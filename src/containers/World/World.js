import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { connect } from 'react-redux';

import { getIslands } from '../../apollo/queries';

import World from '../../components/World/World';
import Loading from '../../components/Loading/Loading';
import Error from '../../components/Error/Error';

function WorldContainer (props) {
  const { world } = props;
  const { data, loading, error } = useQuery(getIslands, {
    variables: {
      pagination: {
        perPage: 1000000,
        page: 1,
      },
      sorting: {
        field: 'number',
        order: 'ASC',
      },
      world: world.id,
    },
  });
  if (loading) return <Loading />;
  if (error) return <Error error={error} />;

  const { islands } = data;

  return (
    <World islands={islands} />
  );
}

const mapStateToProps = (state) => {
  const { world } = state;
  return { world };
};

export default connect(mapStateToProps)(WorldContainer);
