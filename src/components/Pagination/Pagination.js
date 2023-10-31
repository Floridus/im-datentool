import React from 'react';
import { Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Pagination.scss';
import { rangeArray } from '../../utils/functions';

const Pagination = (props) => {
  const { page, maxPages, prevText, nextText, setPage, text } = props;

  return (
      <div className="pagination-header">
        <Button variant="dark" onClick={() => setPage(page - 1)} disabled={page === 1}>
          <span className="d-none d-lg-block">{prevText}</span>
          <span className="d-lg-none"> <FontAwesomeIcon icon={faAngleDoubleLeft} /> </span>
        </Button>
        <DropdownButton
          id="select-page"
          variant="secondary"
          title={`${text} ${page}`}
          onSelect={(eventKey) => setPage(parseInt(eventKey))}
        >
          {rangeArray(1, maxPages)
          .map(pg =>
            <Dropdown.Item
              key={`Select${pg}`}
              eventKey={pg}
              active={pg === page}>{text} {pg}</Dropdown.Item>,
          )
          }
        </DropdownButton>
        <Button variant="dark" onClick={() => setPage(page + 1)} disabled={page === maxPages}>
          <span className="d-none d-lg-block">{nextText}</span>
          <span className="d-lg-none"> <FontAwesomeIcon icon={faAngleDoubleRight} /> </span>
        </Button>
      </div>
  );
}

export default Pagination;
