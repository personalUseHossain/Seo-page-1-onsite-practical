"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SettingsIcon from "@/public/setting.png";
import LeadChart from "./LeadChart";

// Column component for each column header
const Column = ({ column, index, moveColumn, isVisible }) => {
  const [, drag] = useDrag({
    type: "column", // Defines the type of item being dragged
    item: { index }, // Passes the column's index for identification
  });

  const [, drop] = useDrop({
    accept: "column", // Accept columns to be dropped
    hover: (item) => {
      if (item.index !== index) {
        moveColumn(item.index, index); // Move column to a new position
        item.index = index; // Update the dragged item's index
      }
    },
  });

  return (
    isVisible && (
      <th
        ref={(node) => drag(drop(node))}
        className="border px-6 py-3 cursor-move text-left"
      >
        {column.label}
      </th>
    )
  );
};

// LeadsTable component with the table and column reordering logic
const LeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [columns, setColumns] = useState([
    { id: "id", label: "ID" },
    { id: "client_name", label: "Client Name" },
    { id: "project_type", label: "Project Type" },
    { id: "country", label: "Country" },
    { id: "value", label: "Value" },
    { id: "deadline", label: "Deadline" },
    { id: "project_link", label: "Project Link" },
    { id: "bidding_time", label: "Bidding Time" },
    { id: "actual_value", label: "Actual Value" },
    { id: "deal_status", label: "Status" },
    { id: "added_by", label: "Added By" },
  ]);
  const [columnVisibility, setColumnVisibility] = useState(
    columns.reduce((acc, column) => {
      acc[column.id] = true; // Initially, all columns are visible
      return acc;
    }, {})
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [totalPosts, setTotalPosts] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch leads data from an API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("https://erp.seopage1.net/api/leads");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setLeads(data?.data || []);
        setTotalPosts(data?.data?.length || 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLeads();
  }, []);

  // Handle column reordering
  const moveColumn = (fromIndex, toIndex) => {
    const updatedColumns = [...columns];
    const [movedColumn] = updatedColumns.splice(fromIndex, 1);
    updatedColumns.splice(toIndex, 0, movedColumn);
    setColumns(updatedColumns);
  };

  // Get current posts for the current page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = leads.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toggle column visibility
  const handleColumnVisibilityChange = (columnId) => {
    setColumnVisibility((prevState) => ({
      ...prevState,
      [columnId]: !prevState[columnId],
    }));
  };

  if (!leads.length) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold text-center mb-6">Leads Table</h2>
        <Image
          onClick={() => setModalOpen((prev) => !prev)}
          className="h-7 w-7 cursor-pointer"
          src={SettingsIcon}
          alt="Settings Icon"
        />
      </div>

      {/* Modal for column visibility */}
      {modalOpen && (
        <div className="absolute top-15 right-10 bg-white shadow-lg p-4 z-10">
          <div className="flex gap-5">
            <h3 className="text-xl font-bold">Column Settings</h3>
            <button
              className="font-bold p-2 bg-gray-400"
              onClick={() => setModalOpen(false)}
            >
              X
            </button>
          </div>
          <div className="mt-4">
            {columns.map((column) => (
              <div key={column.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={columnVisibility[column.id]}
                  onChange={() => handleColumnVisibilityChange(column.id)}
                  className="mr-2"
                />
                <label>{column.label}</label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {/* Map through columns and render each one */}
              {columns.map((column, index) => (
                <Column
                  key={column.id}
                  column={column}
                  index={index}
                  moveColumn={moveColumn} // Pass the moveColumn function
                  isVisible={columnVisibility[column.id]} // Pass the visibility state
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                {columns.map(
                  (column) =>
                    columnVisibility[column.id] && (
                      <td
                        key={column.id}
                        className={`border border-gray-300 px-6 py-3 ${
                          column.id === "deal_status"
                            ? lead.deal_status === 1
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                            : ""
                        }`}
                      >
                        {column.id === "deal_status"
                          ? lead.deal_status === 1
                            ? "Converted to Deal"
                            : "Not Converted to Deal"
                          : lead[column.id] || "N/A"}
                      </td>
                    )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          className={`px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <div
          className="flex gap-2"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          {[...Array(Math.ceil(totalPosts / postsPerPage))].map((_, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-blue-100 transition-all duration-300 ${
                currentPage === index + 1 ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          className={`px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 ${
            currentPage === Math.ceil(totalPosts / postsPerPage)
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(totalPosts / postsPerPage)}
        >
          Next
        </button>
      </div>

      <LeadChart leadsData={leads} />
    </div>
  );
};

// Wrap your component tree with the DndProvider
const App = () => (
  <DndProvider backend={HTML5Backend}>
    <LeadsTable />
  </DndProvider>
);

export default App;
