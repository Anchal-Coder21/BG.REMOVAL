import jwt from 'jsonwebtoken';

import { JwksClient } from 'jwks-rsa';

const client = new JwksClient({
    jwksUri: 'https://possible-blowfish-91.clerk.accounts.dev/.well-known/jwks.json',
});
const authUser = async (req, res, next) => {
    try {

        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing or malformed",
            });
        }

        const token = authHeader.split(' ')[1];

     const getKey = (header, callback) => {
            client.getSigningKey(header.kid, (err, key) => {
                const signingKey = key?.publicKey || key?.rsaPublicKey;
                callback(null, signingKey);
            });
        };

        // Verify and decode the token
       const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });

        if (!decoded || !decoded.clerkId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload",
            });
        }

        
        req.user = { clerkId: decoded.sub || decoded.clerkId }; // Clerk uses `sub` as user ID

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') { 
            return res.status(401).json({
                success: false,
                message: "Invalid Token",
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token Expired",
            });
        }
        console.error("Auth error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export default authUser;
