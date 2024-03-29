import { Link } from 'react-router-dom';
import logo from '../images/logoVET.png';
import { Toggle } from './Toggle';
import MenuNav from './MenuNav';
import '../styles/header.scss';
import { useState } from 'react';



function HeaderPages({isDark, setIsDark}) {

const [dropMenu, setDropMenu] = useState(false);
const [moveMenu, setMoveMenu] = useState('');

const handleMenu = (e)=> {
  e.preventDefault();
  setMoveMenu('dropMenu');
  setDropMenu(!dropMenu);

}
  return (
    <header className="header dark">
      <Link to={"/"}>
      <img
        src={logo}
        alt="logo"
        className="header__image heartbeat"
      />
      </Link>
      <h1 className="header__title">Vetfolio Manager</h1>
      <div className="header__style">
      <Toggle isDark={isDark} handleChange={() => setIsDark(!isDark)} />


      <button  className={`${moveMenu} header__menu`}  onClick={handleMenu} aria-label='Menu'><i className= "fa-solid fa-bars"></i></button>
        {dropMenu ? <MenuNav /> : <div></div> }
      </div>
    </header>
  );
}

export default HeaderPages;
