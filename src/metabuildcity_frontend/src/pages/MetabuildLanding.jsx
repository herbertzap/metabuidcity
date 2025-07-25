import React, { useState } from 'react';
import '../index.scss';
import '../components/MetabuildLanding.scss';
import LoginModal from '../components/LoginModal';

const MetabuildLanding = () => {
  const [showLogin, setShowLogin] = useState(false);

  const handleOpenLogin = (e) => {
    e.preventDefault();
    setShowLogin(true);
  };

  return (
    <div className="metabuild-landing">
      <LoginModal show={showLogin} onClose={() => setShowLogin(false)} />
      {/* Header */}
      <header className="header">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <a className="navbar-brand" href="#">
              <img src="/LogoMetaBuildCity.png" alt="MetaBuild City" height="50" />
            </a>
            <div className="navbar-nav ms-auto">
              <a className="nav-link" href="#metabuild">METABUILD</a>
              <a className="nav-link dropdown-toggle" href="#servicios">SERVICIOS</a>
              <a className="nav-link" href="#marketplace">MARKETPLACE</a>
              <a className="nav-link" href="#contacto">CONTACTO</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="hero-title">
                MARKETING VIRTUAL Y METAVERSO
              </h1>
              <h2 className="hero-subtitle">
                EVENTOS VIRTUALES EN EL METAVERSO
              </h2>
              <p className="hero-description">
                Desde <strong>ferias virtuales</strong> para <strong>todas las industrias y sectores</strong>, hasta la <strong>creación de laboratorios</strong> para <strong>universidades</strong> y entornos de <strong>capacitación</strong> sobre <strong>parques naturales</strong> y su ecosistema.
              </p>
              <div className="hero-buttons">
                <a href="#login" className="btn btn-primary btn-lg" onClick={handleOpenLogin}>INGRESAR</a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-cards">
                <div className="hero-card">
                  <h3>CHILE FINTECH FORUM 2025</h3>
                  <a href="#" className="btn btn-outline-primary">INGRESAR</a>
                </div>
                <div className="hero-card">
                  <h3>DEPARTAMENTO DE CONSTRUCCIÓN CIVIL UC</h3>
                  <a href="#" className="btn btn-outline-primary">INGRESAR</a>
                </div>
                <div className="hero-card">
                  <h3>PARQUE AGUAS DE RAMÓN</h3>
                  <a href="#" className="btn btn-outline-primary">INGRESAR</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logros Section */}
      <section className="logros-section">
        <div className="container">
          <h2 className="section-title">HEMOS LOGRADO</h2>
          <div className="row">
            <div className="col-md-3">
              <div className="logro-item">
                <h3>9100</h3>
                <p>Usuarios entrenados en nuestros metaversos</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="logro-item">
                <h3>5100</h3>
                <p>Visitas en nuestros metaversos</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="logro-item">
                <h3>60</h3>
                <p>Metaversos desarrollados</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="logro-item">
                <h3>23</h3>
                <p>Eventos virtuales en nuestros metaversos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section className="servicios-section" id="servicios">
        <div className="container">
          <h2 className="section-title">ÁREAS DE SERVICIOS</h2>
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="servicio-card">
                <div className="servicio-icon">XR</div>
                <h3>REALIDAD EXTENDIDA</h3>
                <p>
                  Creamos experiencias inmersivas en VR, AR y MR para formación, marketing y visualización de proyectos. Nuestros entornos virtuales eliminan barreras geográficas, mejoran la comprensión y reducen los costos logísticos de eventos físicos.
                </p>
                <a href="#" className="btn btn-outline-primary">Ver más</a>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="servicio-card">
                <div className="servicio-icon">MKT</div>
                <h3>MARKETING</h3>
                <p>
                  Operamos campañas presenciales y virtuales con activaciones, promotores y ferias interactivas en el metaverso. Aumentamos el alcance territorial y la interacción, con métricas claras y presencia continua de marca.
                </p>
                <a href="#" className="btn btn-outline-primary">Ver más</a>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="servicio-card">
                <div className="servicio-icon">AI</div>
                <h3>INTELIGENCIA ARTIFICIAL</h3>
                <p>
                  Implementamos asistentes conversacionales como Meby para automatizar soporte, gestionar información y personalizar experiencias en entornos virtuales. Escalamos atención sin elevar costos y recopilamos datos valiosos.
                </p>
                <a href="#" className="btn btn-outline-primary">Ver más</a>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="servicio-card">
                <div className="servicio-icon">BC</div>
                <h3>BLOCKCHAIN</h3>
                <p>
                  Desarrollamos soluciones Web3 a través de la Metabuild App para gestionar activos, identidad y recompensas. Ofrecemos consultoría en tokenización y modelos descentralizados que empoderan a las comunidades digitales.
                </p>
                <a href="#" className="btn btn-outline-primary">Ver más</a>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="servicio-card">
                <div className="servicio-icon">BIM</div>
                <h3>BIM</h3>
                <p>
                  Metabuild BIM integra modelos 3D con cronogramas y control de obra en entornos virtuales. Detectamos interferencias, mejoramos la coordinación y facilitamos decisiones informadas en tiempo real desde un hub colaborativo.
                </p>
                <a href="#" className="btn btn-outline-primary">Ver más</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metodología Section */}
      <section className="metodologia-section">
        <div className="container">
          <h2 className="section-title">METODOLOGÍA DE IMPLEMENTACIÓN</h2>
          <div className="row">
            <div className="col-md-3">
              <div className="metodologia-item">
                <div className="metodologia-icon">1</div>
                <h4>IDENTIFICACIÓN DE OPORTUNIDAD</h4>
                <p>Detectamos necesidades reales mediante análisis colaborativo.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="metodologia-item">
                <div className="metodologia-icon">2</div>
                <h4>PROPUESTA DE VALOR</h4>
                <p>Diseñamos soluciones personalizadas con enfoque estratégico.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="metodologia-item">
                <div className="metodologia-icon">3</div>
                <h4>SOLUCIÓN</h4>
                <p>Implementamos herramientas innovadoras y tecnología 4.0</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="metodologia-item">
                <div className="metodologia-icon">4</div>
                <h4>SEGUIMIENTO Y AJUSTES</h4>
                <p>Monitoreamos resultados y optimizamos continuamente el sistema</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios Section */}
      <section className="testimonios-section">
        <div className="container">
          <h2 className="section-title">TESTIMONIOS</h2>
          <div className="row">
            <div className="col-lg-4">
              <div className="testimonio-card">
                <div className="testimonio-logo">
                  <img src="/assets/images/logo_cordillera.png" alt="Parque Cordillera" />
                </div>
                <blockquote>
                  "El metaverso tiene un enorme potencial para la educación ambiental. Es una herramienta atractiva, especialmente para niños, que permite aprender sobre la naturaleza de forma lúdica e inmersiva."
                </blockquote>
                <div className="testimonio-autor">
                  <strong>CARLOS RIVAS</strong><br />
                  JEFE DE OPERACIONES, PARQUE CORDILLERA
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="testimonio-card">
                <div className="testimonio-logo">
                  <img src="/assets/images/logo_fintechile.png" alt="FinteChile" />
                </div>
                <blockquote>
                  "La experiencia en el metaverso ha sido increíble. Nos permite llegar a audiencias globales y proyectar nuestra marca más allá del país. Creemos firmemente en el potencial de esta tecnología."
                </blockquote>
                <div className="testimonio-autor">
                  <strong>JAZMÍN JORQUERA</strong><br />
                  DIRECTORA EJECUTIVA, FINTECHILE
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="testimonio-card">
                <div className="testimonio-logo">
                  <img src="/assets/images/logo_uni.png" alt="Universidad Católica" />
                </div>
                <blockquote>
                  "La tecnología inmersiva aplicada a la enseñanza nos permite recrear ensayo de materiales de construcción y llevar los laboratorios al terreno virtual. Es un recurso poderoso para el aprendizaje aplicado."
                </blockquote>
                <div className="testimonio-autor">
                  <strong>FELIPE OSSIO</strong><br />
                  DIRECTOR, ESCUELA CONSTRUCCIÓN CIVIL UC
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h3>Contacto</h3>
              <p><strong>AGENDAR REUNIÓN</strong></p>
              <p>contacto@metabuildcity.com</p>
              <p>Av. Providencia 1208, Of. 207, Providencia, Chile</p>
            </div>
            <div className="col-lg-6">
              <div className="social-links">
                <a href="#" className="social-link">YouTube</a>
                <a href="#" className="social-link">Instagram</a>
                <a href="#" className="social-link">Facebook</a>
                <a href="#" className="social-link">LinkedIn</a>
                <a href="#" className="social-link">Twitter</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Meta Build City. Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MetabuildLanding; 