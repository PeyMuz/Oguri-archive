function navbar() {
  return (
    <nav className="navbar navbar-expand nav">
      <div className="container">
        <a className="navbar-brand" href="#">
          Oguri Archive
        </a>

        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a className="nav-link" href="#">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Facts</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Career</a>
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