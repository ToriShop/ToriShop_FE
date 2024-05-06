import { useNavigate } from "react-router-dom";

export const ProductCreatePage = () => {
  const navigate = useNavigate();
  const createProduct = async () => {
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "AUTH-TOKEN": token,
        },
        body: JSON.stringify({
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
      alert("생성됐습니다.");
      navigate("/admin/product");
    } catch (err) {
      alert("생성 실패");
      console.log(err);
    }
  };
  return (
    <>
      <h3>상품 생성</h3>

      <div>
        <label>상품명</label>
        <input type="text" id="name" required />
        <br />
        <label>가격</label>
        <input type="text" id="price" required />
        <br />
        <label>재고</label>
        <input type="text" id="stock" required />
        <br />
        <label>카테고리</label>
        <input type="text" id="category" required />
        <br />
        <label>설명</label>
        <input type="text" id="description" required />
        <br />
        <label>이미지</label>
        <input type="text" id="image" required />
        <br />
      </div>

      <button
        onClick={() => {
          createProduct();
        }}
      >
        생성하기
      </button>
    </>
  );
};
