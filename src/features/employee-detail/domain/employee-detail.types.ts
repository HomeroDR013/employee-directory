export type EmployeeStatus = "active" | "inactive";

export interface EmployeeDetail {
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

export type CreateEmployeeDetail = Omit<EmployeeDetail, "id">;
export type UpdateEmployeeDetail = EmployeeDetail;
