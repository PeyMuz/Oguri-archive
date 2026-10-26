import Fact1 from '../assets/Ogurirealhorse.png';
import Fact2 from '../assets/fact2.png';
import Fact3 from '../assets/fact3.png';
import Fact4 from '../assets/fact4.png';
import Fact5 from '../assets/fact5.png';
import Fact6 from '../assets/Fact6.png';
import Fact7 from '../assets/fact7.png';
import Fact8 from '../assets/fact8.png';
import Fact9 from '../assets/fact9.png';
import Fact10 from '../assets/fact10.png';


const factsData = [
   { img: Fact1, 
    title: "Based on a Real-Life Racing Legend" 
    ,text: "Oguri Cap is based on a real Japanese racehorse born on March 27, 1985. He was a gray-coated male horse who began his career at Kasamatsu Racecourse before moving to Japan s central racing circuit. He won 22 of his 32 races, becoming one of Japan's most beloved racehorses."},

   { img: Fact2, 
    title: "She's a Country Girl Turned Racing Star",
    text: "In Uma Musume, Oguri Cap comes from the countryside and transfers to Tracen Academy after dominating local races. She carries the hopes of her hometown and wants to prove herself on a bigger stage."},
    
    { img: Fact3, 
    title: "She Has an Insatiable Appetite" 
    ,text: "Oguri Cap is famous for her enormous appetite. She can eat huge amounts of rice and other food, making eating one of her most recognizable comedic traits in the series."},

    { img: Fact4, 
    title: "Tamamo Cross Is One of Her Major Rivals" 
    ,text: "Tamamo Cross is one of Oguri Cap's most important rivals. Their rivalry draws inspiration from the real racehorses' memorable battles during the late 1980s, including their encounters in major races."},
     
    { img: Fact5, 
    title: "She's Calm and Naturally Clumsy" 
    ,text: "Despite being a powerful racer, Oguri Cap is usually laid-back, quiet, and unintentionally funny. Her serious approach to racing contrasts with her innocent, sometimes clueless behavior in everyday life."},

    { img: Fact6, 
    title: "Her Story Is Told in Cinderella Gray" 
    ,text: "Uma Musume Cinderella Gray focuses on Oguri Cap's rise from regional racing to the national spotlight. It gives her story a more intense sports-drama atmosphere, emphasizing hard work, competition, and her journey to becoming a legend."},

    { img: Fact7, 
    title: "She Has a Straightforward Personality" 
    ,text: "Oguri Cap usually says what she thinks without overcomplicating things. Her honest, innocent nature can make her unintentionally funny, especially when she doesn't understand why other people are surprised by her behavior."},

    { img: Fact8, 
    title: "She Doesn't Easily Give Up" 
    ,text: "One of Oguri Cap's defining qualities is her determination. Even when she faces stronger opponents or difficult races, she keeps pushing forward instead of letting pressure define her."},
    
    { img: Fact9, 
    title: "She and Special Week hosted a cooking show" 
    ,text: "In Umayuru Episode 22, Oguri Cap and Special Week host a cooking program with Matikanetannhauser, making carrot hamburger steak."},

    { img: Fact10, 
    title: "THE Final Race Became Legendary" 
    ,text: "The real Oguri Cap won the 1990 Arima Kinen, his final race before retirement. His emotional comeback victory became one of the most memorable moments in Japanese horse-racing history and helped cement his legendary status."}  
    







]; 

function Facts(){
    return(
 <div class="card" style="width: 18rem;">
  <img class="card-img-top" src="..." alt="Card image cap" />
  <div class="card-body">
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
</div>
    );
}

export default Facts;