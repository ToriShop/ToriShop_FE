import { useLocation, useNavigate } from "react-router-dom";
import { ProductType } from "../../public/common/Type";

export const ProductUpdatePage = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const product: ProductType = location.state;

  const updateProduct = async (productId: number) => {
    const nameInput = document.getElementById("name") as HTMLInputElement;
    const priceInput = document.getElementById("price") as HTMLInputElement;
    const stockInput = document.getElementById("stock") as HTMLInputElement;
    const categoryInput = document.getElementById(
      "category"
    ) as HTMLInputElement;
    const descriptionInput = document.getElementById(
      "description"
    ) as HTMLInputElement;
    const imageInput = document.getElementById("image") as HTMLInputElement;
    const name: string = nameInput.value;
    const price: number = +priceInput.value;
    const stock: number = +stockInput.value;
    const category: string = categoryInput.value;
    const description: string = descriptionInput.value;
    const image: string = imageInput.value;

    try {
      let token: string = localStorage.getItem("accessToken") || "NO_TOKEN";

      const res = await fetch("http://localhost:8080/product", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "AUTH-TOKEN": token,
        },
        body: JSON.stringify({
          id: productId,
          name: name,
          price: price,
          stock: stock,
          category: category,
          description: description,
          image: image,
        }),
      });
      if (!res.ok) {
        console.error("HTTP error:", res.status, res.statusText);
        return;
      }
      alert("수정됐습니다.");
      navigate("/admin/product");
    } catch (err) {
      alert("수정 실패");
      console.log(err);
    }
  };

  return (
    <>
      <h3>상품 수정</h3>

      <div>
        <label>상품명</label>
        <input type="text" id="name" value={product.name} required />
        <br />
        <label>가격</label>
        <input type="text" id="price" value={product.price} required />
        <br />
        <label>재고</label>
        <input type="text" id="stock" value={product.stock} required />
        <br />
        <label>카테고리</label>
        <input type="text" id="category" value={product.category} required />
        <br />
        <label>설명</label>
        <input
          type="text"
          id="description"
          value={product.description}
          required
        />
        <br />
        <label>이미지</label>
        <input type="text" id="image" value={product.image} required />
        <br />
      </div>

      <button
        onClick={() => {
          updateProduct(product.id);
        }}
      >
        수정하기
      </button>
    </>
  );
};
