export default function DashboardPage() {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Stats Cards */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Users
            </h3>
            <p className="mt-2 text-3xl font-bold">1,234</p>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">
              Active Projects
            </h3>
            <p className="mt-2 text-3xl font-bold">12</p>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">
              Revenue
            </h3>
            <p className="mt-2 text-3xl font-bold">100,000 PHP</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <div className="mt-4 rounded-lg border bg-card shadow-sm">
            <div className="p-6">
              <p className="text-sm text-muted-foreground">
                No recent activity
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
