// Shared across posts, edits, replies, and pages on this origin.
export const MICROBLOG_COOLDOWN_MS = 30_000;
const storageKey = 'microblog:next-write-at:v1';
let nextWriteAt = 0;
let pending = false;
let storageWarningShown = false;

function useStorage(action) {
    try {
        return action(globalThis.localStorage);
    } catch (error) {
        if (!storageWarningShown) {
            console.warn('Microblog cooldown storage unavailable; using page memory.', error);
            storageWarningShown = true;
        }
    }
}

function rememberDeadline(deadline) {
    nextWriteAt = Math.max(nextWriteAt, deadline);
    useStorage(storage => storage.setItem(storageKey, String(nextWriteAt)));
}

export class MicroblogRateLimitError extends Error {
    constructor(seconds) {
        super(`Please wait ${seconds} seconds before saving another microblog post, edit, or reply.`);
        this.name = 'MicroblogRateLimitError';
    }
}

export async function withMicroblogRateLimit(write) {
    const attempt = async () => {
        const stored = Number(useStorage(storage => storage.getItem(storageKey)));
        if (Number.isFinite(stored)) nextWriteAt = Math.max(nextWriteAt, stored);
        const seconds = Math.ceil((nextWriteAt - Date.now()) / 1000);
        if (seconds > 0) throw new MicroblogRateLimitError(seconds);
        if (pending) throw new Error('A microblog save is still in progress. Please wait.');

        // Reserve before sending, including failed requests, to prevent retry storms.
        pending = true;
        rememberDeadline(Date.now() + MICROBLOG_COOLDOWN_MS);
        try {
            const response = await write();
            if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After');
                const seconds = retryAfter === null ? NaN : Number(retryAfter);
                const deadline = Number.isFinite(seconds)
                    ? Date.now() + Math.max(0, seconds) * 1000
                    : Date.parse(retryAfter);
                if (Number.isFinite(deadline)) rememberDeadline(deadline);
                throw new MicroblogRateLimitError(Math.max(1, Math.ceil((nextWriteAt - Date.now()) / 1000)));
            }
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } finally {
            pending = false;
        }
    };

    // Serialize admission across tabs where Web Locks is supported, without queuing writes.
    if (globalThis.navigator?.locks?.request) {
        return navigator.locks.request(storageKey, { ifAvailable: true }, lock => {
            if (!lock) throw new Error('A microblog save is still in progress in another tab. Please wait.');
            return attempt();
        });
    }
    return attempt();
}
