import React from "react";
import "./TapaCarousel.scss"; // Archivo de estilos

const tapaCarousel = () => {
  return (
    <div className="tapaCarousel-container text-white">
      <div className="container text-letf">
      <div className="row">
        <div className="col-md-8 col-md-offset-1 mt-5">
                                        <h2 className="mbr-section-title display-1">Metabuilcity</h2>
                                        <p className="w-75 mbr-section-lead lead">Experiencias Inmersivas, Metaversos y
                                        Capacitación Virtual. "Soluciones reales para un ecosistema digital"</p>

                                        <div className="mbr-section-btn">
                                            <a className="btn btn-lg btn-primary" href="#">VER PLANES</a>  
                                        </div>
                                    </div>
                                </div>
      </div>
    </div>
  );
};

export default tapaCarousel;
