import React, { useState } from "react";
import "./contact-form.scss"; // Archivo de estilos

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    setSubmitted(true);
  };

  return (
    <div className="contact-form-container">
      <h2>Contáctanos</h2>
      <p>Déjanos tu mensaje y te responderemos lo antes posible.</p>

      {submitted ? (
        <p className="success-message">¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Mensaje</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit">Enviar</button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
