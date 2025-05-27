"use client";
import { useEffect, useState } from "react";
import {
  FaPlus,
  // FaSearch,
  // FaEdit,
  FaTrash,
  FaStore,
  // FaFilter,
  FaGlobe,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Addoffers from "../components/addoffers";
import axios from "axios";
import moment from "moment";

export default function OffersPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  interface Offer {
    _id: string;
    offerName: string;
    store: string;
    type: string;
    discount: string;
    startDate: string;
    endDate: string;
    status: string;
    offerPrice?: string; // Added offerPrice property
    offerDiscount?: string; // Added offerDiscount property
    offerType?: string; // Added offerType property
    offerStartDate?: string; // Added offerStartDate property
    offerEndDate?: string; // Added offerEndDate property
  }

  const [offers, setOffers] = useState<Offer[]>([]);
  const getOffers = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/getAllOffers`
      );
      if (res.status === 200 && Array.isArray(res?.data?.offers)) {
        setOffers(res.data.offers);
      } else {
        console.warn("Unexpected data format", res?.data?.offers);
        // setOffers([]); // fallback to empty array
      }
    } catch (e) {
      console.error("Fetch error:", e);
      // setOffers([]); // fallback to empty array
    }
  };
  const handleDelete = async (id: string) => {
    try {
      if (!id) return;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/deleteOffer/${id}`
      );
      if (res.status === 200) {
        alert("Store deleted!");
        getOffers(); // refresh list
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete creator");
    }
  };

  useEffect(() => {
    getOffers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Offer</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-base rounded-lg hover:bg-accent-hover transition-all"
        >
          <FaPlus /> Create Offer
        </button>
      </div>

      {showAddForm && (
        <div className="bg-surface border border-primary rounded-lg p-4">
          <Addoffers />
        </div>
      )}

      <div className="bg-card rounded-lg border border-primary">
        {/* <div className="p-4 border-b border-primary flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-64">
            <FaSearch className="absolute left-3 top-3 text-secondary" />
            <input
              type="text"
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-surface border border-primary rounded-lg px-3 py-1">
              <FaFilter className="text-secondary" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent text-primary text-sm focus:outline-none"
              >
                <option value="all">All Offers</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="live">Live</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div> */}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-primary">
              <tr>
                <th className="py-4 px-6 text-left text-secondary font-medium">
                  Offer
                </th>
                <th className="py-4 px-6 text-left text-secondary font-medium">
                  Store
                </th>
                <th className="py-4 px-6 text-left text-secondary font-medium">
                  Type
                </th>
                <th className="py-4 px-6 text-left text-secondary font-medium">
                  Discount
                </th>
                <th className="py-4 px-6 text-left text-secondary font-medium">
                  Validity
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
              {offers.map((offer, index) => (
                <tr
                  key={index}
                  className="border-b border-primary hover:bg-surface transition-all"
                >
                  <td className="py-4 px-6 text-primary font-medium">
                    {offer?.offerName}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <FaStore className="text-secondary" />
                      <span>{offer?._id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        offer?.type === "Online"
                          ? "bg-blue-900/10 text-blue-300 border border-blue-900/20"
                          : "bg-gray-700/10 text-gray-300 border border-gray-700/20"
                      }`}
                    >
                      {offer?.type === "Online" ? (
                        <FaGlobe />
                      ) : (
                        <FaMapMarkerAlt />
                      )}
                      {offer?.offerType}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-primary">
                    {offer?.offerDiscount}
                    <p className="text-tertiary text-[10px]">
                      {offer?.offerPrice}
                    </p>
                  </td>
                  <td className="py-4 px-6 text-tertiary">
                    {moment(offer?.offerStartDate).format("DD-MM-YYYY")} to{" "}
                    {moment(offer?.offerEndDate).format("DD-MM-YYYY")}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        offer?.status === "live"
                          ? "bg-success/10 text-success border border-success/20"
                          : "bg-danger/10 text-danger border border-danger/20"
                      }`}
                    >
                      {offer?.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      {/* <Link
                        href={`/offers/edit/${offer.id}`}
                        className="p-2 text-secondary hover:text-primary rounded-lg border border-transparent hover:border-primary"
                      >
                        <FaEdit />
                      </Link> */}
                      <button
                        onClick={() => handleDelete(offer?._id)}
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
            Showing {offers.length} of {offers.length} offers
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
