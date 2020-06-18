import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getAlliances } from '../../apollo/queries';

import Loading from '../../components/Loading/Loading';
import Error from '../../components/Error/Error';
import { randomBackgroundColor } from '../../utils/functions';
import { addAllys, resetAllys } from '../../redux/actions';

function AllyDataList (props) {
  const { world, allys } = props;
  const { data, loading, error } = useQuery(getAlliances, {
    variables: {
      pagination: {
        perPage: 10000,
        page: 1,
      },
      world: world.id,
    },
  });

  useEffect(() => {
    if (data && data.alliances.length > 0) {
      const { alliances } = data;
      if (allys.list.length === 0 && alliances[0].world.number === world.id) {
        pushAllyColors(alliances);
      } else if (allys.list.length > 0 && allys.list[0].name !== alliances[0].name) {
        pushAllyColors(alliances);
      }
    }
  });

  const pushAllyColors = (alliances) => {
    alliances.sort((a, b) => { return b.points - a.points;});

    const allyList = [];
    alliances.map(ally => {
      const { id, name, code } = ally;
      const sameAlly = allyList.find(ally2 => (ally2.code.includes(code) && ally2.code.length === code.length + 1) || (code.includes(ally2.code) && ally2.code.length === code.length - 1));
      const backgroundColor = sameAlly ? sameAlly.color : randomBackgroundColor();

      allyList.push({ id, name, code, color: backgroundColor });
      return null;
    });

    props.addAllys(allyList, world.id);
  };

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <div />
  );
}

const mapStateToProps = (state) => {
  const { allys, world } = state;
  return { allys, world };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    addAllys,
    resetAllys,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(AllyDataList);