import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { updateWorld } from '../../redux/actions';

function WorldChanger (props) {
  const { world } = props;

  return (
    <NavDropdown title={`Welt ${world.id}`} id="basic-nav-dropdown">
      <NavDropdown.Item onClick={() => props.updateWorld(47)}>Welt 47</NavDropdown.Item>
      <NavDropdown.Item onClick={() => props.updateWorld(48)}>Welt 48</NavDropdown.Item>
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
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(WorldChanger);
