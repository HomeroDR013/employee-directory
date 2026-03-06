import { useState } from "react";
import { EmployeesPage } from "./features/employees/presentation/pages/EmployeesPage";
import { EmployeeDetailPage } from "./features/employee-detail/presentation/pages/EmployeeDetailPage";

function App() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:z-50 focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>
      <div className="flex items-center gap-4 px-4 pt-4 pb-2 md:px-8 md:pt-6 md:pb-4">
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
      <div id="main-content" className="px-4 md:px-8">
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