import React from 'react';

const AdminSettings = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">System Settings</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Church Information</h3>
            <p className="text-gray-600 mt-1">Basic church details and contact information</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Theme Settings</h3>
            <p className="text-gray-600 mt-1">Customize colors and appearance</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Backup & Restore</h3>
            <p className="text-gray-600 mt-1">Manage system backups</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;