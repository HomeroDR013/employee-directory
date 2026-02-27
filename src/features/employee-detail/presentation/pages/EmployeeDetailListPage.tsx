import { useGetEmployeeDetailsQuery } from "../../data/employee-detailApi";
import { EmployeeDetailTable } from "../components/EmployeeDetailTable";

interface EmployeeDetailListPageProps {
  onSelectEmployee?: (employeeId: number) => void;
}

export function EmployeeDetailListPage({
  onSelectEmployee,
}: EmployeeDetailListPageProps) {
  const { data: employees = [], isLoading, error } =
    useGetEmployeeDetailsQuery();

  if (isLoading) {
    return (
      <p className="py-8 text-center text-gray-500">Loading employees...</p>
    );
  }

  if (error) {
    return (
      <p className="py-8 text-center text-red-600">
        Failed to load employees.
      </p>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Employee Directory
      </h2>
      <EmployeeDetailTable
        employees={employees}
        onSelect={
          onSelectEmployee
            ? (employee) => onSelectEmployee(employee.id)
            : undefined
        }
      />
    </div>
  );
}
