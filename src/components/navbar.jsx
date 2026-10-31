import { Link } from 'react-router-dom';
import Darkmode from './darkmode';

function navbar() {
  return (
    <nav className="navbar navbar-expand nav">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Oguri Archive
        </Link>

        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/facts">Facts</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/career">Career</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/game">Game</Link>
          </li>
          <li className='nav-item ms-3'>
             <Darkmode />
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default navbar;