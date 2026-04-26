const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI

export function Google() {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    // Tells google what to return --> ID, Email and Profile.  
    const scope = encodeURIComponent('openid email profile' + ' ' + 'https://www.googleapis.com/auth/calendar' + ' ' + 'https://www.googleapis.com/auth/calendar.freebusy');

    const authUrl = 
        "https://accounts.google.com/o/oauth2/v2/auth" + 
        `?client_id=${clientId}` + 
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        "&response_type=code" +
        `&scope=${scope}` +
        "&access_type=offline" + 
        "&prompt=consent";
    window.location.href = authUrl;
}

