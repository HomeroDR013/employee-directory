import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  EmployeeDetail,
  CreateEmployeeDetail,
  UpdateEmployeeDetail,
  Department,
} from "../domain/employee-detail.types";

export const employeeDetailApi = createApi({
  reducerPath: "employeeDetailApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001" }),
  tagTypes: ["EmployeeDetail", "Department"],
  endpoints: (builder) => ({
    getEmployeeDetails: builder.query<EmployeeDetail[], void>({
      query: () => "/employees",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "EmployeeDetail" as const,
                id,
              })),
              { type: "EmployeeDetail", id: "LIST" },
            ]
          : [{ type: "EmployeeDetail", id: "LIST" }],
    }),
    getEmployeeDetailById: builder.query<EmployeeDetail, number>({
      query: (id) => `/employees/${id}`,
      providesTags: (_result, _error, id) => [{ type: "EmployeeDetail", id }],
    }),
    getDepartments: builder.query<Department[], void>({
      query: () => "/departments",
      providesTags: ["Department"],
    }),
    createEmployeeDetail: builder.mutation<EmployeeDetail, CreateEmployeeDetail>(
      {
        query: (body) => ({
          url: "/employees",
          method: "POST",
          body,
        }),
        invalidatesTags: [{ type: "EmployeeDetail", id: "LIST" }],
      },
    ),
    updateEmployeeDetail: builder.mutation<EmployeeDetail, UpdateEmployeeDetail>(
      {
        query: ({ id, ...body }) => ({
          url: `/employees/${id}`,
          method: "PUT",
          body: { id, ...body },
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: "EmployeeDetail", id },
          { type: "EmployeeDetail", id: "LIST" },
        ],
      },
    ),
    deleteEmployeeDetail: builder.mutation<void, number>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "EmployeeDetail", id: "LIST" }],
    }),
  }),
});

export const {
  useGetEmployeeDetailsQuery,
  useGetEmployeeDetailByIdQuery,
  useGetDepartmentsQuery,
  useCreateEmployeeDetailMutation,
  useUpdateEmployeeDetailMutation,
  useDeleteEmployeeDetailMutation,
} = employeeDetailApi;
