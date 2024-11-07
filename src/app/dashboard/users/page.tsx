export default function UsersPage() {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>

        <div className="mt-6">
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="p-6">
              <div className="relative overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4">John Doe</td>
                      <td className="p-4">john@example.com</td>
                      <td className="p-4">User</td>
                      <td className="p-4">Active</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Jane Smith</td>
                      <td className="p-4">jane@example.com</td>
                      <td className="p-4">Admin</td>
                      <td className="p-4">Active</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
