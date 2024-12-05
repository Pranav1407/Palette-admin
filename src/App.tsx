import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import Dashboard from "./components/dashboard/Dashboard"

const App = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex h-full">
        <Sidebar />
        <main className="py-4 pr-4 h-full w-full">
          <Dashboard />
        </main>
      </div>
    </div>
  )
}

export default App;