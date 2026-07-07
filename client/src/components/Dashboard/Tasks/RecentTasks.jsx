import React from "react";

const RecentTasks = () => {
  return (
    <div className="bg-[#151b27c0] backdrop-blur-2xl border border-gray-800 rounded-xl p-5">
      <h3 className="text-lg font-semibold text-white mb-4">
        Recent Tasks
      </h3>

      <div className="space-y-3">

        <div className="bg-neutral-900 rounded-lg p-3">
          <div className="flex justify-between">
            <span className="text-white">
              Design Student Dashboard
            </span>

            <span className="text-orange-500">
              High
            </span>
          </div>
        </div>

        <div className="bg-neutral-900 rounded-lg p-3">
          <div className="flex justify-between">
            <span className="text-white">
              Integrate Video Player
            </span>

            <span className="text-green-500">
              Low
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RecentTasks;