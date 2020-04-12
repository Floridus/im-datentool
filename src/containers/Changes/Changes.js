import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { getAllianceChanges, getIslandChanges } from '../../apollo/queries';

import Loading from '../../components/Loading/Loading';
import Error from '../../components/Error/Error';
import Changes from '../../components/Changes/Changes';

function ChangesContainer () {
  const { data, loading, error } = useQuery(getAllianceChanges, {
    variables: {
      pagination: {
        perPage: 50,
        page: 1,
      },
      sorting: {
        field: 'createdAt',
        order: 'DESC',
      },
    },
  });
  const getIslandChangesQuery = useQuery(getIslandChanges, {
    variables: {
      pagination: {
        perPage: 50,
        page: 1,
      },
      sorting: {
        field: 'createdAt',
        order: 'DESC',
      },
    },
  });
  if (loading || getIslandChangesQuery.loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (getIslandChangesQuery.error) return <Error error={getIslandChangesQuery.error} />;

  const { allianceChanges } = data;
  const { islandChanges } = getIslandChangesQuery.data;

  return (
    <Changes allianceChanges={allianceChanges} islandChanges={islandChanges} />
  );
}

export default ChangesContainer;
