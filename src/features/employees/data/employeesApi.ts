import { z } from "zod";
import { apiSlice } from "../../../shared/data/apiSlice";
import type { Employee, Department } from "../domain/employee.types";
import {
  employeeSchema,
  departmentSchema,
} from "../domain/employee.types";

const employeesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], void>({
      query: () => "/employees",
      responseSchema: z.array(employeeSchema),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Employee" as const, id })),
              { type: "Employee", id: "LIST" },
            ]
          : [{ type: "Employee", id: "LIST" }],
    }),
    getDepartments: builder.query<Department[], void>({
      query: () => "/departments",
      responseSchema: z.array(departmentSchema),
      providesTags: ["Department"],
    }),
    addEmployee: builder.mutation<Employee, Omit<Employee, "id">>({
      query: (body) => ({
        url: "/employees",
        method: "POST",
        body,
      }),
      responseSchema: employeeSchema,
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetDepartmentsQuery,
  useAddEmployeeMutation,
} = employeesApi;
