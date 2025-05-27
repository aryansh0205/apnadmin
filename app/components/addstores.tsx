"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaStore,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLandmark,
} from "react-icons/fa";
import axios from "axios";

export default function AddStore() {
  // const [pincode, setPincode] = useState("");
  // const [city, setCity] = useState("");
  // const [state, setState] = useState("");
  // const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    type: "store",
    phone: "",
    age: "",
    gender: "",
    location: "",
    bio: "",
    coins: "",
    email: "",
    businessType: "",
    completeAddress: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    gmaplink: "",
  });

  const [verificationStatus, setVerificationStatus] = useState({
    contactVerified: false,
    emailVerified: false,
  });

  const handlePincodeChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      pincode: value,
    }));

    if (value.length === 6) {
      try {
        const res = await axios.get(
          `https://api.postalpincode.in/pincode/${value}`
        );
        console.log(res?.data, "pincode");
        const postOffice = res.data?.[0]?.PostOffice?.[0];

        if (postOffice) {
          setFormData((prev) => ({
            ...prev,
            city: postOffice.District,
            state: postOffice.State,
          }));
          // setCity(postOffice.District);
          // setState(postOffice.State);
          // setError("");
        } else {
          // setCity("");
          // setState("");
          // setError("Invalid pincode");
        }
      } catch (err) {
        console.error(err);
        // setError("Failed to fetch location");
      }
    } else {
      // setCity("");
      // setState("");
      // setError("");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const AddStoreUSER = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/createuser`,
        formData
      );
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Handle form submission
  //   console.log({ ...formData, ...verificationStatus });
  // };

  const verifyContact = () => {
    // Add verification logic
    setVerificationStatus((prev) => ({ ...prev, contactVerified: true }));
  };

  const verifyEmail = () => {
    // Add verification logic
    setVerificationStatus((prev) => ({ ...prev, emailVerified: true }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/stores" className="text-secondary hover:text-primary">
          <FaArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-primary">Register New Store</h1>
      </div>

      <form
        onSubmit={AddStoreUSER}
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
                <label className=" text-sm font-medium text-secondary mb-1 flex items-center gap-1">
                  <FaStore /> Store Name *
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className=" text-sm font-medium text-secondary mb-1 flex items-center gap-1">
                  <FaUser /> Owner Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className=" text-sm font-medium text-secondary mb-1 flex items-center gap-1">
                  <FaPhone /> Contact Number *
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={verifyContact}
                    disabled={verificationStatus.contactVerified}
                    className={`px-3 text-sm rounded-lg ${
                      verificationStatus.contactVerified
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-surface text-primary border border-primary hover:bg-primary/10"
                    }`}
                  >
                    {verificationStatus.contactVerified ? "Verified" : "Verify"}
                  </button>
                </div>
              </div>
              <div>
                <label className=" text-sm font-medium text-secondary mb-1 flex items-center gap-1">
                  <FaEnvelope /> Email *
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={verifyEmail}
                    disabled={verificationStatus.emailVerified}
                    className={`px-3 text-sm rounded-lg ${
                      verificationStatus.emailVerified
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-surface text-primary border border-primary hover:bg-primary/10"
                    }`}
                  >
                    {verificationStatus.emailVerified ? "Verified" : "Verify"}
                  </button>
                </div>
              </div>
              <div className="">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="user">user</option>
                    <option value="Guest">Guest</option>
                    <option value="store">store</option>
                    <option value="creator">creator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">
                    Type *
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Retail">Retail</option>
                    <option value="Food">Food</option>
                    <option value="Services">Services</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Location Details Section */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-primary mb-4 pb-2 border-b border-primary">
              Location Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className=" text-sm font-medium text-secondary mb-1 flex items-center gap-1">
                  <FaMapMarkerAlt /> Complete Address *
                </label>
                <textarea
                  name="completeAddress"
                  value={formData.completeAddress}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className=" text-sm font-medium text-secondary mb-1 flex items-center gap-1">
                  <FaLandmark /> landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handlePincodeChange}
                  // value={formData.pincode}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  required
                />
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Latitude
                </label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                />
              </div> */}
              {/* <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Longitude
                </label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                />
              </div> */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Google Maps Link
                </label>
                <input
                  type="text"
                  name="googleMapsLink"
                  value={formData.gmaplink}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Link
            href="/stores"
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-surface"
          >
            Cancel
          </Link>
          <button
            onClick={AddStoreUSER}
            type="submit"
            className="px-4 py-2 bg-primary text-base bg-white text-black rounded-lg hover:bg-accent-hover"
          >
            Register Store
          </button>
        </div>
      </form>
    </div>
  );
}
