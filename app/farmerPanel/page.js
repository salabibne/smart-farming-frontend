export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Total Users</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">1,234</p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Active Farms</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">56</p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Alerts</h3>
          <p className="text-3xl font-bold text-red-500 mt-2">3</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <p className="text-gray-600">No recent activity to show.</p>
      </div>
    </div>
  );
}
