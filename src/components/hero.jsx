import { useState, useEffect, useRef } from 'react';
import OguriMain from '../assets/Oguri cap1.png';
import Oguri2 from '../assets/Oguri2.png';
import Oguri3 from '../assets/Oguri3.png';
import OguriDancing from '../assets/Oguri-dancing.gif';
//--------------------------------------------------//
import YoungOguri from '../assets/YoungOguri.png';
import TamamoVsOguri from '../assets/TamamoVsOguri.png';
import OguriIdol from '../assets/OguriIdol.png';
import EndofOguri from '../assets/endofOguristory.png';


const storyData = [
   {
    title: '01 · The Small Town Start',
    img: YoungOguri,
    paragraphs: [
      "She grew up in the rural racing town of Kasamatsu, far from the bright lights of Tracen Academy and the Twinkle Series. Born with weak legs that made even standing a struggle in her earliest days, few people believed she would ever become a serious racer. Yet Oguri never stopped moving forward. She trained hard in her own simple way, ate enormous meals with single-minded joy, and slowly began winning every local race she entered. The people of Kasamatsu started calling her their monster, the ash-gray girl who simply refused to lose.",
    ],
   },
   {
    title: '02 · The Bigger Stage',
    img: TamamoVsOguri,
    paragraphs: [
      "When the time came, she left her hometown and stepped into the much bigger stage of central racing. Everything felt new and overwhelming at first—the pressure, the rivals, the expectations. She faced strong opponents like Fujimasa March, the sharp and determined rival from her early days, and later the dazzling Tamamo Cross, the \"White Lightning\" whose silver coat and explosive speed made their battles unforgettable.",
    ],
  },
  {
    title: '03 · The Quiet Determination',
    img: OguriIdol,
    paragraphs: [
      "Race after race, Oguri kept running with the same quiet determination, carrying the hopes of the people back home who had believed in her when almost no one else did. Her path was never smooth. There were painful losses, moments of doubt, and the growing weight of being called an idol. Still, she continued to improve, winning major races and earning the respect of even the strongest umamusume of her generation.",
    ],
  },
  {
    title: '04 · The Legacy',
    img: EndofOguri,
    paragraphs: [
      "Through it all she remained herself: a little clumsy, endlessly hungry, and completely sincere. Fans fell in love with the gray girl who raced not for glory, but to make her hometown proud and to keep her promise to keep running. In the end, the story of Cinderella Gray becomes the story of a girl who started with almost nothing and rose all the way to the top.",
      "When she finally stood on the biggest stage of all and delivered one last unforgettable performance, the entire racecourse roared for her. The ash-covered princess had become a legend—not because she was perfect, but because she never stopped believing she could still win.",
    ],
  },
];



function Hero(){
  const [selectedImg, setSelectedImg] = useState(null);
  const [storyShow, setStoryShow] = useState(false);
  const storyRef = useRef(null);

  // Esc key para isara yung lightbox
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setSelectedImg(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  //to show story when the button is clicked

  useEffect(() => {
    if (storyShow && storyRef.current) {
      storyRef.current.scrollIntoView({ behavior: 'smooth', block: 'start'});
    }
  }, [storyShow]);

  const handleExplore = (e) => {
    e.preventDefault();
    if (storyShow) {
      storyRef.current.scrollIntoView({ behavior: 'smooth', block: 'start'});
    }else{
      setStoryShow(true);
    }
  };

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
            <a href="#" className='hero-btn' onClick={handleExplore}>Explore Her Story</a>

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

        {/*Her Story: lalabas lang pag na-click yung Explore button*/}
      {storyShow && (
        <section className="story" ref={storyRef}>
          <div className="container">
            <h2 className="story-heading">Her Story</h2>
            <div className="story-divider"></div>

            {storyData.map((item, index) => (
              <div
                key={item.title}
                className={`row align-items-center story-item ${index % 2 === 1 ? 'flex-md-row-reverse' : ''}`}
              >
                <div className="col-md-7">
                  <h3 className="story-item-title">{item.title}</h3>
                  {item.paragraphs.map((text, i) => (
                    <p key={i} className="story-text">{text}</p>
                  ))}
                </div>

                <div className="col-md-5">
                  <img
                    className="story-img hero-zoom"
                    src={item.img}
                    alt={item.title}
                    onClick={() => setSelectedImg(item.img)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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