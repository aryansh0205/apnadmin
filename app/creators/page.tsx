"use client";
import { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaTrash, FaUser } from "react-icons/fa";
import AddCreator from "../components/addcreator";

import axios from "axios";

interface Creator {
  _id: string;
  name: string;
  handle: string;
  email: string;
  category: string;
  type: string;
  followers: string;
  status: string;
  creatorLocation?: string; // Added optional property
  creatorImage?: string; // Added optional property for image
  creatorType?: string; // Added optional property for type
  creatorName?: string; // Added optional property for name
  fullName?: string; // Added optional property for full name
  creatorCategory?: string; // Added optional property for category
  creatorEmail?: string; // Added optional property for email
  creatorPhone?: string; // Added optional property for phone
  imageUrl: string;
}

export default function CreatorsPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  const [creatorData, setCreatorData] = useState<Creator[]>([]);

  const getCreater = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/getCreatorsAdmin`
      );

      if (res.status === 200 && Array.isArray(res?.data?.processedCreators)) {
        setCreatorData(res?.data?.processedCreators);
      } else {
        console.warn("Unexpected data format", res?.data?.processedCreators);
        setCreatorData([]); // fallback to empty array
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setCreatorData([]); // fallback to empty array
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!id) return;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/deleteCreator/${id}`
      );
      if (res.status === 200) {
        alert("Creator deleted!");
        getCreater(); // refresh list
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete creator");
    }
  };
  const searchCreators = async (query: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/searchCreators`,
        { params: { query } }
      );
      setCreatorData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCreater();
  }, []);

  return (
    <div className="space-y-6">
      {/* header  */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Creators</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-base rounded-lg hover:bg-accent-hover transition-all"
        >
          <FaPlus /> Add Creator
        </button>
      </div>

      {showAddForm && (
        <div className="bg-surface border border-primary rounded-lg p-4">
          <AddCreator />
        </div>
      )}

      <div className="bg-card rounded-lg border border-primary">
        <div className="p-4 border-b border-primary flex justify-between items-center">
          <div className="relative w-64">
            <FaSearch className="absolute left-3 top-3 text-secondary" />
            <input
              type="text"
              onChange={(e) => searchCreators(e.target.value)}
              placeholder="Search creators..."
              className="w-full pl-10 pr-4 py-2 bg-surface border border-primary rounded-lg text-primary focus:outline-none"
            />
          </div>
          {/* <div className="flex items-center gap-2 text-sm">
            <span className="text-secondary">Status:</span>
            <select className="bg-surface border border-primary rounded-lg px-3 py-1 text-primary">
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div> */}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-primary">
              <tr>
                <th className="py-4 px-6 text-left text-secondary font-medium">
                  Creator
                </th>
                <th className="py-4 px-6 text-left text-secondary font-medium">
                  ID
                </th>
                <th className="py-4 px-6 text-left text-secondary font-medium">
                  Category
                </th>
                <th className="py-4 px-6 text-left text-secondary font-medium">
                  Type
                </th>
                <th className="py-4 px-6 text-left text-secondary font-medium">
                  Location
                </th>
                <th className="py-4 px-6 text-right text-secondary font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(creatorData) &&
                creatorData.map((item: Creator, index: number) => (
                  <tr
                    key={index}
                    className="border-b border-primary hover:bg-surface transition-all"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface border border-primary flex items-center justify-center">
                          {!item?.creatorImage ? (
                            <FaUser className="text-secondary" />
                          ) : (
                            <img
                              src={item?.imageUrl}
                              alt="Profile"
                              className="w-full h-full rounded-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-primary font-medium">
                            {item?.fullName}
                          </p>
                          <p className="text-secondary text-sm">
                            {item?.creatorName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-tertiary flex-col flex">
                      {!item?.creatorEmail
                        ? item?.creatorPhone
                        : item?.creatorEmail}
                      {!item?.creatorEmail && item?.creatorPhone}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-xs border border-primary text-primary">
                        {item?.creatorCategory}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-tertiary">
                      {item?.creatorType}
                    </td>
                    <td className="py-4 px-6 text-primary">
                      {item?.creatorLocation}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        {/* <Link
                          href={`/items/edit/${item?._id}`}
                          className="p-2 text-secondary hover:text-primary rounded-lg border border-transparent hover:border-primary"
                        >
                          <FaEdit />
                        </Link> */}
                        <button
                          onClick={() => handleDelete(item?._id)}
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
            Showing 1 to {creatorData?.length} of {creatorData?.length} creators
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
