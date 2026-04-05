"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import API from "../../../utils/axiosInstance";
import UserSearch from "../../components/Section/searchUsers";
import UIPagination from "../../components/section/ui/pagination";
import ActionDropdown from "../../components/section/ui/ActionDropdown";

const columnHelper = createColumnHelper();

const Users = () => {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // ✅ Fetch Users
  const fetchUsers = useCallback(async (pageNumber = 1, query = "") => {
    try {
      setLoading(true);

      const url = query
        ? `/users/search?query=${encodeURIComponent(query)}`
        : `/users?page=${pageNumber}&limit=${limit}`;

      const { data } = await API.get(url);

      setUsers(data.users);
      setTotalUsers(data.totalUsers ?? data.users.length);
      setTotalPages(data.totalPages ?? 1);
    } catch (error) {
      setUsers([]);
      setTotalUsers(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // 🔍 Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchUsers(page, debouncedQuery);
  }, [page, debouncedQuery, fetchUsers]);

  // ✅ Actions
  const handleUpdate = (id) => router.push(`/admin/allusers/edit/${id}`);
  const handleView = (id) => router.push(`/admin/allusers/${id}`);
  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    await API.delete(`/users/${id}`);
    fetchUsers(page, debouncedQuery);
  };

  // ✅ Columns
  const columns = [
    columnHelper.accessor("_id", {
      header: "ID",
      cell: (info) => (
        <span className="truncate max-w-[150px] block">
          {info.getValue()}
        </span>
      ),
    }),

    columnHelper.accessor("Name", {
      header: "Name",
    }),

    columnHelper.accessor("Email", {
      header: "Email",
    }),

    columnHelper.accessor("createdAt", {
      header: "Created",
      cell: (info) =>
        new Date(info.getValue()).toLocaleDateString(),
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <ActionDropdown
            onUpdate={() => handleUpdate(user._id)}
            onView={() => handleView(user._id)}
            onDelete={() => handleDelete(user._id)}
          />
        );
      },
    }),
  ];

  // ✅ Table instance
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="text-xl font-semibold text-gray-800">
            Total Users: {totalUsers}
          </div>

          <div className="flex-1 max-w-md">
            <UserSearch onSearch={setSearchQuery} />
          </div>

          <button
            onClick={() => router.push("/admin/register")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Add User
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Users List
          </h2>

          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <>
              <table className="w-full border">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id}>
                      {hg.headers.map((header) => (
                        <th key={header.id} className="px-4 py-2 border">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                <tbody>
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="border-b">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-2 border">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-6">
                        No Users Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-center mt-6">
                <UIPagination
                  totalPages={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;