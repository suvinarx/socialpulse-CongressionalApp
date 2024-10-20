import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import HeaderLink from './HeaderLink';

function Header() {
  const { logout } = useAuth();
  const handleClick = async () => {
    await logout();
  };
  return (
    <nav className='py-2 md:py-4 navbar bg-base-300'>
      <div className='container mx-auto md:flex md:items-center'>
        <div className='flex justify-between items-center'>
          <NavLink to='/dashboard' className='font-bold text-3xl'>
            <div className='flex items-center gap-3'>
              <img src='/logo.svg' className='w-16' alt='logo' width={150} />
              <h3 className='text-primary-content font-poppins text-center'>
                Social Pulse
              </h3>
            </div>
          </NavLink>
          <button
            className='border border-solid border-gray-600 px-3 py-1 rounded text-gray-600 opacity-50 hover:opacity-75 md:hidden'
            id='navbar-toggle'
          >
            <i className='fas fa-bars'></i>
          </button>
        </div>

        <ul
          className='hidden menu menu-horizontal md:flex flex-col md:flex-row md:ml-auto mt-3 md:mt-0'
          id='navbar-collapse'
        >
          <li>
            <HeaderLink to='/dashboard'>Dashboard</HeaderLink>
          </li>
          {/* <HeaderLink to="/your-posts">Your Posts</HeaderLink> */}
          <li>
            <HeaderLink to='/integrations'>Integrations</HeaderLink>
          </li>
          <li>
            <button onClick={handleClick}>
              {/* <p className='p-2 lg:mx-4 md:mx-2 text-gray-600 hover:text-indigo-600 transition-colors duration-300 cursor-pointer'> */}
              Sign Out
              {/* </p> */}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;
