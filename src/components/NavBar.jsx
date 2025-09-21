import logo from '../assets/logodonas.jpg'; 

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
    </nav>
  </>
);
