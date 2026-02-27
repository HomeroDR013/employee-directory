import { useState } from "react";
import { useGetEmployeesQuery } from "../../data/employeesApi";
import { EmployeesTable } from "../components/EmployeesTable";
import { EmployeeCreateForm } from "../components/EmployeeCreateForm";

interface EmployeesPageProps {
  onSelectEmployee?: (employeeId: number) => void;
}

export function EmployeesPage({ onSelectEmployee }: EmployeesPageProps) {
  const [showForm, setShowForm] = useState(false);
  const { data: employees = [], isLoading, error } = useGetEmployeesQuery();

  if (isLoading) {
    return <p className="py-8 text-center text-gray-500">Loading employees...</p>;
  }

  if (error) {
    return <p className="py-8 text-center text-red-600">Failed to load employees.</p>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Employees</h2>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-0"
        >
          {showForm ? "Cancel" : "Add Employee"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            New Employee
          </h3>
          <EmployeeCreateForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      <EmployeesTable employees={employees} onSelectEmployee={onSelectEmployee} />
    </div>
  );
}
