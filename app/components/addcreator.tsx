"use client";
import { useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import axios from "axios";

export default function AddCreator() {
  // fullName,
  // creatorName,
  // creatorEmail,
  // creatorPhone,
  // creatorType,
  // creatorBio,
  // creatorLocation,
  // creatorAge,
  // creatorGender,
  // creatorCategory,
  // yt,
  // insta,
  // fb,
  // twitter,
  // tiktok,
  // snap,
  // discord,
  const [formData, setFormData] = useState({
    fullName: "",
    handle: "",
    email: "",
    phone: "",
    bio: "",
    category: "",
    location: "",
    age: "",
    gender: "",
    type: "",
    youtube: "",
    instagram: "",
    facebook: "",
    twitter: "",
    tiktok: "",
    snap: "",
    discord: "",
    linkedin: "",
  });

  const [creatorImage, setCreatorImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const addCreator = async () => {
    try {
      const formDataToSend = new FormData();

      // Append all form fields
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("creatorName", formData.handle);
      formDataToSend.append("creatorEmail", formData.email);
      formDataToSend.append("creatorPhone", formData.phone);
      formDataToSend.append("creatorBio", formData.bio);
      formDataToSend.append("creatorLocation", formData.location);
      formDataToSend.append("creatorAge", formData.age);
      formDataToSend.append("creatorGender", formData.gender);
      formDataToSend.append("creatorCategory", formData.category);
      formDataToSend.append("creatorType", formData.type);
      formDataToSend.append("yt", formData.youtube);
      formDataToSend.append("insta", formData.instagram);
      formDataToSend.append("fb", formData.facebook);
      formDataToSend.append("twitter", formData.twitter);
      formDataToSend.append("tiktok", formData.tiktok);
      formDataToSend.append("snap", formData.snap);
      formDataToSend.append("discord", formData.discord);
      formDataToSend.append("linkedIn", formData.linkedin);

      // Append the image if it exists
      if (creatorImage) {
        formDataToSend.append("creatorImage", creatorImage);
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/postCreator`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res.data);
    } catch (error) {
      console.error("Error adding creator:", error);
    }
  };
  console.log(formData, "formData");
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCreatorImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ ...formData, creatorImage });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/creators" className="text-secondary hover:text-primary">
          <FaArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-primary">Add New Creator</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-lg border border-primary p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Section */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-primary mb-4 pb-2 border-b border-primary">
              Profile Information
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-surface border-2 border-primary mb-4 overflow-hidden">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaUser className="text-4xl text-secondary" />
                    </div>
                  )}
                </div>
                <label className="px-4 py-2 bg-surface border border-primary rounded-lg text-primary hover:bg-card cursor-pointer text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  Upload Photo
                </label>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">
                    Full Name *
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
                  <label className="block text-sm font-medium text-secondary mb-1">
                    @Handle *
                  </label>
                  <input
                    type="text"
                    name="handle"
                    value={formData.handle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">
                    lOCATION
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">
                      Age *
                    </label>
                    <input
                      type="text"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">
                      Gender
                    </label>
                    <input
                      type="text"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
              placeholder="Tell us about this creator..."
            />
          </div>

          {/* Specialization Section */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-primary mb-4 pb-2 border-b border-primary">
              Specialization
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Primary Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Food">Food</option>
                  <option value="Tech">Tech</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Travel">Travel</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Creator Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  required
                >
                  <option value="">Select type</option>
                  <option value="Influencer">Influencer</option>
                  <option value="Photographer">Photographer</option>
                  <option value="Videographer">Videographer</option>
                  <option value="Writer">Writer</option>
                  <option value="Chef">Chef</option>
                </select>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-primary mb-4 pb-2 border-b border-primary">
              Social Media
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  YouTube
                </label>
                <input
                  type="url"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  placeholder="https://youtube.com/@username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  placeholder="https://instagram.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  placeholder="https://facebook.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  twitter
                </label>
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  placeholder="https://facebook.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  TikTok
                </label>
                <input
                  type="url"
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  placeholder="https://facebook.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Snap
                </label>
                <input
                  type="url"
                  name="snap"
                  value={formData.snap}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  placeholder="https://facebook.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Link
            href="/creators"
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-surface"
          >
            Cancel
          </Link>
          <button
            type="submit"
            onClick={addCreator}
            className="px-4 py-2 bg-primary bg-white text-black text-base rounded-lg hover:bg-accent-hover"
          >
            Save Creator
          </button>
        </div>
      </form>
    </div>
  );
}
