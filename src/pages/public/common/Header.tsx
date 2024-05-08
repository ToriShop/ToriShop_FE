import { useNavigate } from "react-router-dom";
import { useSession } from "../../../contexts/session-context";

const Header = () => {
  const { session, signOut } = useSession();
  const navigate = useNavigate();

  const logout = () => {
    signOut();
    navigate("/login");
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand" href="/customer/product">
            TORI MALL
          </a>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navJoin"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* 로그인 상태에 따라 회원가입/로그인 항목을 렌더링 */}
              {!session?.user && (
                <>
                  <li className="nav-item">
                    <a className="nav-link" href="/login">
                      로그인
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/customer/product">
                      상품목록
                    </a>
                  </li>
                </>
              )}

              {/* 로그인 상태일 때 로그아웃 및 1:1 문의 등 항목 렌더링 */}
              {session.user && (
                <>
                  <li className="nav-item">
                    <div className="nav-link" onClick={logout}>
                      로그아웃
                    </div>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/customer/cart">
                      장바구니
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/customer/product">
                      상품목록
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/customer/mypage">
                      마이페이지
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
