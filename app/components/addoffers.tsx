"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaGlobe,
  FaMapMarkerAlt,
  FaSearch,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
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

interface UploadState {
  status: "idle" | "uploading" | "success" | "error";
  message: string;
  url?: string;
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
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image validation function
  const validateImage = (file: File): { isValid: boolean; message: string } => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        message: "Please select a valid image file (JPEG, PNG, or WebP)",
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        message: "Image size must be less than 5MB",
      };
    }

    return { isValid: true, message: "" };
  };

  // Upload image to presigned URL
  const uploadImageToPresignedUrl = async (file: File): Promise<string> => {
    try {
      setUploadState({ status: "uploading", message: "Getting upload URL..." });

      // Get presigned URL
      const presignedResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/get-presigned-url`,
        {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }
      );

      if (!presignedResponse.data.uploadURL) {
        throw new Error("Failed to get upload URL");
      }

      setUploadState({ status: "uploading", message: "Uploading image..." });

      // Upload file to presigned URL
      const uploadResponse = await fetch(presignedResponse.data.uploadURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }

      const imageUrl = presignedResponse.data.url;

      setUploadState({
        status: "success",
        message: "Image uploaded successfully!",
        url: imageUrl,
      });

      return imageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload image";
      setUploadState({
        status: "error",
        message: errorMessage,
      });
      throw error;
    }
  };

  // Handle image selection and upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset upload state
    setUploadState({ status: "idle", message: "" });

    // Validate image
    const validation = validateImage(file);
    if (!validation.isValid) {
      setUploadState({
        status: "error",
        message: validation.message,
      });
      return;
    }

    // Set preview immediately
    setPreview(URL.createObjectURL(file));
    setOfferImage(file);

    // Upload image
    try {
      await uploadImageToPresignedUrl(file);
    } catch (error) {
      console.log(error);
      // Error is already handled in uploadImageToPresignedUrl
      // Keep the preview but show error state
    }
  };

  const postOffer = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if image is required and validate upload state
    if (offerImage && uploadState.status === "uploading") {
      alert("Please wait for the image to finish uploading.");
      return;
    }

    if (offerImage && uploadState.status === "error") {
      alert("Please fix the image upload error before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("offerName", offerName);
      submitData.append("offerDescription", offerDescription);
      submitData.append("offerType", offerType);
      submitData.append("offerPrice", offerPrice?.toString() || "");
      submitData.append("offerDiscount", offerDiscount?.toString() || "");
      submitData.append("offerStartDate", offerStartDate);
      submitData.append("offerEndDate", offerEndDate);
      submitData.append("id", storeid);

      // Add image URL if upload was successful
      if (uploadState.status === "success" && uploadState.url) {
        submitData.append("offerImage", uploadState.url);
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/postOffer`,
        submitData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Offer created successfully:", res.data);
      alert("Offer posted successfully!");

      // Reset form
      setOfferName("");
      setOfferDescription("");
      setOfferType("trending");
      setOfferPrice(null);
      setOfferDiscount(null);
      setOfferStartDate("");
      setOfferEndDate("");
      setOfferImage(null);
      setStoreid("");
      setPreview(null);
      setUploadState({ status: "idle", message: "" });
    } catch (err) {
      console.error("Error creating offer:", err);
      alert("Failed to post offer.");
    } finally {
      setIsSubmitting(false);
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

  // Get upload status icon
  const getUploadStatusIcon = () => {
    switch (uploadState.status) {
      case "uploading":
        return <FaSpinner className="animate-spin text-blue-500" />;
      case "success":
        return <FaCheckCircle className="text-green-500" />;
      case "error":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  // Get upload status color
  const getUploadStatusColor = () => {
    switch (uploadState.status) {
      case "uploading":
        return "text-blue-500";
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      default:
        return "text-secondary";
    }
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
              <div className="w-full h-48 rounded-lg bg-surface border-2 border-dashed border-primary mb-4 overflow-hidden flex items-center justify-center relative">
                {preview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {/* Upload status overlay */}
                    {uploadState.status === "uploading" && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-white text-center">
                          <FaSpinner className="animate-spin text-2xl mx-auto mb-2" />
                          <p>Uploading...</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p className="text-secondary mb-2">
                      Upload Offer Image or Banner
                    </p>
                    <label className="px-4 py-2 bg-surface border border-primary rounded-lg text-primary hover:bg-card cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={uploadState.status === "uploading"}
                      />
                      Select Image
                    </label>
                  </div>
                )}
              </div>

              {/* Upload status message */}
              {uploadState.message && (
                <div
                  className={`flex items-center gap-2 mt-2 ${getUploadStatusColor()}`}
                >
                  {getUploadStatusIcon()}
                  <span className="text-sm">{uploadState.message}</span>
                </div>
              )}

              {/* Image validation info */}
              <div className="text-xs text-secondary mt-2 text-center">
                <p>Supported formats: JPEG, PNG, WebP</p>
                <p>Maximum size: 5MB</p>
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
            disabled={
              isSubmitting ||
              uploadState.status === "uploading" ||
              uploadState.status === "error"
            }
            className="px-4 py-2 bg-white text-black cursor-pointer text-base rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && <FaSpinner className="animate-spin" />}
            {isSubmitting ? "Creating Offer..." : "Create Offer"}
          </button>
        </div>
      </form>
    </div>
  );
}
