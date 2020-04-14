import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getAlliances } from '../../apollo/queries';

import Loading from '../../components/Loading/Loading';
import Error from '../../components/Error/Error';
import { randomBackgroundColor } from '../../utils/functions';
import { addAllys } from '../../redux/actions';

function AllyDataList (props) {
  const { data, loading, error } = useQuery(getAlliances, {
    variables: {
      pagination: {
        perPage: 10000,
        page: 1,
      },
    },
  });

  useEffect(() => {
    if (props.allys.list.length === 0 && data) {
      const { alliances } = data;
      alliances.sort((a, b) => { return b.points - a.points;});

      const allyList = [];
      alliances.map(ally => {
        const { id, name, code } = ally;
        const sameAlly = allyList.find(ally2 => (ally2.code.includes(code) && ally2.code.length === code.length + 1) || (code.includes(ally2.code) && ally2.code.length === code.length - 1));
        const backgroundColor = sameAlly ? sameAlly.color : randomBackgroundColor();

        allyList.push({ id, name, code, color: backgroundColor });
        return null;
      });

      props.addAllys(allyList);
    }
  });

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <div />
  );
}

const mapStateToProps = (state) => {
  const { allys } = state;
  return { allys };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    addAllys,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(AllyDataList);