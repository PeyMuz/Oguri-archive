import { useState, useEffect, useRef } from 'react';
import real2Oguri from '../assets/real2oguri.png';

const careerData = [
  {
    title: 'A Humble Beginning',
    meta: '1987 · Kasamatsu Racecourse',
    text: 'Oguri Cap began his racing career at Kasamatsu Racecourse, a regional racing circuit in Japan. His impressive performances quickly caught the attention of racing fans, setting the stage for his rise to national fame.',
  },
  {
    title: 'Rising to National Fame',
    meta: '1988 · Central Racing',
    text: "After moving to Japan's central racing circuit, Oguri Cap proved that a regional horse could compete against the country's strongest racehorses. His victories earned him a growing fanbase and the nickname The Gray Legend.",
  },
  {
    title: 'Rivalries That Defined an Era',
    meta: '1988–1989 · The Golden Years',
    text: 'Oguri Cap became part of an unforgettable racing era, facing elite competitors such as Tamamo Cross. Their rivalry helped make Japanese horse racing more exciting for fans.',
  },
  {
    title: 'The Legendary Comeback',
    meta: 'December 23, 1990 · Arima Kinen',
    text: 'After struggling with declining form, Oguri Cap returned to victory in the 1990 Arima Kinen. His emotional farewell win became one of the most memorable moments in Japanese horse racing history.',
  },
];


function Career() {
    //for lightbox

    const [selectedImg, setSelectedImg] =useState(null);

    useEffect(() => {
      const handleKey = (e) => {
        if (e.key === 'Escape') setSelectedImg(null);
      };
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }, []);

    //for fade in animation
    const pageRef = useRef(null);

      useEffect(() => {
        const items = pageRef.current.querySelectorAll('.reveal');

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('reveal-show');
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.15 }
        );
        
        items.forEach((item) => observer.observe(item));
    }, []);

    return(
    
    <div ref={pageRef}>
    <section className='career-hero'>
     <h1 className='career-title'>Racing Career</h1>
     <img src={real2Oguri} className="career-img" alt="Oguri Cap racing"  onClick={() => setSelectedImg(real2Oguri)}/>
     </section>
      
    <section className='timeline'>
        <h2 className='timeline-heading reveal'>Career Milestones</h2>
        <div className="timeline-divider"></div>

        {careerData.map((item, index) =>(
            <div className="timeline-item reveal" key={item.title}>
                <span className='timeline-number'>
                    {String(index + 1).padStart(2, '0')}
                </span>
                <div className="timeline-body">
                    <h3 className='timeline-title'>{item.title}</h3>
                    <p className='timeline-meta'>{item.meta}</p>
                    <p className='timeline-text'>{item.text}</p>
                </div>
            </div>

        ))}

    </section>
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
    </div>

    );
}

export default Career;