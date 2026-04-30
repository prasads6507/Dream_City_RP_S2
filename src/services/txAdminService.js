import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';

/**
 * Fetch live players from txAdmin via Backend Proxy
 */
export const fetchLivePlayers = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/server/players`);
    return res.data.players || [];
  } catch (error) {
    console.error('Fetch players error:', error);
    throw error;
  }
};

/**
 * Fetch comprehensive server status (players, uptime, metadata)
 */
export const fetchServerStatus = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/server/status`);
    return res.data;
  } catch (error) {
    console.error('Fetch status error:', error);
    // Return fallback structure so UI doesn't crash
    return {
      success: false,
      online: false,
      players: 0,
      maxPlayers: 48,
      uptime: 'Offline'
    };
  }
};


/**
 * Perform a player action (heal, kick, etc.)
 * @param {string} action - 'heal', 'kick', or 'command'
 * @param {string|number} target - Player ID
 * @param {object} options - { reason, command, staffName, targetName }
 */
export const performPlayerAction = async (action, target, options = {}) => {
  try {
    const res = await axios.post(`${API_URL}/api/server/action`, {
      action,
      target,
      ...options
    });
    return res.data;
  } catch (error) {
    console.error(`Action ${action} error:`, error);
    throw error;
  }
};

/**
 * Send a global announcement to the server
 * @param {string} message 
 * @param {string} staffName
 */
export const sendAnnouncement = async (message, staffName) => {
  return performPlayerAction('command', null, { command: `announce ${message}`, staffName });
};
