export type EmployeeStatus = "active" | "inactive";

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  startDate: string;
  status: EmployeeStatus;
}

export interface Department {
  id: number;
  name: string;
}
