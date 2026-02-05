import "./Footer.css";
import { FaWhatsapp, FaInstagram, FaPhoneAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        <div className="footer-contact">
          <a href="https://wa.me/5493534187071" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp />
          </a>

          <a href="https://instagram.com/rosquitas.donas" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>

          <a href="tel:+5493534187071">
            <FaPhoneAlt />
          </a>
        </div>

        <div className="footer-map">
          <iframe
            title="Ubicación"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3344.704967132383!2d-63.5129593!3d-33.0379025!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95ce8117400f8ec7%3A0xc0dcf80c66a11f08!2sRosquitas%20y%20Donas!5e0!3m2!1ses-419!2sar!4v1770252071268!5m2!1ses-419!2sar"
            width="100%"
            height="150"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

      </div>

      <p className="footer-copy">
        © 2026 · Todos los derechos reservados. Sitio realizado por SALTURE
      </p>
    </footer>
  );
}
