import { useParams } from "react-router-dom";
import Theme1 from "./Brands/Theme1/Theme1";
import Theme2 from "./Brands/Theme2/Theme2";

const themeComponents = {
  1: Theme1,
  2: Theme2,
  // Add more mappings if needed
};

function BrandPage() {
  const { num } = useParams();
  const ThemeComponent = themeComponents[num];

  if (!ThemeComponent) {
    return <div>Theme not found for number: {num}</div>;
  }

  return <ThemeComponent />;
}

export default BrandPage;