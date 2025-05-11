"use client";
import { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaTrash,
  FaStore,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaTimes,
} from "react-icons/fa";
import AddStore from "../components/addstores";
import axios from "axios";
import { CiLocationOn } from "react-icons/ci";
interface Store {
  _id: string;
  id: string;
  userName: string;
  fullName: string;
  businessType: string;
  phone: string;
  email: string;
  location: string;
  gmaplink: string;
  type: string;
}
// const stores = [
//   {
//     id: "ST-7832",
//     name: "Fashion Hub",
//     owner: "Alex Johnson",
//     type: "Retail",
//     contact: "+1 (555) 123-4567",
//     email: "contact@fashionhub.com",
//     address: "123 Mall Road, City Center",
//     status: "verified",
//   },
//   {
//     id: "ST-5421",
//     name: "Tasty Bites",
//     owner: "Maria Garcia",
//     type: "Food",
//     contact: "+1 (555) 987-6543",
//     email: "info@tastybites.com",
//     address: "456 Food Street, Downtown",
//     status: "pending",
//   },
// ];

export default function StoresPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const filter = "all";
  const [searchQuery, setSearchQuery] = useState("");

  const [stores, setStore] = useState<Store[]>([]);

  const filteredStores = stores.filter((store) => {
    const matchesFilter = filter === "all";
    const matchesSearch =
      store?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store?.userName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  const getStore = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/getUser`);

      const stores = res?.data;
      stores.forEach((store: Store) => {
        if (store?.type === "store") {
          setStore((prevStores) => [...prevStores, store]);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      if (!id) return;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/deletestore/${id}`
      );
      if (res.status === 200) {
        alert("Store deleted!");
        getStore(); // refresh list
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete creator");
    }
  };
  useEffect(() => {
    getStore();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Stores</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-base rounded-lg hover:bg-accent-hover transition-all"
        >
          <FaPlus /> Add Stores
        </button>
      </div>

      {/* Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="relative bg-surface border border-primary rounded-lg shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto p-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 text-secondary hover:text-danger"
            >
              <FaTimes size={18} />
            </button>
            <AddStore />
          </div>
        </div>
      )}

      {/* Store List Table */}
      <div className="bg-card rounded-lg border border-primary">
        <div className="p-4 border-b border-primary flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-64">
            <FaSearch className="absolute left-3 top-3 text-secondary" />
            <input
              type="text"
              placeholder="Search stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
            />
          </div>

          {/* <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-surface border border-primary rounded-lg px-3 py-1">
              <FaFilter className="text-secondary" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent text-primary text-sm focus:outline-none"
              >
                <option value="all">All Stores</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div> */}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-primary">
              <tr>
                <th className="py-4 px-6 text-left text-secondary font-medium">
                  Store
                </th>
                <th className="py-4 px-6 text-left text-secondary font-medium">
                  Owner
                </th>
                <th className="py-4 px-6 text-left text-secondary font-medium">
                  Type
                </th>
                <th className="py-4 px-6 text-left text-secondary font-medium">
                  Contact
                </th>
                <th className="py-4 px-6 text-left text-secondary font-medium">
                  Status
                </th>
                <th className="py-4 px-6 text-right text-secondary font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store, index) => (
                <tr
                  key={index}
                  className="border-b border-primary hover:bg-surface transition-all"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <FaStore className="text-secondary" />
                      <div>
                        <p className="text-primary font-medium">
                          {store?.userName}
                        </p>
                        <p className="text-tertiary text-sm flex items-center gap-1">
                          <FaMapMarkerAlt size={12} /> {store.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-primary">{store.fullName}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full text-xs border border-primary text-primary">
                      {store.businessType}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1 text-sm text-primary">
                        <FaPhone size={12} /> {store.phone}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-tertiary">
                        <FaEnvelope size={12} /> {store.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {/* <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        store.status === "verified"
                          ? "bg-success/10 text-success border border-success/20"
                          : "bg-warning/10 text-warning border border-warning/20"
                      }`}
                    >
                      {store.status}
                    </span> */}
                    <span className="flex items-center gap-1 text-sm text-tertiary">
                      <CiLocationOn size={12} /> {store.gmaplink} ||{" "}
                      {store.location}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      {/* <Link
                        href={`/stores/edit/${store.id}`}
                        className="p-2 text-secondary hover:text-primary rounded-lg border border-transparent hover:border-primary"
                      >
                        <FaEdit />
                      </Link> */}
                      <button
                        onClick={() => handleDelete(store?._id)}
                        className="p-2 text-secondary hover:text-danger rounded-lg border border-transparent hover:border-danger"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-primary flex justify-between items-center text-sm">
          <span className="text-tertiary">
            Showing {filteredStores.length} of {stores.length} stores
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-primary rounded-lg text-secondary hover:text-primary">
              Previous
            </button>
            <button className="px-3 py-1 border border-primary rounded-lg text-secondary hover:text-primary">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
