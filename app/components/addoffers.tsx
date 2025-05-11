"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaGlobe, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

interface Store {
  _id: string;
  userName: string;
  fullName: string;
  businessType: string;
  phone: string;
  email: string;
  location: string;
  gmaplink: string;
  type: string;
}

export default function AddOffer() {
  const [formData, setFormData] = useState({
    title: "",
    offerName: "",
    offerDescription: "",
    offerType: "",
    offerCategory: "",
    offerStartDate: "",
    offerEndDate: "",
    offerPrice: "",
    offerDiscount: "",

    id: "",
    description: "",
    type: "Online",
    discountType: "percentage",
    discountValue: "",
    originalPrice: "",
    finalPrice: "",
    maxUsage: "",
    validityPeriod: "",
    websiteUrl: "",
    couponCode: "",
    deliveryOptions: "",
    address: "",
    storeId: "",
    offerTag: "", // Trending, Hot, Flash, etc.
  });

  const [stores, setStores] = useState<Store[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [offerName, setOfferName] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [offerType, setOfferType] = useState("trending");
  const [offerPrice, setOfferPrice] = useState<number | null>(null);
  const [offerDiscount, setOfferDiscount] = useState<number | null>(null);
  const [offerStartDate, setOfferStartDate] = useState("");
  const [offerEndDate, setOfferEndDate] = useState("");
  const [offerImage, setOfferImage] = useState<File | null>(null);
  const [storeid, setStoreid] = useState("");

  const postOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("offerName", offerName);
      formData.append("offerDescription", offerDescription);
      formData.append("offerType", offerType);
      formData.append("offerPrice", offerPrice?.toString() || "");
      formData.append("offerDiscount", offerDiscount?.toString() || "");
      formData.append("offerStartDate", offerStartDate);
      formData.append("offerEndDate", offerEndDate);
      formData.append("id", storeid);
      if (offerImage) {
        formData.append("offerImage", offerImage);
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/postOffer`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Offer created successfully:", res.data);
      alert("Offer posted successfully!");
    } catch (err) {
      console.error("Error creating offer:", err);
      alert("Failed to post offer.");
    }
  };

  const getStore = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/getUser`);
      console.log(res.data);
      // Filter stores from the response data
      const storeData =
        res?.data?.filter((user: Store) => user.type === "store") || [];
      setStores(storeData);
      setFilteredStores(storeData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStore();
  }, []);

  // Filter stores based on search query
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredStores(stores);
    } else {
      const filtered = stores.filter((store) =>
        store.userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStores(filtered);
    }
  }, [searchQuery, stores]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/offers" className="text-secondary hover:text-primary">
          <FaArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-primary">Create New Offer</h1>
      </div>

      <form
        onSubmit={postOffer}
        className="bg-card rounded-lg border border-primary p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info Section */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-primary mb-4 pb-2 border-b border-primary">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Offer Title *
                </label>
                <input
                  type="text"
                  name="offerName"
                  value={offerName}
                  onChange={(e) => {
                    setOfferName(e.target.value);
                    setFormData({ ...formData, offerName: e.target.value });
                  }}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  required
                />
              </div>

              {/* Store  */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Store *
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                    placeholder="Search stores..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      // This is redundant since we have the useEffect handling filtering
                      // but keeping for backward compatibility
                      const filtered = stores.filter((store) =>
                        store.userName
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      );
                      setFilteredStores(filtered);
                    }}
                    className="ml-2 text-accent"
                  >
                    <FaSearch />
                  </button>
                </div>
                <select
                  name="storeId"
                  value={storeid}
                  onChange={(e) => setStoreid(e.target.value)}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none mt-2"
                  required
                >
                  <option value="">Select Store</option>
                  {filteredStores.map((store, index) => (
                    <option key={index} value={store._id}>
                      {store.userName} - {store.location || "No location"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary mb-1">
                  Description
                </label>
                <textarea
                  name="offerDescription"
                  value={offerDescription}
                  onChange={(e) => setOfferDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Type *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="offerType"
                      value="online"
                      checked={offerType === "online"}
                      onChange={(e) => setOfferType(e.target.value)}
                      className="text-accent"
                    />
                    <span className="flex items-center gap-1">
                      <FaGlobe /> Online
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="offerType"
                      value="offline"
                      checked={offerType === "offline"}
                      onChange={(e) => setOfferType(e.target.value)}
                      className="text-accent"
                    />
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt /> Offline
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Offer Details Section */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-primary mb-4 pb-2 border-b border-primary">
              Offer Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  {formData.discountType === "percentage"
                    ? "Discount Percentage *"
                    : "Discount Amount *"}
                </label>
                <input
                  type="number"
                  name="offerDiscount"
                  value={offerDiscount || ""}
                  onChange={(e) => setOfferDiscount(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Original Price
                </label>
                <input
                  type="number"
                  name="offerPrice"
                  value={offerPrice || ""}
                  onChange={(e) => setOfferPrice(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Offer Type */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary mb-1">
              Offer Type
            </label>
            <select
              name="offerType"
              value={offerType}
              onChange={(e) => setOfferType(e.target.value)}
              className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
            >
              <option value="">Select Tag</option>
              <option value="trending">Trending</option>
              <option value="hot">Hot</option>
              <option value="event">Event</option>
              <option value="flash">Flash</option>
              <option value="regular">Regular</option>
            </select>
          </div>

          {/* Media Section */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-primary mb-4 pb-2 border-b border-primary">
              Media
            </h2>
            <div className="flex flex-col items-center">
              <div className="w-full h-48 rounded-lg bg-surface border-2 border-dashed border-primary mb-4 overflow-hidden flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <p className="text-secondary mb-2">
                      Upload Offer Image or Banner
                    </p>
                    <label className="px-4 py-2 bg-surface border border-primary rounded-lg text-primary hover:bg-card cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setOfferImage(file);
                            setPreview(URL.createObjectURL(file));
                          }
                        }}
                        className="hidden"
                      />
                      Select Image
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timing Section */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-primary mb-4 pb-2 border-b border-primary">
              Timing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {formData.validityPeriod === "" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="offerStartDate"
                      value={offerStartDate}
                      onChange={(e) => setOfferStartDate(e.target.value)}
                      className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="offerEndDate"
                      value={offerEndDate}
                      onChange={(e) => setOfferEndDate(e.target.value)}
                      className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                      required
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Link
            href="/offers"
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-surface"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-white text-black cursor-pointer text-base rounded-lg hover:bg-accent-hover"
          >
            Create Offer
          </button>
        </div>
      </form>
    </div>
  );
}
