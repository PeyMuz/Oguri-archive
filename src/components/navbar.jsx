import { Link } from 'react-router-dom';

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
            <a className="nav-link" href="/career">Career</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Game</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default navbar;