import React from "react";
import { Carousel, Container } from "react-bootstrap";
import ReactPlayer from "react-player";
import HexGrid from "../components/HexGrid";
import ContactForm from "../components/ContactForm";
import BusinessModel from "../components/BusinessModel";
import TapaCarousel from "../components/TapaCarousel";
import TextSuperiorHexgrid from "../components/Text-superior-hexgrid";
import CreateVirtualFair from "../components/CreateVirtualFair";


function Home() {
  return (
    <div className="home">
      {/* Slider Fullscreen con Video en un Slide */}
      <Carousel className="carousel" fade interval={12000} controls={false} indicators={false}>
        <Carousel.Item>
          {/* Slide con Video */}
          <div className="video-slide">
          <video autoPlay muted loop playsInline preload="auto" style={{ width: "100%", height: "100%", objectFit: "cover" }}>
          <source src="/assets/video/video_home.mp4" type="video/mp4" />
      Tu navegador no soporta el video HTML5.
    </video>
          </div>
        </Carousel.Item>
        
      </Carousel>
      
      <TapaCarousel />

      <CreateVirtualFair />
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
