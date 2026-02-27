import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useAddEmployeeMutation,
  useGetDepartmentsQuery,
} from "../../data/employeesApi";

const employeeCreateSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  startDate: z.string().min(1, "Start date is required"),
  status: z.enum(["active", "inactive"]),
});

type EmployeeCreateFormValues = z.infer<typeof employeeCreateSchema>;

interface EmployeeCreateFormProps {
  onSuccess?: () => void;
}

const inputBase =
  "block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0";
const inputNormal =
  `${inputBase} border-gray-300 focus:border-blue-500 focus:ring-blue-500/30`;
const inputError =
  `${inputBase} border-red-400 focus:border-red-500 focus:ring-red-500/30`;

export function EmployeeCreateForm({ onSuccess }: EmployeeCreateFormProps) {
  const { data: departments = [] } = useGetDepartmentsQuery();
  const [addEmployee, { isLoading: isSubmitting }] = useAddEmployeeMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EmployeeCreateFormValues>({
    resolver: zodResolver(employeeCreateSchema),
    defaultValues: {
      status: "active",
    },
  });

  const onSubmit = async (data: EmployeeCreateFormValues) => {
    try {
      await addEmployee(data).unwrap();
      reset();
      onSuccess?.();
    } catch {
      // mutation error is available via the hook's error state if needed
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <fieldset>
        <legend className="text-sm font-semibold text-gray-900">
          Personal Information
        </legend>
        <p className="mt-1 text-xs text-gray-500">
          Employee name and contact details.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="e.g. Ana"
              {...register("firstName")}
              className={errors.firstName ? inputError : inputNormal}
            />
            {errors.firstName && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="e.g. García"
              {...register("lastName")}
              className={errors.lastName ? inputError : inputNormal}
            />
            {errors.lastName && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="e.g. ana.garcia@company.com"
              {...register("email")}
              className={errors.email ? inputError : inputNormal}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      <hr className="border-gray-200" />

      <fieldset>
        <legend className="text-sm font-semibold text-gray-900">
          Work Information
        </legend>
        <p className="mt-1 text-xs text-gray-500">
          Role, department, and employment status.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="position"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Position
            </label>
            <input
              id="position"
              type="text"
              placeholder="e.g. Senior Engineer"
              {...register("position")}
              className={errors.position ? inputError : inputNormal}
            />
            {errors.position && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.position.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="department"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Department
            </label>
            <select
              id="department"
              {...register("department")}
              className={errors.department ? inputError : inputNormal}
            >
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.department.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="startDate"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              {...register("startDate")}
              className={errors.startDate ? inputError : inputNormal}
            />
            {errors.startDate && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              {...register("status")}
              className={errors.status ? inputError : inputNormal}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      <hr className="border-gray-200" />

      <div className="flex items-center justify-end gap-3">
        <button
          type="reset"
          disabled={!isDirty || isSubmitting}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-0 disabled:opacity-40"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-0 disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Employee"}
        </button>
      </div>
    </form>
  );
}
