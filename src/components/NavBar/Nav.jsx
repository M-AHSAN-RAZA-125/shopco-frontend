import React, { useState } from 'react'
import './Nav.css'
import nav_logo from '../../assets/nav_logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

// Font Awesome Icons link
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faCircleUser, faBars, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

const Nav = () => {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    const text = searchText.trim();
    if (text) navigate(`/search?q=${encodeURIComponent(text)}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 3. Total items quantity calculate karein
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className='Nav'>
      <div className='nav_div nav_logo'>
        <Link to='/'><img src={nav_logo} alt="Our Logo" /></Link>
      </div>

      <div className="nav_div nav_list">
        <FontAwesomeIcon className="nav_menu_icon" icon={faBars}></FontAwesomeIcon>
        <ul className='nav_items'>
          <li><Link className='nav_link' to='/'>Shop</Link></li>
          <li><Link className='nav_link' to='/'>On Sale</Link></li>
          <li><Link className='nav_link' to='/'>New Arrivals</Link></li>
          <li><Link className='nav_link' to='/'>Brands</Link></li>
        </ul>
      </div>

      <div className="nav_div nav_search">
        <form className='nav_search_form' onSubmit={handleSearch}>
          <input
            type="search"
            className='nav_input'
            placeholder='Search for products...'
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </form>
      </div>

      <div className="nav_div nav_icons">
        {/* Nav Cart Icon with Badge */}
        <Link className='nav_link cart_icon_wrapper' to={"/cart"}>
          <FontAwesomeIcon className='nav_icon' icon={faCartShopping} />
          {totalItems > 0 && <span className="cart_badge">{totalItems}</span>}
        </Link>

        {/* Account: login page when logged out, "My Orders" when logged in */}
        <Link
          className='nav_link'
          to={user ? "/orders" : "/login"}
          title={user ? `${user.name} - My Orders` : "Log in"}
        >
          <FontAwesomeIcon className='nav_icon' icon={faCircleUser} />
        </Link>

        {user && (
          <button type="button" className='nav_logout_btn' onClick={handleLogout} title="Log out" aria-label="Log out">
            <FontAwesomeIcon className='nav_icon' icon={faRightFromBracket} />
          </button>
        )}
      </div>
    </nav>
  )
}

export default Nav;