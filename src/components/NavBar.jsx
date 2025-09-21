import logo from '../assets/logodonas.jpg'; 
import { CartWidget } from './CartWidget';

export const NavBar = () => (
  <>
    <nav>
      <img src={logo} alt="logo" />
      <ul>
        <li>
          <a href="#">Inicio</a>
        </li>
        <li>
          <a href="#">Productos</a>
        </li>
        <li>
          <a href="#">Catálogo</a>
        </li>
      </ul>
      <CartWidget />
    </nav>
  </>
);
