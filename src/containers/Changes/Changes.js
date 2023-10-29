import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { connect } from 'react-redux';

import { getAllianceChanges } from '../../apollo/queries';

import Loading from '../../components/Loading/Loading';
import Error from '../../components/Error/Error';
import Changes from '../../components/Changes/Changes';

function ChangesContainer(props) {
  const { world } = props;
  const [islandChanges, setIslandChanges] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState();

  useEffect(() => {
    const bodyData = {
      'api_key': '417f0029b82cf1efb4641178f292fd13',
      'server': world.id,
      'command': 'changes',
    };

    fetch(`https://www.insel-monarchie.de/v2_ext_tool/get.php`, {
      method: 'POST',
      body: JSON.stringify(bodyData),
    })
    .then(response => response.json())
    .then((data) => {
      setIslandChanges(data.result);
      setFetchLoading(false);
    })
    .catch(err => {
      setFetchError(err);
      console.error(err);
    });
  }, [world]);

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

  if (loading || fetchLoading) return <Loading />;
  if (error) return <Error error={error} />;
  if (fetchError) return <Error error={fetchError} />;

  const { allianceChanges } = data;

  return (
    <Changes allianceChanges={allianceChanges} islandChanges={islandChanges} />
  );
}

const mapStateToProps = (state) => {
  const { world } = state;
  return { world };
};

export default connect(mapStateToProps)(ChangesContainer);
