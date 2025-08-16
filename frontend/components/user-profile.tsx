import { useUser } from "../hooks/use-user";

export function UserProfile() {
  const { user, loading, error, refetch } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading user data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Error loading user
            </h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
          <button
            onClick={refetch}
            className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">No user data available</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-md">
      <h3 className="text-lg font-medium text-gray-900 mb-2">User Profile</h3>
      <div className="space-y-2">
        <div>
          <span className="text-sm font-medium text-gray-500">Address:</span>
          <span className="ml-2 text-sm text-gray-900 font-mono">
            {user.address}
          </span>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-500">User ID:</span>
          <span className="ml-2 text-sm text-gray-900 font-mono">
            {user.uuid}
          </span>
        </div>
        {user.created_at && (
          <div>
            <span className="text-sm font-medium text-gray-500">Created:</span>
            <span className="ml-2 text-sm text-gray-900">
              {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
      <button
        onClick={refetch}
        className="mt-4 px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary/90"
      >
        Refresh Data
      </button>
    </div>
  );
}
