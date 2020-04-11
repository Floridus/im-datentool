import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { getIslands, getOceansCount } from '../../apollo/queries';

import Loading from '../../components/Loading/Loading';
import Error from '../../components/Error/Error';
import Ocean from '../../components/Ocean/Ocean';

function OceanContainer () {
  const [ocean, setOcean] = useState(1);

  const getOceansCountQuery = useQuery(getOceansCount);
  const { data, loading, error } = useQuery(getIslands, {
    variables: {
      pagination: {
        perPage: 100,
        page: ocean,
      },
    },
  });
  if (loading || getOceansCountQuery.loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (getOceansCountQuery.error) return <Error error={getOceansCountQuery.error} />;

  console.log(getOceansCountQuery);

  const { islands } = data;
  const { oceansCount } = getOceansCountQuery.data;

  return (
    <Ocean islands={islands} ocean={ocean} setOcean={setOcean} maxOcean={oceansCount} />
  );
}

export default OceanContainer;
