import { EmployeesPage } from "./features/employees/presentation/pages/EmployeesPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold p-8">Employee Directory</h1>
      <div className="px-8">
        <EmployeesPage />
      </div>
    </div>
  );
}

export default App;