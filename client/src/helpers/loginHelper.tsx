const GOOGLE_CLIENT_ID = "50181412508-ks3oa11qtnb8fefjvtlp8vu0hbegq6et.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:5173/home"

export function Google() {
    // Tells google what to return --> ID, Email and Profile.  
    const scope = encodeURIComponent('openid email profile');

    const authUrl = 
        "http://accounts.google.com/o/oauth2/v2/auth" + 
        `?client_id=${GOOGLE_CLIENT_ID}` + 
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        "&response_type=code" +
        `&scope=${scope}`;
    
    window.location.href = authUrl
}

