import React, { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  useFamilyMembers,
  useDeleteFamilyMember,
} from "../../mutation/familyMutation";
import type { IFamilyMember } from "./Types/familyTpes";

const FamilyMembersList: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 9; // items per page

  // Fetch all family members with pagination
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFamilyMembers(page, limit);

  // Delete mutation
  const { mutate: deleteFamilyMember, isPending: isDeleting } =
    useDeleteFamilyMember();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this family member?")) {
      deleteFamilyMember(id);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Normalize response → flatten if backend sends nested arrays
  const familyMembers: IFamilyMember[] = Array.isArray(response?.familyMembers)
    ? (response.familyMembers as unknown as IFamilyMember[])
    : Array.isArray(response?.data)
    ? (response.data as unknown as IFamilyMember[][]).flat()
    : [];

  // Search filter
  const filteredMembers = familyMembers.filter(
    (member) =>
      member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.motherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const pagination = response?.pagination;
  const totalPages = pagination?.pages || 1;
  const totalItems = pagination?.total || familyMembers.length;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading family members...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-red-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Error Loading Data</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center text-red-500 mb-4">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 
                    0 1 1 0 012 0zm-1-9a1 1 0 00-1 
                    1v4a1 1 0 102 0V6a1 1 0 
                    00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>
                  {error instanceof Error
                    ? error.message
                    : "An unexpected error occurred"}
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 sm:px-10 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Family Members</h1>
              <p className="mt-2 text-blue-100">
                {totalItems} {totalItems === 1 ? "member" : "members"} in your
                family tree
              </p>
            </div>
            <button
              onClick={() => router.navigate({ to: "/family/create" })}
              className="mt-4 md:mt-0 px-5 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition duration-200 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add New Member
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {familyMembers.length > 0 ? (
              <>
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 
                          8 4 4 0 000-8zM2 8a6 6 0 
                          1110.89 3.476l4.817 
                          4.817a1 1 0 
                          01-1.414 1.414l-4.816-4.816A6 
                          6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search family members..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                      }}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMembers.map((member) => (
                    <div
                      key={member._id}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {member.username}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {member.familyName} Family
                            </p>
                          </div>
                          <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                            {formatDate(member.date)}
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <p className="text-gray-600">
                            👨 Father: {member.fatherName}
                          </p>
                          <p className="text-gray-600">
                            👩 Mother: {member.motherName}
                          </p>
                          <p className="text-gray-600">
                            🎂 Birth: {formatDate(member.date)}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 px-5 py-3 flex justify-between">
                        <button
                          onClick={() =>
                            router.navigate({ to: `/family/${member._id}` })
                          }
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                        </button>
                        <div className="flex space-x-3">
                          <button
                            onClick={() =>
                              router.navigate({
                                to: `/family/${member._id}/edit`,
                              })
                            }
                            className="text-gray-600 hover:text-gray-900 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(member._id)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
                    <div className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {(page - 1) * limit + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(page * limit, totalItems)}
                      </span>{" "}
                      of <span className="font-medium">{totalItems}</span>{" "}
                      results
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-md ${
                          page === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Previous
                      </button>
                      <div className="flex items-center">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (page <= 3) {
                            pageNum = i + 1;
                          } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`mx-1 w-10 h-10 rounded-full ${
                                page === pageNum
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded-md ${
                          page === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No family members yet
                </h3>
                <p className="mt-1 text-gray-500">
                  Get started by adding a new family member.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => router.navigate({ to: "/family/create" })}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add First Member
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyMembersList;
