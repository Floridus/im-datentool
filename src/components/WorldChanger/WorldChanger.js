import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { resetAllys, updateWorld } from '../../redux/actions';

function WorldChanger(props) {
  const { world } = props;

  const updateWorld = (world) => {
    props.resetAllys();
    props.updateWorld(world);
  };

  return (
    <NavDropdown title={`Welt ${world.id}`} id="basic-nav-dropdown" alignRight>
      <NavDropdown.Item onClick={() => updateWorld(54)}>Welt 54</NavDropdown.Item>
      <NavDropdown.Item onClick={() => updateWorld(55)}>Welt 55</NavDropdown.Item>
      <NavDropdown.Item onClick={() => updateWorld(200)}>Planschbecken</NavDropdown.Item>
    </NavDropdown>
  );
}

const mapStateToProps = (state) => {
  const { world } = state;
  return { world };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateWorld,
    resetAllys,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(WorldChanger);
