import {
     getGoogleToken,
     getGoogleData,
     getUser,
     createUser,
     storeRefreshGoogle,
     createRefreshTokenLogic,
     storeRefreshToken, 
     createAccessTokenBusiness,     
     rotateRefreshToken,
     logoutBusiness,
     getCalenderBusiness,
     getTimezoneBusiness,
     createEventBusiness,
    } from "../business/authBusiness.js";
import dotenv from 'dotenv';
dotenv.config();

import { redis } from "../redis.js";

export async function getGoogleDetails(req, res) {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({error: "Missing code"});
        }

        const { access_token, expires_in, refresh_token } = await getGoogleToken(code);
        const { id, email, name } = await getGoogleData(access_token);
       
        let user = await getUser(id);
        let time_zone  = await getTimezoneBusiness(access_token);        
        let expiry_time = Date.now() + expires_in * 1000;
        redis.set(`google:access:${user.id}`, {access_token, expiry_time, time_zone});

        if (!user) {
            const user = await createUser(id, email, name);
        }      
        
        if (refresh_token) {
            await storeRefreshGoogle(user.id, refresh_token);
        }
        
        res.status(200).json({data: user.id, success: true});
    } catch (err) { 
        console.log(err.message);
        res.status(400).json({success: false, message: err});
    }
};

export async function createRefreshToken(req, res) {
    try {
        const { user_id } = req.body;

        const refresh_token = await createRefreshTokenLogic();
        // Create cookie for refresh_token and store it.
        await storeRefreshToken(refresh_token.code, user_id, refresh_token.expiresAt);
        console.log(`CODE IS ${refresh_token.code}`)
        // Now create a cookie.
        res.cookie("refresh_token", refresh_token.code, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/api/auth/refresh",
            maxAge: 30 * 24 * 60 * 60 * 1000 
        }); 

        console.log(`COOKIE MADE ${refresh_token.code}`)
        res.status(201).json({success: true});
    } catch (err) {
        console.log(err.message);
        res.status(400).json({success: false, message: err});
    }
}

export async function createAccessToken(req, res) {
    try {
        const { user_id } = req.body;
        const access_token = await createAccessTokenBusiness(user_id);

        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path:  "/",
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
        
        res.status(200).json({success: true});
    } catch (err) {
        console.log(err.message);
        res.status(400).json({success: false, message: err});
    }
}

export async function refresh(req, res) {
    try {
        let user_id = req.userId;        
        const refresh_token = await createRefreshTokenLogic();
        await rotateRefreshToken(refresh_token.code, user_id, refresh_token.expiresAt);
         
        res.cookie("refresh_token", refresh_token.code, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/api/auth/refresh", 
            maxAge: 30 * 24 * 60 * 60 * 1000 
        });

        const access_token = await createAccessTokenBusiness(user_id);

        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path:  "/",
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
        
        res.status(200).json({success: true});
    } catch (err) {
        console.log(err.message);
        res.status(400).json({success: false, message: err});
    }
}

export async function checkUser(req, res) {
    try {        
        return res.status(200).json({success: true});
    } catch (err) {
        return res.status(400).json({success: false});
    }
}

export async function logout(req, res) {
    try {
        let refresh_token = req.cookies.refresh_token
        console.log(`LOGGING OUT... refresh_token is currently: ${refresh_token}`);

        await logoutBusiness(refresh_token);

        console.log(`This refresh token has been removed`);

        res.clearCookie("access_token", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        });

        console.log(`This access cookie has been removed!`);


        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        })

        console.log(`This refresh cookie has been removed!`);


        return res.status(200).json({success: true});
    } catch (err) {
        return res.status(400).json({success: false});
    }
}

export async function getCalender(req, res) {
    try {
        let access_token = req.access_token;
        let time_zone = req.time_zone;
        let calendar = await getCalenderBusiness(access_token, time_zone);
        return res.status(200).json({success: true, data: calendar.items})
    } catch (err) {
        return res.status(400).json({success: false})
    }
}

export async function createEvent(req, res) {
    try {
        let access_token = req.access_token;
        let time_zone = req.time_zone;
        let { value: eventText } = req.body;
        createEventBusiness(access_token, eventText, time_zone);
        return res.status(200).json({success: true});

    } catch (err) {
        return res.status(400).json({success: false});
    }
}