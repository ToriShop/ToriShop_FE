import { useEffect, useState } from "react";
import { useSession } from "../../../contexts/session-context";
import { AdminType, CustomerType } from "../common/Type";

type AdminProps = {
  admin?: AdminType;
};
type CustomerProps = {
  customer?: CustomerType;
};

const Admin = ({ admin }: AdminProps) => {
  if (!admin) return null;
  return (
    <tr>
      <td className="border px-4 py-2">{admin.username}</td>
      <td className="border px-4 py-2">{admin.userRole}</td>
      <td className="border px-4 py-2">{admin.code}</td>
    </tr>
  );
};

const Customer = ({ customer }: CustomerProps) => {
  if (!customer) return null;
  return (
    <tr>
      <td className="border px-4 py-2">{customer.username}</td>
      <td className="border px-4 py-2">{customer.userRole}</td>
      <td className="border px-4 py-2">{customer.phoneNumber}</td>
      <td className="border px-4 py-2">{customer.email}</td>
      <td className="border px-4 py-2">{customer.address}</td>
      <td className="border px-4 py-2">{customer.totalOrderAmount}</td>
      <td className="border px-4 py-2">{customer.tier}</td>
    </tr>
  );
};

export const UserManagementPage = () => {
  const [admins, setAdmins] = useState<AdminType[]>([]);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [isAdmin, setIsAdmin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { session } = useSession();

  const handleOptionChange = (e: { target: { value: string } }) => {
    setIsAdmin(e.target.value === "admin");
  };

  useEffect(() => {
    if (session.user) {
      const { token } = session.user;
      (async function () {
        try {
          // 관리자를 가져오는 요청
          const adminRes = await fetch("http://localhost:8080/admin", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "AUTH-TOKEN": token,
            },
          });

          if (!adminRes.ok) {
            setError("ERROR!!!");
          } else {
            const response = await adminRes.json();
            const admin = response.map((item: any) => ({
              id: item.id,
              username: item.username,
              userRole: item.userRole,
              adminId: item.admin.id,
              code: item.admin.code,
            }));
            setAdmins(admin);
          }

          // 고객을 가져오는 요청
          const customerRes = await fetch("http://localhost:8080/customer", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "AUTH-TOKEN": token,
            },
          });

          if (!customerRes.ok) {
            setError("ERROR!!!");
          } else {
            const response = await customerRes.json();
            const customer = response.map((item: any) => ({
              id: item.id,
              username: item.username,
              userRole: item.userRole,
              customerId: item.customer.id,
              phoneNumber: item.customer.phoneNumber,
              email: item.customer.email,
              address: item.customer.address,
              totalOrderAmount: item.customer.totalOrderAmount,
              tier: item.customer.tier.tier,
            }));
            setCustomers(customer);
          }
        } catch (err) {
          if (err instanceof Error && err.name !== "AbortError") {
            setError("ERROR!!");
          }
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [session.user]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">사용자 목록</h1>

      <div className="flex mb-4">
        <div className="mr-4">
          <input
            type="radio"
            id="admin"
            name="pageOption"
            value="admin"
            checked={isAdmin}
            onChange={handleOptionChange}
          />
          <label htmlFor="admin" className="ml-2">
            관리자
          </label>
        </div>
        <div>
          <input
            type="radio"
            id="customer"
            name="pageOption"
            value="customer"
            checked={!isAdmin}
            onChange={handleOptionChange}
          />
          <label htmlFor="customer" className="ml-2">
            고객
          </label>
        </div>
      </div>

      <p className="text-xl mb-2">{isAdmin ? "관리자 목록" : "고객 목록"}</p>

      {loading && <h1 className="text-xl">Loading...</h1>}
      {error && <h1 className="text-xl">{error}</h1>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          {isAdmin && (
            <tr>
              <th className="border px-4 py-2">Username</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Code</th>
            </tr>
          )}
          {!isAdmin && (
            <tr>
              <th className="border px-4 py-2">Username</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Phone Number</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Address</th>
              <th className="border px-4 py-2">Total Order Amount</th>
              <th className="border px-4 py-2">Tier</th>
            </tr>
          )}
        </thead>
        <tbody>
          {isAdmin &&
            admins?.map((admin) => <Admin key={admin.id} admin={admin} />)}

          {!isAdmin &&
            customers?.map((customer) => (
              <Customer key={customer.id} customer={customer} />
            ))}
        </tbody>
      </table>
    </div>
  );
};
