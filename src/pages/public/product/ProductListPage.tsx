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
    <>
      <div
        onClick={() => goToProductDetail(product)}
        className="product-item"
        style={{
          cursor: "pointer",
          width: "150px",
          borderColor: "grey",
          borderWidth: "1px",
          margin: "10px",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "100px", height: "100px" }}
        />
        <div>{product.name}</div>
        <div>{product.price}</div>
      </div>
    </>
  );
};

export const ProductListPage = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // const controller = new AbortController();
    // const option = controller;
    (async function () {
      try {
        let token: string = localStorage.getItem("accessToken") || "NO_TOKEN";

        const res = await fetch("http://localhost:8080/product", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "AUTH-TOKEN": token,
          },
        });
        if (!res.ok) setError("ERROR!!!");
        const product = await res.json();
        setProducts(product);
      } catch (err) {
        if (err instanceof Error) {
          if (err.name !== "AbortError") setError("ERROR!!");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <h4>PRODUCT LIST</h4>
      {loading && <h1>Loading...</h1>}
      {error && <h1>{error}</h1>}

      {products?.map((product) => (
        <div key={product.id}>
          <Product product={product} />
        </div>
      ))}
    </>
  );
};
