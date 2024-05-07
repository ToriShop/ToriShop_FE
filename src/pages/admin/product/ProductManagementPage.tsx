import { useNavigate } from "react-router-dom";
import { ProductType } from "../../public/common/Type";
import { useEffect, useState } from "react";

type Props = {
  product?: ProductType;
  onDelete: (productId: number) => void;
};

const Product = ({ product, onDelete }: Props) => {
  const navigate = useNavigate();

  if (!product) return null;

  const goToUpdate = (product: ProductType) => {
    navigate(`/admin/product/${product.id}`, { state: product });
  };

  const deleteProduct = (id: number) => {
    (async function () {
      try {
        let token: string = localStorage.getItem("accessToken") || "NO_TOKEN";

        const res = await fetch(`http://localhost:8080/product/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "AUTH-TOKEN": token,
          },
        });
        if (!res.ok) {
          console.log("RESPONSE ERROR!!!");
          return;
        }
        alert("삭제됐습니다.");
        onDelete(id);
      } catch (err) {
        if (err instanceof Error) {
          if (err.name !== "AbortError") console.log("ERROR!!");
        }
        alert("삭제 실패");
      }
    })();
  };

  return (
    <>
      <div
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
        <div>{product.stock}</div>
        <div>{product.category}</div>
        <div>{product.description}</div>
        {/* <div>{product.createDate.toLocaleDateString()}</div>
        <div>{product.updateDate.toLocaleDateString()}</div> */}
        <button
          style={{
            borderColor: "grey",
            borderWidth: "1px",
          }}
          onClick={() => goToUpdate(product)}
        >
          수정
        </button>
        <button
          style={{
            borderColor: "grey",
            borderWidth: "1px",
          }}
          onClick={() => deleteProduct(product.id)}
        >
          삭제
        </button>
      </div>
    </>
  );
};

export const ProductManagementPage = () => {
  const navigate = useNavigate();
  const goToCreate = () => {
    navigate("/admin/product/create");
  };

  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDeleteProduct = (productId: number) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  };

  useEffect(() => {
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
      <button
        style={{
          borderColor: "grey",
          borderWidth: "1px",
        }}
        onClick={goToCreate}
      >
        상품 추가하기
      </button>
      <br />
      <br />
      <h4>PRODUCT LIST</h4>
      {loading && <h1>Loading...</h1>}
      {error && <h1>{error}</h1>}

      {products?.map((product) => (
        <div key={product.id}>
          <Product product={product} onDelete={handleDeleteProduct} />
        </div>
      ))}
    </>
  );
};
