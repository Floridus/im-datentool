import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

import './Error.scss';

function Error (props) {
  return (
    <Alert variant="danger">
      <Alert.Heading>Oh snap! We got an error!</Alert.Heading>
      <p>{props.error.message}</p>
    </Alert>
  );
}

Error.propTypes = {
  error: PropTypes.object,
};

export default Error;
