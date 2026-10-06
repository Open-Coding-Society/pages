// ============================================
// srfscConfig.js
// RESPONSIBILITY: Where the SRFSC backend (srfsc_backend/ in this repo) lives.
// ============================================

// Set this to the HTTPS URL where srfsc_backend is deployed (see srfsc_backend/README.md).
// While empty, deployed pages skip the backend and run in offline mode.
export const SRFSC_PRODUCTION_API = '';

const LOCAL_API = 'http://localhost:8599';
const isLocalSite = ['localhost', '127.0.0.1'].includes(location.hostname);

/** Base URL for /api/srfsc, or '' when no backend is configured for this site. */
export const SRFSC_API_ORIGIN = isLocalSite ? LOCAL_API : SRFSC_PRODUCTION_API;
