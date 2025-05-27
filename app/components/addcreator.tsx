"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaUser,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import axios from "axios";

interface UploadState {
  status: "idle" | "uploading" | "success" | "error";
  message: string;
  url?: string;
}

export default function AddCreator() {
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
    setCreatorImage(file);

    // Upload image
    try {
      await uploadImageToPresignedUrl(file);
    } catch (error) {
      // Error is already handled in uploadImageToPresignedUrl
      // Keep the preview but show error state
    }
  };

  const addCreator = async () => {
    // Check if image is required and validate upload state
    if (creatorImage && uploadState.status === "uploading") {
      alert("Please wait for the image to finish uploading.");
      return;
    }

    if (creatorImage && uploadState.status === "error") {
      alert("Please fix the image upload error before submitting.");
      return;
    }

    setIsSubmitting(true);

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

      // Add image URL if upload was successful
      if (uploadState.status === "success" && uploadState.url) {
        formDataToSend.append("creatorImage", uploadState.url);
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

      console.log("Creator added successfully:", res.data);
      alert("Creator added successfully!");

      // Reset form
      setFormData({
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
      setCreatorImage(null);
      setPreview(null);
      setUploadState({ status: "idle", message: "" });
    } catch (error) {
      console.error("Error adding creator:", error);
      alert("Failed to add creator.");
    } finally {
      setIsSubmitting(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCreator();
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
                <div className="w-32 h-32 rounded-full bg-surface border-2 border-primary mb-4 overflow-hidden relative">
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
                            <FaSpinner className="animate-spin text-xl mx-auto mb-1" />
                            <p className="text-xs">Uploading...</p>
                          </div>
                        </div>
                      )}
                    </div>
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
                    disabled={uploadState.status === "uploading"}
                  />
                  Upload Photo
                </label>

                {/* Upload status message */}
                {uploadState.message && (
                  <div
                    className={`flex items-center gap-2 mt-2 ${getUploadStatusColor()}`}
                  >
                    {getUploadStatusIcon()}
                    <span className="text-xs">{uploadState.message}</span>
                  </div>
                )}

                {/* Image validation info */}
                <div className="text-xs text-secondary mt-2 text-center">
                  <p>JPEG, PNG, WebP</p>
                  <p>Max 5MB</p>
                </div>
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
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">
                      Age *
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                      min="1"
                      max="120"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
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
                      type="tel"
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
                  <option value="Gaming">Gaming</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Music">Music</option>
                  <option value="Art">Art</option>
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
                  <option value="Artist">Artist</option>
                  <option value="Musician">Musician</option>
                  <option value="Content Creator">Content Creator</option>
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
                  Twitter
                </label>
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  placeholder="https://twitter.com/username"
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
                  placeholder="https://tiktok.com/@username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Snapchat
                </label>
                <input
                  type="url"
                  name="snap"
                  value={formData.snap}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  placeholder="https://snapchat.com/add/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Discord
                </label>
                <input
                  type="text"
                  name="discord"
                  value={formData.discord}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
                  placeholder="username#1234"
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
            disabled={
              isSubmitting ||
              uploadState.status === "uploading" ||
              uploadState.status === "error"
            }
            className="px-4 py-2 bg-white text-black text-base rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && <FaSpinner className="animate-spin" />}
            {isSubmitting ? "Saving Creator..." : "Save Creator"}
          </button>
        </div>
      </form>
    </div>
  );
}
