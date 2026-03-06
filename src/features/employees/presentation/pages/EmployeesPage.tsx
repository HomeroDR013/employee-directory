import { useMemo, useState } from "react";
import { useGetEmployeesQuery, useGetDepartmentsQuery } from "../../data/employeesApi";
import { EmployeesTable } from "../components/EmployeesTable";
import { EmployeeCreateForm } from "../components/EmployeeCreateForm";

interface EmployeesPageProps {
  onSelectEmployee?: (employeeId: number) => void;
}

export function EmployeesPage({ onSelectEmployee }: EmployeesPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const { data: employees = [], isLoading, error } = useGetEmployeesQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();

  const filteredEmployees = useMemo(
    () =>
      selectedDepartment === "All"
        ? employees
        : employees.filter((e) => e.department === selectedDepartment),
    [employees, selectedDepartment],
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg
          className="mb-3 size-8 animate-spin text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-sm text-gray-500">Loading employees...</p>
      </div>
    );
  }

  if (error) {
    return <p className="py-8 text-center text-red-600">Failed to load employees.</p>;
  }

  return (
    <div>
      <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-4 shadow-md md:mb-8 md:px-8 md:py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white md:text-2xl">Employees</h2>
            <p className="mt-1 text-sm text-blue-100">
              Manage your team — {filteredEmployees.length} member{filteredEmployees.length !== 1 && "s"} and counting.
            </p>
          </div>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 sm:w-auto"
          >
            {showForm ? "Cancel" : "+ Add Employee"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            New Employee
          </h3>
          <EmployeeCreateForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      <div className="mb-4 flex items-center gap-3">
        <label htmlFor="department-filter" className="text-sm font-medium text-gray-700">
          Department
        </label>
        <select
          id="department-filter"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="All">All</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <EmployeesTable employees={filteredEmployees} onSelectEmployee={onSelectEmployee} />
    </div>
  );
}
