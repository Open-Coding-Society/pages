import React, { useState } from 'react';
import { Users, Loader, CheckCircle, AlertCircle } from 'lucide-react';

export default function ConnectButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, success, error
  const [message, setMessage] = useState('');
  const [playerCount, setPlayerCount] = useState(0);

  const handleConnect = async () => {
    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      // Fetch all users from your backend
      const response = await fetch('/api/person/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const users = await response.json();

      // Store users in Multiplayer (you would import Multiplayer and initialize it)
      // This is a placeholder - adjust based on your actual implementation
      const multiplayerData = {
        players: users.map((user, index) => ({
          id: user.uid || user.email,
          name: user.name,
          email: user.email,
          uid: user.uid,
          sid: user.sid,
          pfp: user.pfp,
        })),
        totalPlayers: users.length,
      };

      console.log('Connected Players:', multiplayerData);
      setPlayerCount(users.length);
      setStatus('success');
      setMessage(`Successfully connected ${users.length} players!`);

    } catch (error) {
      console.error('Connection error:', error);
      setStatus('error');
      setMessage(`Failed to connect: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-8 max-w-md w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Multiplayer Connect</h1>
          <p className="text-slate-400 text-sm mt-2">Fetch players from your backend</p>
        </div>

        {/* Connect Button */}
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
            isLoading
              ? 'bg-slate-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }`}
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Users className="w-5 h-5" />
              Connect to Backend
            </>
          )}
        </button>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="mt-6 p-4 bg-green-900/30 border border-green-700 rounded-lg flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-400 font-semibold text-sm">{message}</p>
              <p className="text-green-300 text-xs mt-1">
                {playerCount} player{playerCount !== 1 ? 's' : ''} loaded
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 p-4 bg-red-900/30 border border-red-700 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-semibold text-sm">Connection Failed</p>
              <p className="text-red-300 text-xs mt-1">{message}</p>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
          <p className="text-slate-300 text-xs leading-relaxed">
            <span className="font-semibold">Backend Endpoint:</span> <code className="text-blue-300">/api/person/all</code>
          </p>
          <p className="text-slate-300 text-xs mt-2 leading-relaxed">
            <span className="font-semibold">Expected Response:</span> Array of user objects with uid, name, email, etc.
          </p>
        </div>
      </div>
    </div>
  );
}