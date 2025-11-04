
export default function ScoreTotal({ score = 0, maxScore = 100 }) {
  // Calculate the percentage for the arc
  const percentage = (score / maxScore) * 100;
  
  // SVG circle parameters
  const radius = 80;
  const strokeWidth = 20;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * Math.PI; // Half circle
  
  // Calculate stroke offset based on percentage
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-lg shadow-lg">
      <div className="">
        <h3 className="text-lg font-semibold text-gray-700 bg-teal-100 px-4 py-2 rounded-t-lg">
          Score Total %
        </h3>
      </div>

      <div className="relative flex items-center justify-center h-[100px]">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-180 mb-12"
        >
          {/* Background arc (gray) */}
          <path
            d={`M ${strokeWidth / 2} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - strokeWidth / 2} ${radius}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          
          {/* Foreground arc (blue) */}
          <path
            d={`M ${strokeWidth / 2} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - strokeWidth / 2} ${radius}`}
            fill="none"
            stroke="#2563eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.5s ease'
            }}
          />
        </svg>
        
        {/* Score text in the center */}
        <div className="absolute flex flex-col items-center" style={{ bottom: '20%' }}>
          <span className="text-4xl font-bold text-gray-800">
            {score.toFixed(2)}
          </span>
        </div>
        
        {/* Min and Max labels */}
        <div className="absolute bottom-0 w-full flex justify-between px-2 text-sm text-gray-900">
          <span>0</span>
          <span>{maxScore}</span>
        </div>
      </div>
    </div>
  );
}