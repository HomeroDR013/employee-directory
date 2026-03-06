import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import type { Employee } from "../../domain/employee.types";

const columnHelper = createColumnHelper<Employee>();

interface EmployeesTableProps {
  employees: Employee[];
  onSelectEmployee?: (employeeId: number) => void;
}

export function EmployeesTable({ employees, onSelectEmployee }: EmployeesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
        id: "name",
        header: "Name",
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor("position", { header: "Position" }),
      columnHelper.accessor("department", { header: "Department" }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const isActive = info.getValue() === "active";
          return (
            <span
              aria-label={`Status: ${isActive ? "Active" : "Inactive"}`}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isActive
                  ? "bg-green-50 text-green-800 ring-1 ring-green-600/20 ring-inset"
                  : "bg-gray-100 text-gray-600 ring-1 ring-gray-500/20 ring-inset"
              }`}
            >
              {isActive ? (
                <svg className="size-3" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                  <path d="M10.28 2.28a.75.75 0 00-1.06-1.06L4.5 5.94 2.78 4.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.25-5.25z" />
                </svg>
              ) : (
                <svg className="size-3" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                  <path d="M3.22 3.22a.75.75 0 011.06 0L6 4.94l1.72-1.72a.75.75 0 111.06 1.06L7.06 6l1.72 1.72a.75.75 0 11-1.06 1.06L6 7.06 4.28 8.78a.75.75 0 01-1.06-1.06L4.94 6 3.22 4.28a.75.75 0 010-1.06z" />
                </svg>
              )}
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: employees,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (employees.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white py-12 text-center">
        <p className="text-sm text-gray-500">No employees found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200" aria-label="Employee directory">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="cursor-pointer select-none px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span className="inline-flex items-center gap-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      <span className="text-gray-400" aria-hidden="true">
                        {{ asc: "▲", desc: "▼" }[header.column.getIsSorted() as string] ?? "⇅"}
                      </span>
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                tabIndex={onSelectEmployee ? 0 : undefined}
                className={`transition-colors duration-150 hover:bg-blue-50 ${onSelectEmployee ? "cursor-pointer focus:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" : ""}`}
                onClick={() => onSelectEmployee?.(row.original.id)}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && onSelectEmployee) {
                    e.preventDefault();
                    onSelectEmployee(row.original.id);
                  }
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="whitespace-nowrap px-6 py-4 text-sm text-neutral-900">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-gray-500">
        Showing {employees.length} employee{employees.length !== 1 && "s"}
      </p>
    </div>
  );
}
