const GOOGLE_CLIENT_ID = "50181412508-ks3oa11qtnb8fefjvtlp8vu0hbegq6et.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:5173/loading"


export function Google() {
    // Tells google what to return --> ID, Email and Profile.  
    const scope = encodeURIComponent('openid email profile https://www.googleapis.com/auth/calendar');

    const authUrl = 
        "https://accounts.google.com/o/oauth2/v2/auth" + 
        `?client_id=${GOOGLE_CLIENT_ID}` + 
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        "&response_type=code" +
        `&scope=${scope}` +
        "&access_type=offline";
    window.location.href = authUrl;
}

