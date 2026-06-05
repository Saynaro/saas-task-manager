import toast from 'react-hot-toast';

/**
 * Checks if a response is 429 Too Many Requests and shows a toast.
 * @param {Response} res - fetch Response object
 * @param {object} data  - already-parsed JSON body
 * @returns {boolean}    - true if it was a rate limit error (caller should return early)
 */
export function handleRateLimit(res, data) {
    if (res.status !== 429) return false;

    const seconds = data?.retryAfter ?? 0;
    const minutes = Math.ceil(seconds / 60);

    if (minutes >= 1) {
        toast.error(`Too many attempts, try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`);
    } else if (seconds > 0) {
        toast.error(`Too many attempts, try again in ${seconds} second${seconds > 1 ? 's' : ''}.`);
    } else {
        toast.error('Too many attempts, please try again later.');
    }

    return true;
}
