"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "../../../../../utils/axiosInstance";
import { ROLE_OPTIONS } from "../../../../../utils/roles";

const EditUser = () => {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const fields = [
    { name: "Name", placeholder: "Full Name" },
    { name: "Email", placeholder: "Email Address" },
    { name: "MobileNo", placeholder: "Mobile Number" },
    { name: "Address1", placeholder: "Address" },
    { name: "Designation", placeholder: "Designation" },
    { name: "District", placeholder: "District" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get(`/users/${id}`);
        setForm(data.user);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateRole = async () => {
    try {
      setLoading(true);
      await API.patch(`/users/${id}/role`, {
        roleId: Number(form.Roll_ID),
      });

      alert("Role updated");
      router.push("/users");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  if (!form._id)
    return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className=" mx-auto bg-white shadow-xl rounded-2xl p-8">

        {/* Header */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Edit User
        </h2>

        {/* Grid Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Dynamic Fields */}
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">
                {field.placeholder}
              </label>
              <input
                name={field.name}
                value={form[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          ))}

          {/* Gender */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Gender</label>
            <select
              name="Gender"
              value={form.Gender || ""}
              onChange={handleChange}
              className="border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* DOB */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Date of Birth</label>
            <input
              type="date"
              name="DOB"
              value={form.DOB ? form.DOB.split("T")[0] : ""}
              onChange={handleChange}
              className="border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm text-gray-600 mb-1">Role</label>
            <select
              name="Roll_ID"
              value={form.Roll_ID || ""}
              onChange={handleChange}
              disabled={form.Roll_ID === 1}
              className="border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Role</option>
              {ROLE_OPTIONS.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>

            {form.Roll_ID === 1 && (
              <p className="text-red-500 text-sm mt-1">
                Admin role cannot be changed
              </p>
            )}
          </div>
        </div>

        {/* Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleUpdateRole}
            disabled={loading || form.Roll_ID === 1}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2.5 rounded-lg shadow-md"
          >
            {loading ? "Updating..." : "Update Role"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;