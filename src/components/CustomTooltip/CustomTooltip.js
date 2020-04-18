import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function CustomTooltip (props) {
  const { children, id, text } = props;

  return (
    <OverlayTrigger
      key="top"
      placement="top"
      overlay={<Tooltip id={id}>{text}</Tooltip>}
    >
      {children}
    </OverlayTrigger>
  );
}

export default CustomTooltip;
