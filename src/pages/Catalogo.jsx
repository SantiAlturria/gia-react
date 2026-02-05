import { useParams } from "react-router-dom";
import ProductsList from "../components/ProductsList/ProductsList";

export default function Catalogo() {
  const { categoria } = useParams();

  return <ProductsList categoria={categoria} />;
}