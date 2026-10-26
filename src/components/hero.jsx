import { useState, useEffect } from 'react';
import OguriMain from '../assets/Oguri cap1.png';
import Oguri2 from '../assets/Oguri2.png';
import Oguri3 from '../assets/Oguri3.png';
import OguriDancing from '../assets/Oguri-dancing.gif';

function Hero(){
  const [selectedImg, setSelectedImg] = useState(null);

  // Esc key para isara yung lightbox
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setSelectedImg(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return(
    <section className='hero'>
      <div className="container">

        <div className="row align-items-center">

          {/*Left: text + button + dancing Oguri*/}
          <div className="col-md-6">
            <p className='hero-label'>Umamusume Archive Character</p>
            <h1 className='hero-title'>The Gray Legend</h1>
            <p className='hero-desc'>
              A fan-made website featuring Oguri Cap's biography, racing
              achievements, fun facts, personality, and memorable moments.
              Discover the story, achievements, and fascinating facts behind
              Oguri Cap.
            </p>
            <a href="#" className='hero-btn'>Explore Her Story</a>

            {/*Dancing Oguri*/}
            <img className="hero-chibi" src={OguriDancing} alt="Oguri Cap chibi" />
          </div>

          {/*Right: main picture + other pictures*/}
          <div className="col-md-6">
            <img
              className="hero-main-img hero-zoom"
              src={OguriMain}
              alt="Oguri Cap running"
              onClick={() => setSelectedImg(OguriMain)}
            />

            <div className="hero-thumbs">
              <img
                className="hero-zoom"
                src={Oguri2}
                alt="Oguri Cap portrait"
                onClick={() => setSelectedImg(Oguri2)}
              />
              <img
                className="hero-zoom"
                src={Oguri3}
                alt="Oguri Cap close-up"
                onClick={() => setSelectedImg(Oguri3)}
              />
            </div>
          </div>

        </div>

      </div>

      {/*for the Lightbox: lalabas lang kapag may na-click*/}
      {selectedImg && (
        <div className="lightbox" onClick={() => setSelectedImg(null)}>
          <img
            className="lightbox-img"
            src={selectedImg}
            alt="Full view"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}

export default Hero;