import { useMe } from "../hooks/use-me";

export function MeProfile() {
  const { me, loading, error, refetch, isCreated } = useMe();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading your profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Error loading profile
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

  if (!me) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Your Profile</h3>
        {isCreated && (
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            New User
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-sm font-medium text-gray-500">
            Wallet Address:
          </span>
          <span className="ml-2 text-sm text-gray-900 font-mono break-all">
            {me.address}
          </span>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-500">User ID:</span>
          <span className="ml-2 text-sm text-gray-900 font-mono">
            {me.uuid}
          </span>
        </div>

        {me.created_at && (
          <div>
            <span className="text-sm font-medium text-gray-500">
              Member Since:
            </span>
            <span className="ml-2 text-sm text-gray-900">
              {new Date(me.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        )}

        {me.updated_at && (
          <div>
            <span className="text-sm font-medium text-gray-500">
              Last Updated:
            </span>
            <span className="ml-2 text-sm text-gray-900">
              {new Date(me.updated_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={refetch}
          className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        >
          Refresh Profile
        </button>

        {isCreated && (
          <div className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded">
            Welcome to Fluvia! 🎉
          </div>
        )}
      </div>
    </div>
  );
}
