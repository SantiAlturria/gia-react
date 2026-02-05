import { useNavigate } from "react-router-dom";
import "./CatalogoHome.css";
export default function CatalogoHome() {
  const navigate = useNavigate();

  return (
    <section className="catalogo-home">
      <h2>Elegí una categoría</h2>

      <div className="catalogo-opciones">
        <button
          className="catalogo-btn"
          onClick={() => navigate("/catalogo/Salado")}
        >
          Salado
        </button>

        <button
          className="catalogo-btn"
          onClick={() => navigate("/catalogo/Dulce")}
        >
          Dulce
        </button>
      </div>
    </section>
  );
}
