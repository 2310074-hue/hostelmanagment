import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../../components/Layout";
import ComplaintTable from "../../components/ComplaintTable";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import SearchBar from "../../components/SearchBar";
import FilterDropdown from "../../components/FilterDropdown";
import { getComplaints } from "../../services/complaintService";
import { COMPLAINT_STATUSES, PRIORITY_LEVELS, COMPLAINT_CATEGORIES } from "../../utils/constants";

const ManageComplaints = () => {
  const [searchParams] = useSearchParams();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getComplaints({});
        setComplaints(data);
      } catch (err) {
        setError("Unable to load complaints. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    // Keep filter in sync if navigated here via sidebar links with a query param
    const status = searchParams.get("status");
    if (status) setStatusFilter(status);
  }, [searchParams]);

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch =
        !search ||
        String(c.id).includes(search) ||
        c.studentName?.toLowerCase().includes(search.toLowerCase()) ||
        c.category?.toLowerCase().includes(search.toLowerCase()) ||
        c.roomNumber?.toLowerCase().includes(search.toLowerCase()) ||
        c.title?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;
      const matchesPriority = priorityFilter === "All" || c.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });
  }, [complaints, search, statusFilter, categoryFilter, priorityFilter]);

  return (
    <Layout role="admin" title="All Complaints">
      <div className="hcms-card p-3 mb-3">
        <div className="row g-2">
          <div className="col-md-4">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by ID, student, category, room..." />
          </div>
          <div className="col-md-3">
            <FilterDropdown label="" value={statusFilter} onChange={setStatusFilter} options={["All", ...COMPLAINT_STATUSES]} />
          </div>
          <div className="col-md-3">
            <FilterDropdown label="" value={categoryFilter} onChange={setCategoryFilter} options={["All", ...COMPLAINT_CATEGORIES]} />
          </div>
          <div className="col-md-2">
            <FilterDropdown label="" value={priorityFilter} onChange={setPriorityFilter} options={["All", ...PRIORITY_LEVELS]} />
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner text="Loading complaints..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div className="hcms-card p-3">
          <p className="text-muted small mb-3">{filtered.length} complaint(s) found</p>
          <ComplaintTable complaints={filtered} basePath="/admin/complaints" showStudent />
        </div>
      )}
    </Layout>
  );
};

export default ManageComplaints;
