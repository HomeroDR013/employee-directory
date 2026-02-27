import { useGetEmployeesQuery } from "../../data/employeesApi";
import { EmployeesTable } from "../components/EmployeesTable";

export function EmployeesPage() {
  const { data: employees = [], isLoading, error } = useGetEmployeesQuery();

  if (isLoading) {
    return <p className="py-8 text-center text-gray-500">Loading employees...</p>;
  }

  if (error) {
    return <p className="py-8 text-center text-red-600">Failed to load employees.</p>;
  }

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Employees</h2>
      <EmployeesTable employees={employees} />
    </div>
  );
}
