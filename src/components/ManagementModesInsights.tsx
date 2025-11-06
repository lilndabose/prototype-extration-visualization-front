import React from 'react';

interface ManagementModesInsightsProps {
  data?: {
    CODO?: number;
    COCO?: number;
    DODO?: number;
  };
}

const ManagementModesInsights: React.FC<ManagementModesInsightsProps> = ({ data }) => {
  // Default data if not provided
  const defaultData = {
    CODO: 62,
    COCO: 28,
    DODO: 10
  };

  const modesData = data || defaultData;

  // Calculate relative sizes based on percentages
  const percentages = [modesData.CODO || 0, modesData.COCO || 0, modesData.DODO || 0];
  const maxPercentage = Math.max(...percentages);
  const minPercentage = Math.min(...percentages.filter(p => p > 0));

  // Scale radii between 140 and 200 based on percentage
  const calculateRadius = (percentage: number) => {
    if (maxPercentage === minPercentage) return 170; // All equal
    const normalized = (percentage - minPercentage) / (maxPercentage - minPercentage);
    return 140 + (normalized * 60); // Range: 140-200
  };

  const modes = [
    {
      label: 'CODO',
      percentage: modesData.CODO || 0,
      color: '#4A90E2',
      radius: calculateRadius(modesData.CODO || 0)
    },
    {
      label: 'COCO',
      percentage: modesData.COCO || 0,
      color: '#2962FF',
      radius: calculateRadius(modesData.COCO || 0)
    },
    {
      label: 'DODO',
      percentage: modesData.DODO || 0,
      color: '#9B59B6',
      radius: calculateRadius(modesData.DODO || 0)
    }
  ];

  return (
    <div className="w-full h-full rounded-md bg-white p-3 flex flex-col">
      {/* Title */}
      <div className="flex-shrink-0 mb-2">
        <h2 className="text-sm font-semibold text-gray-800">Management Modes</h2>
      </div>

      {/* Bubble Chart */}
      <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" className="max-w-full max-h-full">
            <defs>
              <filter id="shadow1" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                <feOffset dx="1" dy="1" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="shadow2" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
                <feOffset dx="1" dy="1" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="shadow3" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
                <feOffset dx="1" dy="1" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Circle - CODO (left side) */}
            <circle
              cx="240"
              cy="210"
              r={modes[0]?.radius}
              fill={modes[0]?.color}
              opacity="0.85"
              filter="url(#shadow1)"
            />
            <text
              x="240"
              y="220"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize={Math.max(40, modes[0]?.radius * 0.55)}
              fontWeight="700"
            >
              {modes[0]?.percentage}%
            </text>

            {/* Circle - COCO (right side, overlapping) */}
            <circle
              cx="540"
              cy="210"
              r={modes[1]?.radius}
              fill={modes[1]?.color}
              opacity="0.85"
              filter="url(#shadow2)"
            />
            <text
              x="540"
              y="220"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize={Math.max(40, modes[1]?.radius * 0.55)}
              fontWeight="700"
            >
              {modes[1]?.percentage}%
            </text>

            {/* Circle - DODO (bottom center, overlapping both) */}
            <circle
              cx="390"
              cy="340"
              r={modes[2].radius}
              fill={modes[2].color}
              opacity="0.85"
              filter="url(#shadow3)"
            />
            <text
              x="390"
              y="350"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize={Math.max(40, modes[2].radius * 0.55)}
              fontWeight="700"
            >
              {modes[2].percentage}%
            </text>
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-shrink-0 flex justify-center items-center gap-3 mt-2">
        {modes.map((mode, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: mode.color }}
            />
            <span className="text-xs text-gray-600 whitespace-nowrap">
              {mode.label} {mode.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagementModesInsights;