import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { getIslands } from '../../apollo/queries';

import World from '../../components/World/World';
import Loading from '../../components/Loading/Loading';
import Error from '../../components/Error/Error';

function WorldContainer () {
  const { data, loading, error } = useQuery(getIslands, {
    variables: {
      pagination: {
        perPage: 100000,
        page: 1,
      },
    },
  });
  if (loading) return <Loading />;
  if (error) return <Error error={error} />;

  const { islands } = data;

  return (
    <World islands={islands} />
  );
}

export default WorldContainer;
