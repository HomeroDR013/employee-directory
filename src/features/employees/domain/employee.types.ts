import { z } from "zod";

export const employeeStatusSchema = z.enum(["active", "inactive"]);
export type EmployeeStatus = z.infer<typeof employeeStatusSchema>;

export const employeeSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  position: z.string(),
  department: z.string(),
  phone: z.string(),
  startDate: z.string(),
  status: employeeStatusSchema,
});
export type Employee = z.infer<typeof employeeSchema>;

export const departmentSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export type Department = z.infer<typeof departmentSchema>;
