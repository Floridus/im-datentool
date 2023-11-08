import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { connect } from 'react-redux';

import { getIslands, getOceansCount } from '../../apollo/queries';

import Loading from '../../components/Loading/Loading';
import Error from '../../components/Error/Error';
import TotalView from '../../components/TotalView/TotalView';
import moment from 'moment/moment';

const TotalViewContainer = (props) => {
  const { world } = props;

  const [page, setPage] = useState(2);
  const perPage = 100;
  const variables = {
    pagination: {
      perPage,
      page: 1,
    },
    sorting: {
      field: 'number',
      order: 'ASC',
    },
    world: world.id,
  };

  const getOceansCountQuery = useQuery(getOceansCount, {
    variables: {
      world: world.id,
    },
  });
  const { data, loading, error, fetchMore } = useQuery(getIslands, {
    variables,
  });

  if (loading || getOceansCountQuery.loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (getOceansCountQuery.error) return <Error error={getOceansCountQuery.error} />;

  const { islands } = data;
  const { oceansCount } = getOceansCountQuery.data;
  const timeRangeFrom = moment().subtract(1, 'days');

  return (
    <TotalView
      islands={islands}
      timeRangeFrom={timeRangeFrom}
      onLoadMore={async () => {
        if (page > oceansCount)
          return;
        try {
          await fetchMore({
            variables: { ...variables, ...{ pagination: { perPage, page } } },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              return Object.assign({}, prev, {
                islands: [...prev.islands, ...fetchMoreResult.islands],
              });
            },
          });
        } catch {
        }

        setPage(page + 1);
      }}
    />
  );
};

const mapStateToProps = (state) => {
  const { world } = state;
  return { world };
};

export default connect(mapStateToProps)(TotalViewContainer);
