import React from 'react';
import { NavLink } from 'react-router-dom';

function HeaderLink(props) {
  const { children } = props;
  return (
    <NavLink
      to={props?.to}
      className={({ isActive }) =>
        isActive
          ? 'rounded-box p-2 lg:px-4 md:mx-2 btn-info btn btn-sm'
          : 'rounded-box p-2 lg:px-4 md:mx-2 transition-colors duration-300'
      }
    >
      {children}
    </NavLink>
  );
}

export default HeaderLink;
