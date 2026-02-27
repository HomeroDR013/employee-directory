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
      <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Employees</h2>
            <p className="mt-1 text-sm text-blue-100">
              Manage your team — {employees.length} member{employees.length !== 1 && "s"} and counting.
            </p>
          </div>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="rounded-lg border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-0"
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

      <EmployeesTable employees={employees} onSelectEmployee={onSelectEmployee} />
    </div>
  );
}
