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
        alert("삭제되었습니다.");
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
    <tr className="border hover:bg-gray-100">
      <td className="p-2 border">{product.name}</td>
      <td className="p-2 border">{product.price}</td>
      <td className="p-2 border">{product.stock}</td>
      <td className="p-2 border">{product.category}</td>
      <td className="p-2 border">{product.description}</td>
      {/* <td className="p-2 border">{product.createDate?.toLocaleDateString()}</td>
      <td className="p-2 border">{product.updateDate?.toLocaleDateString()}</td> */}
      <td className="p-2 border">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded p-1"
          onClick={() => goToUpdate(product)}
        >
          수정
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white rounded p-1 ml-2"
          onClick={() => deleteProduct(product.id)}
        >
          삭제
        </button>
      </td>
    </tr>
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
    <div className="container mx-auto p-4">
      <button
        className="bg-green-500 hover:bg-green-600 text-white rounded p-2 mb-4"
        onClick={goToCreate}
      >
        상품 추가하기
      </button>

      {loading && <h1>Loading...</h1>}
      {error && <h1>{error}</h1>}

      <h4 className="text-lg font-bold mb-2">PRODUCT LIST</h4>

      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">이름</th>
            <th className="p-2 border">가격</th>
            <th className="p-2 border">재고</th>
            <th className="p-2 border">카테고리</th>
            <th className="p-2 border">설명</th>
            <th className="p-2 border">동작</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <Product
              key={product.id}
              product={product}
              onDelete={handleDeleteProduct}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
