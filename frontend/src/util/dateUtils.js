export function calculateExpirationTime(expirationTimeInSeconds) {
    const now = new Date();
    const expirationTimeUTC = new Date(now.getTime() + expirationTimeInSeconds * 1000);
    return new Date(expirationTimeUTC.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
}