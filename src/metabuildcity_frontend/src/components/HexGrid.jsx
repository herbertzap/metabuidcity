import React, { useEffect } from "react";
import "./hexgrid.scss"; // Importa los estilos

const HexGrid = () => {
  useEffect(() => {
    const svg = document.getElementById("hexGrid");
    const statusDiv = document.getElementById("selectedSeats");
    const hexSize = 40;
    const selectedSeats = new Set();

    function createHexagon(x, y, id, status = "available") {
      const points = [
        [x + hexSize * Math.cos(0), y + hexSize * Math.sin(0)],
        [x + hexSize * Math.cos(Math.PI / 3), y + hexSize * Math.sin(Math.PI / 3)],
        [x + hexSize * Math.cos((2 * Math.PI) / 3), y + hexSize * Math.sin((2 * Math.PI) / 3)],
        [x + hexSize * Math.cos(Math.PI), y + hexSize * Math.sin(Math.PI)],
        [x + hexSize * Math.cos((4 * Math.PI) / 3), y + hexSize * Math.sin((4 * Math.PI) / 3)],
        [x + hexSize * Math.cos((5 * Math.PI) / 3), y + hexSize * Math.sin((5 * Math.PI) / 3)],
      ]
        .map((point) => point.join(","))
        .join(" ");

      const hex = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      hex.setAttribute("points", points);
      hex.setAttribute("class", `hexagon ${status}`);
      hex.setAttribute("data-id", id);
      hex.addEventListener("click", () => handleHexClick(hex));
      svg.appendChild(hex);
    }

    function createGrid(rows, cols) {
      const centerX = (cols - 1) / 2;
      const centerY = (rows - 1) / 2;
      const radius = Math.min(rows, cols) / 2;
  
      for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
              const x = col * (hexSize * 1.5);
              const y = row * (hexSize * Math.sqrt(3)) + (col % 2 ? hexSize * Math.sqrt(3) / 2 : 0);
              const distance = Math.sqrt((col - centerX) ** 2 + (row - centerY) ** 2);
  
              if (distance < radius) {
                  const status = Math.random() > 0.8 ? 'sold' : 'available';
                  createHexagon(x, y, `${row}-${col}`, status);
              }
          }
      }
  }
  

    function handleHexClick(hex) {
      const id = hex.getAttribute("data-id");
      if (hex.classList.contains("sold") || hex.classList.contains("reserved")) return;

      if (hex.classList.contains("selected")) {
        hex.classList.remove("selected");
        selectedSeats.delete(id);
      } else {
        hex.classList.add("selected");
        selectedSeats.add(id);
      }
      updateStatus();
    }

    function updateStatus() {
      statusDiv.innerHTML = `Seleccionados: ${selectedSeats.size}<br>${[...selectedSeats].join(", ")}`;
    }

    createGrid(10, 10);
  }, []);

  return (
    <div className="container hxcontainer">
      <div id="hexContainer">
<svg width="500" height="600" viewBox="0 50 500 500">
    <defs>
        <clipPath id="hexMask">
            <polygon points="250,20 470,140 470,360 250,480 30,360 30,140" />
        </clipPath>
    </defs>
    <g id="hexGrid" clipPath="url(#clipPath)"></g>
</svg>
      </div>
      <div className="legend">
        <div>
          <span style={{ backgroundColor: "#5bc0de" }}></span> Seleccionado
        </div>
        <div>
          <span style={{ backgroundColor: "#d9534f" }}></span> Vendido
        </div>
        <div>
          <span style={{ backgroundColor: "#f1c40f" }}></span> Reservado
        </div>
        <div>
          <span style={{ backgroundColor: "#ccc" }}></span> Disponible
        </div>
        <div>
          <span style={{ backgroundColor: "#000" }}></span> No disponible
        </div>
      </div>
      <div id="status">
        <strong>Estado:</strong>
        <div id="selectedSeats">Seleccionados: 0</div>
      </div>
    </div>
  );
};

export default HexGrid;
