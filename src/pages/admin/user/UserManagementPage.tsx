import { useEffect, useState } from "react";

type AdminType = {
  id: number;
  username: string;
  userRole: string;
  adminId: number;
  code: string;
};
type AdminProps = {
  admin?: AdminType;
};
type CustomerType = {
  id: number;
  username: string;
  userRole: string;
  customerId: number;
  phoneNumber: string;
  email: string;
  address: string;
  totalOrderAmount: number;
  tier: string;
  joinDate: Date;
};
type CustomerProps = {
  customer?: CustomerType;
};

const Admin = ({ admin }: AdminProps) => {
  if (!admin) return null;
  return (
    <>
      <div
        className="admin-item"
        style={{
          borderColor: "grey",
          borderWidth: "1px",
          margin: "10px",
        }}
      >
        <div>{admin.username}</div>
        <div>{admin.userRole}</div>
        <div>{admin.code}</div>
      </div>
    </>
  );
};

const Customer = ({ customer }: CustomerProps) => {
  if (!customer) return null;
  return (
    <>
      <div
        className="customer-item"
        style={{
          borderColor: "grey",
          borderWidth: "1px",
          margin: "10px",
        }}
      >
        <div>{customer.username}</div>
        <div>{customer.userRole}</div>
        <div>{customer.phoneNumber}</div>
        <div>{customer.email}</div>
        <div>{customer.address}</div>
        <div>{customer.totalOrderAmount}</div>
        <div>{customer.tier}</div>
      </div>
    </>
  );
};

export const UserManagementPage = () => {
  const [admins, setAdmins] = useState<AdminType[]>([]);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [isAdmin, setIsAdmin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleOptionChange = (e: { target: { value: string } }) => {
    setIsAdmin(e.target.value === "admin");
  };

  useEffect(() => {
    (async function () {
      try {
        let token: string = localStorage.getItem("accessToken") || "NO_TOKEN";

        const res = await fetch("http://localhost:8080/admin", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "AUTH-TOKEN": token,
          },
        });
        if (!res.ok) setError("ERROR!!!");
        const response = await res.json();
        const admin: AdminType[] = response.map((item: any) => ({
          id: item.id,
          username: item.username,
          userRole: item.userRole,
          adminId: item.admin.id,
          code: item.admin.code,
        }));
        setAdmins(admin);
      } catch (err) {
        if (err instanceof Error) {
          if (err.name !== "AbortError") setError("ERROR!!");
        }
      } finally {
        setLoading(false);
      }
    })();

    (async function () {
      try {
        let token: string = localStorage.getItem("accessToken") || "NO_TOKEN";

        const res = await fetch("http://localhost:8080/customer", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "AUTH-TOKEN": token,
          },
        });
        if (!res.ok) setError("ERROR!!!");
        const response = await res.json();
        const customer: CustomerType[] = response.map((item: any) => ({
          id: item.id,
          username: item.username,
          userRole: item.userRole,
          customerId: item.customer.id,
          phoneNumber: item.customer.phoneNumber,
          email: item.customer.email,
          address: item.customer.address,
          totalOrderAmount: item.customer.totalOrderAmount,
          tier: item.customer.tier.tier,
          joinDate: item.customer.joinDate,
        }));
        setCustomers(customer);
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
      <h1>사용자 목록</h1>

      <input
        type="radio"
        id="admin"
        name="pageOption"
        value="admin"
        checked={isAdmin}
        onChange={handleOptionChange}
      />
      <label htmlFor="admin">관리자 페이지</label>

      <input
        type="radio"
        id="customer"
        name="pageOption"
        value="customer"
        checked={!isAdmin}
        onChange={handleOptionChange}
      />
      <label htmlFor="customer">고객 페이지</label>

      <p>{isAdmin ? "관리자 목록" : "고객 목록"}</p>

      {loading && <h1>Loading...</h1>}
      {error && <h1>{error}</h1>}

      {isAdmin &&
        admins?.map((admin) => (
          <div key={admin.id}>
            <Admin admin={admin} />
          </div>
        ))}

      {!isAdmin &&
        customers?.map((customer) => (
          <div key={customer.id}>
            <Customer customer={customer} />
          </div>
        ))}
    </>
  );
};
