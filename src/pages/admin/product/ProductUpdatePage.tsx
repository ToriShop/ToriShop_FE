import { useLocation, useNavigate } from "react-router-dom";
import { ProductType } from "../../public/common/Type";
import { ChangeEvent, useState } from "react";
import { useSession } from "../../../contexts/session-context";

export const ProductUpdatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState<ProductType>(location.state);

  const { session } = useSession();

  let url;
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        image: file, // 로컬 URL 생성하여 미리보기용으로 사용
      }));
      url = URL.createObjectURL(file);
    }
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const newValue = event.target.value;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [field]: newValue,
    }));
  };

  const updateProduct = async (productId: number) => {
    if (session.user) {
      const { token } = session.user;
      const formData = new FormData();
      formData.append("id", productId.toString());
      formData.append("name", product.name);
      formData.append("price", product.price.toString());
      formData.append("stock", product.stock.toString());
      formData.append("category", product.category);
      formData.append("description", product.description);
      formData.append("image", product.image);
      try {
        const res = await fetch("http://localhost:8080/product", {
          method: "PUT",
          headers: {
            "AUTH-TOKEN": token,
          },
          body: formData,
        });
        if (!res.ok) {
          console.error("HTTP error:", res.status, res.statusText);
          return;
        }
        alert("수정되었습니다.");
        navigate("/admin/product");
      } catch (err) {
        alert("수정 실패");
        console.error(err);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-bold mb-4">상품 수정</h3>

      <div className="mb-4">
        <div className="mb-2">
          <label className="block font-semibold mb-1" htmlFor="name">
            상품명
          </label>
          <input
            type="text"
            id="name"
            className="border p-2 rounded w-full"
            value={product.name}
            onChange={(e) => handleInputChange(e, "name")}
            required
          />
        </div>

        <div className="mb-2">
          <label className="block font-semibold mb-1" htmlFor="price">
            가격
          </label>
          <input
            type="number"
            id="price"
            className="border p-2 rounded w-full"
            value={product.price}
            onChange={(e) => handleInputChange(e, "price")}
            required
          />
        </div>

        <div className="mb-2">
          <label className="block font-semibold mb-1" htmlFor="stock">
            재고
          </label>
          <input
            type="number"
            id="stock"
            className="border p-2 rounded w-full"
            value={product.stock}
            onChange={(e) => handleInputChange(e, "stock")}
            required
          />
        </div>

        <div className="mb-2">
          <label className="block font-semibold mb-1" htmlFor="category">
            카테고리
          </label>
          <div>
            {[
              "TOPS",
              "BOTTOMS",
              "DRESSES",
              "OUTERWEAR",
              "SHOES",
              "ACCESSORIES",
            ].map((categoryType) => (
              <div key={categoryType} className="mb-1">
                <input
                  type="radio"
                  id={categoryType}
                  name="category"
                  value={categoryType}
                  checked={product.category === categoryType}
                  onChange={(e) => handleInputChange(e, "category")}
                  className="mr-2"
                />
                <label htmlFor={categoryType} className="font-medium">
                  {categoryType}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-2">
          <label className="block font-semibold mb-1" htmlFor="description">
            설명
          </label>
          <input
            type="text"
            id="description"
            className="border p-2 rounded w-full"
            value={product.description}
            onChange={(e) => handleInputChange(e, "description")}
            required
          />
        </div>

        <div className="mb-2">
          <label className="block font-semibold mb-1" htmlFor="image">
            이미지
          </label>
          <img
            src={url}
            alt={product.name}
            className="h-16 w-16 object-cover rounded-lg"
          />
          <input
            type="file"
            id="image"
            className="border p-2 rounded w-full"
            onChange={handleFileChange}
            required
          />
        </div>
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        onClick={() => updateProduct(product.id)}
      >
        수정하기
      </button>
    </div>
  );
};
