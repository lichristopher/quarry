export default function SettingsPage() {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

        <div className="mt-6">
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-medium">General Settings</h2>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Site Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border p-2"
                    placeholder="My Application"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Email Notifications
                  </label>
                  <select className="mt-1 block w-full rounded-md border p-2">
                    <option>All notifications</option>
                    <option>Important only</option>
                    <option>None</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border" />
                    <span className="text-sm text-muted-foreground">
                      Enable dark mode
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
