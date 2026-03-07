import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { EmployeesPage } from "./EmployeesPage";
import { apiSlice } from "../../../../shared/data/apiSlice";

import type { Employee, Department } from "../../domain/employee.types";

const mockEmployees: Employee[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@test.com",
    position: "Developer",
    department: "Engineering",
    phone: "555-0001",
    startDate: "2024-01-01",
    status: "active",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@test.com",
    position: "Designer",
    department: "Design",
    phone: "555-0002",
    startDate: "2024-02-01",
    status: "active",
  },
  {
    id: 3,
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob@test.com",
    position: "Manager",
    department: "Engineering",
    phone: "555-0003",
    startDate: "2024-03-01",
    status: "inactive",
  },
];

const mockDepartments: Department[] = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Design" },
];

vi.mock("../../data/employeesApi", () => ({
  useGetEmployeesQuery: vi.fn(() => ({
    data: mockEmployees,
    isLoading: false,
    error: undefined,
  })),
  useGetDepartmentsQuery: vi.fn(() => ({
    data: mockDepartments,
    isLoading: false,
    error: undefined,
  })),
  useAddEmployeeMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
}));

function renderPage() {
  const store = configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefault) => getDefault().concat(apiSlice.middleware),
  });

  return render(
    <Provider store={store}>
      <EmployeesPage />
    </Provider>,
  );
}

describe("EmployeesPage — search filter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the search input with correct placeholder", () => {
    renderPage();
    expect(
      screen.getByPlaceholderText("Search by name..."),
    ).toBeInTheDocument();
  });

  it("shows all employees when search input is empty", () => {
    renderPage();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
  });

  it("filters by first name (case-insensitive)", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText("Search by name..."), "jane");

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob Johnson")).not.toBeInTheDocument();
  });

  it("filters by last name (case-insensitive)", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(
      screen.getByPlaceholderText("Search by name..."),
      "JOHNSON",
    );

    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  it("composes search with department filter", async () => {
    const user = userEvent.setup();
    renderPage();

    // Filter by Engineering department
    await user.selectOptions(screen.getByLabelText("Department"), "Engineering");

    // Both John and Bob are in Engineering
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();

    // Now also search for "john"
    await user.type(screen.getByPlaceholderText("Search by name..."), "john");

    // Both match "john" — John (firstName) and Johnson (lastName)
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
  });

  it("shows all employees again when search is cleared", async () => {
    const user = userEvent.setup();
    renderPage();

    const searchInput = screen.getByPlaceholderText("Search by name...");
    await user.type(searchInput, "jane");

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();

    await user.clear(searchInput);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
  });
});
