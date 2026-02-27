import { useState } from "react";
import { EmployeesPage } from "./features/employees/presentation/pages/EmployeesPage";
import { EmployeeDetailPage } from "./features/employee-detail/presentation/pages/EmployeeDetailPage";

function App() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center gap-4 p-8">
        {selectedEmployeeId !== null && (
          <button
            onClick={() => setSelectedEmployeeId(null)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            &larr; Back to list
          </button>
        )}
        <h1 className="text-2xl font-bold">Employee Directory</h1>
      </div>
      <div className="px-8">
        {selectedEmployeeId !== null ? (
          <EmployeeDetailPage employeeId={selectedEmployeeId} />
        ) : (
          <EmployeesPage onSelectEmployee={setSelectedEmployeeId} />
        )}
      </div>
    </div>
  );
}

export default App;