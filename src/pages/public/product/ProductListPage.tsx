import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductType } from "../common/Type";

type Props = {
  product?: ProductType;
};

const Product = ({ product }: Props) => {
  const navigate = useNavigate();

  if (!product) return null;

  const goToProductDetail = (product: ProductType) => {
    navigate(`/customer/product/${product.id}`);
  };

  return (
    <div
      onClick={() => goToProductDetail(product)}
      className="product-item cursor-pointer border border-gray-300 m-2 p-2 w-36 hover:shadow-lg"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-24 object-cover mb-2"
      />
      <div className="text-center text-sm">{product.name}</div>
      <div className="text-center text-sm">{product.price}</div>
    </div>
  );
};

export const ProductListPage = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async function () {
      try {
        const token = localStorage.getItem("accessToken") || "NO_TOKEN";

        const res = await fetch("http://localhost:8080/product", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "AUTH-TOKEN": token,
          },
        });
        if (!res.ok) {
          setError("ERROR!!!");
        } else {
          const product = await res.json();
          setProducts(product);
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError("ERROR!!");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container mx-auto">
      <h4 className="text-lg font-bold mb-4">PRODUCT LIST</h4>
      {loading && <h1 className="text-lg">Loading...</h1>}
      {error && <h1 className="text-lg">{error}</h1>}

      <div className="flex flex-wrap">
        {products?.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
