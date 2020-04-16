import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

import './Error.scss';

function Error (props) {
  const { error, title } = props;

  return (
    <Alert variant="danger">
      <Alert.Heading>
        {title ? title : 'Oh snap! We got an error!'}
      </Alert.Heading>
      <p>{error.message}</p>
    </Alert>
  );
}

Error.propTypes = {
  error: PropTypes.object,
  title: PropTypes.string,
};

export default Error;
