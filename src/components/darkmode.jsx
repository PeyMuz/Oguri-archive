import { useEffect, useState } from "react";

function getInitialTime() {
    try{
        const saved = localStorage.getItem('theme');
        if (saved ==="dark" || saved === "light") return saved;
    }catch(e) {
        // localStorage can be blocked; fall through to system preference
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
}


function Darkmode() {
    const [theme, SetTheme] = useState(getInitialTime);
    const isDark = theme === 'dark';

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        root.setAttribute('data-bs-theme',theme);
        try{
            localStorage.setItem('theme', theme);
        } catch (e) {
            //ignore
        }
    }, [theme]);


    return(
    <>
    <button
    type="button"
    className={`theme-toggle ${isDark? 'is-dark' : ''}`}
    role="switch"
    aria-checked={isDark}
    arira-label="Toggle dark mode"
    onClick={() => SetTheme(isDark? 'light' : 'dark')}
    >

         <span className="tt-night" aria-hidden="true"></span>

        <span className="tt-stars" aria-hidden="true">
        <i style={{ '--x': '12%', '--y': '30%', '--sz': '7px', '--d': '0.15s' }}></i>
        <i style={{ '--x': '30%', '--y': '24%', '--sz': '5px', '--d': '0.25s' }}></i>
        <i style={{ '--x': '40%', '--y': '52%', '--sz': '8px', '--d': '0.2s' }}></i>
        <i style={{ '--x': '20%', '--y': '66%', '--sz': '6px', '--d': '0.3s' }}></i>
        <i style={{ '--x': '52%', '--y': '70%', '--sz': '4px', '--d': '0.35s' }}></i>
        <i style={{ '--x': '55%', '--y': '28%', '--sz': '4px', '--d': '0.4s' }}></i>
      </span>

      <span className="tt-clouds" aria-hidden="true">
        <b className="cloud back b1"></b>
        <b className="cloud back b2"></b>
        <b className="cloud c1"></b>
        <b className="cloud c2"></b>
        <b className="cloud c3"></b>
        <b className="cloud base"></b>
      </span>


      <span className="tt-knob" aria-hidden="true">
        <u className="crater k1"></u>
        <u className="crater k2"></u>
        <u className="crater k3"></u>
      </span>

    </button>
    
    </>);

}

export default Darkmode;