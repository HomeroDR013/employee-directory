import {
  useGetEmployeeDetailByIdQuery,
  useGetDepartmentsQuery,
  useUpdateEmployeeDetailMutation,
} from "../../data/employee-detailApi";
import { EmployeeDetailForm } from "../components/EmployeeDetailForm";

interface EmployeeDetailPageProps {
  employeeId: number;
}

export function EmployeeDetailPage({ employeeId }: EmployeeDetailPageProps) {
  const {
    data: employee,
    isLoading: isLoadingEmployee,
    error: employeeError,
  } = useGetEmployeeDetailByIdQuery(employeeId);
  const { data: departments = [], isLoading: isLoadingDepartments } =
    useGetDepartmentsQuery();
  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeDetailMutation();

  if (isLoadingEmployee || isLoadingDepartments) {
    return (
      <p className="py-8 text-center text-gray-500">
        Loading employee details...
      </p>
    );
  }

  if (employeeError || !employee) {
    return (
      <p className="py-8 text-center text-red-600">
        Failed to load employee details.
      </p>
    );
  }

  const isActive = employee.status === "active";

  const handleSubmit = async (data: Omit<typeof employee, "id">) => {
    await updateEmployee({ id: employee.id, ...data });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {employee.firstName} {employee.lastName}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {employee.position} &middot; {employee.department}
          </p>
        </div>
        <span
          className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            isActive
              ? "bg-green-50 text-green-700 ring-1 ring-green-600/20 ring-inset"
              : "bg-red-50 text-red-700 ring-1 ring-red-600/20 ring-inset"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${isActive ? "bg-green-600" : "bg-red-600"}`}
          />
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-base font-semibold text-gray-900">
            Employee Information
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Update personal data and department assignment.
          </p>
        </div>
        <div className="px-6 py-6">
          <EmployeeDetailForm
            employee={employee}
            departments={departments}
            onSubmit={handleSubmit}
            isSubmitting={isUpdating}
          />
        </div>
      </div>
    </div>
  );
}
