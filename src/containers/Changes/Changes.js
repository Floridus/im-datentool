import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { connect } from 'react-redux';

import { getAllianceChanges, getIslandChanges } from '../../apollo/queries';

import Loading from '../../components/Loading/Loading';
import Error from '../../components/Error/Error';
import Changes from '../../components/Changes/Changes';

function ChangesContainer (props) {
  const { world } = props;
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
      world: world.id,
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
      world: world.id,
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

const mapStateToProps = (state) => {
  const { world } = state;
  return { world };
};

export default connect(mapStateToProps)(ChangesContainer);
