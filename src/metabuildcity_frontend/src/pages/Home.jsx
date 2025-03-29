import React from "react";
import { Carousel, Container } from "react-bootstrap";
import ReactPlayer from "react-player";
import HexGrid from "../components/HexGrid";
import ContactForm from "../components/ContactForm";
import BusinessModel from "../components/BusinessModel";
import TapaCarousel from "../components/TapaCarousel";
import TextSuperiorHexgrid from "../components/Text-superior-hexgrid";


function Home() {
  return (
    <div className="home">
      {/* Slider Fullscreen con Video en un Slide */}
      <Carousel className="carousel" fade interval={12000} controls={false} indicators={false}>
        <Carousel.Item>
          {/* Slide con Video */}
          <div className="video-slide">
          <ReactPlayer
            url="https://www.youtube.com/embed/q1dXMtnffOc?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1"
            playing
            loop
            width="100%"
            height="100%"
            config={{
              youtube: {
                playerVars: {
                  autoplay: 1,
                  mute: 1,
                  controls: 0,
                  showinfo: 0,
                  modestbranding: 1,
                  rel: 0,
                  playsinline: 1,
                },
              },
            }}
          />
          </div>
        </Carousel.Item>
      </Carousel>
      
      <TapaCarousel />



      <BusinessModel />

      <TextSuperiorHexgrid />
      <section id="hexSection">
        <HexGrid />
      </section>

      {/* Formulario de Contacto */}
      <section id="contact">
        <ContactForm />
      </section>
    </div>
    
  );
}

export default Home;
