import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setGameStage } from '../../features/gameSlice';

export const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const [employeeId, setEmployeeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate connection delay
    setTimeout(() => {
      dispatch(setGameStage('Investigation'));
    }, 1500);
  };

  return (
    <div className="h-screen w-screen bg-black text-green-500 font-mono flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full border border-green-700 p-8 rounded bg-gray-900 shadow-[0_0_20px_rgba(0,255,0,0.2)]">
        <h1 className="text-2xl mb-2 text-center tracking-widest uppercase border-b border-green-800 pb-4">
          Aethelgard BIOS v4.0
        </h1>
        
        <div className="mb-8 text-sm opacity-80 space-y-1">
          <p>System Check... OK</p>
          <p>Memory Test... 640K OK</p>
          <p>Loading Drivers... DONE</p>
          <p>Connecting to Corporate Intranet...</p>
        </div>

        <form onSubmit={handleConnect} className="space-y-6">
          <div>
            <label htmlFor="employeeId" className="block text-sm mb-2 uppercase tracking-wide">
              Employee ID
            </label>
            <input
              type="text"
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full bg-black border border-green-700 text-green-500 p-2 focus:outline-none focus:border-green-400 focus:shadow-[0_0_10px_rgba(0,255,0,0.3)] transition-all"
              placeholder="ENTER ID..."
              autoFocus
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !employeeId}
            className={`w-full py-3 px-4 uppercase tracking-widest font-bold border transition-all duration-300
              ${isLoading 
                ? 'bg-green-900 border-green-900 text-green-700 cursor-wait' 
                : 'bg-green-800 hover:bg-green-700 border-green-600 text-black hover:shadow-[0_0_15px_rgba(0,255,0,0.4)]'
              }
            `}
          >
            {isLoading ? 'CONNECTING...' : 'CONNECT'}
          </button>
        </form>
        
        <div className="mt-8 text-xs text-center text-green-800">
          Unauthorized access is strictly prohibited.
          <br />
          Property of Aethelgard Corp.
        </div>
      </div>
    </div>
  );
};