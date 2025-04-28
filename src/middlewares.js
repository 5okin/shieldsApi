const rateLimit = require("express-rate-limit");
const cors = require("cors");


// Rate Limit
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // Max 10 requests per IP
    message: { error: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip
});

function shieldAgentWhitelist(req, res, next){
    const userAgent = req.headers['user-agent'] || '';
    const requestIP = req.ip || req.remoteAddress;

    if (userAgent.toLowerCase().includes('shields.io')) {
        console.log(`✅ Shields.io detected: ${userAgent} ${requestIP}`);
        next(); // Allow the request
    } else {
        console.log(`🚫 Non-Shields.io request blocked: ${userAgent} ${requestIP}`);
        return res.status(403).json({ error: "Forbidden: Invalid IP" });
    }
}

// IP white list
const allowedIPRange = /^66\.225\.222\.\d+$/;

function ipWhitelist(req, res, next) {
    const requestIP = req.ip || req.remoteAddress;
    console.log(requestIP)
    if (!allowedIPRange.test(requestIP)){
        return res.status(403).json({ error: "Forbidden: Invalid IP" });
    }
    next();
}

function blockBots(req, res, next) {
    const userAgent = req.headers["user-agent"];
    if (!userAgent || userAgent.includes("bot")) {
        return res.status(403).json({ error: "Bots are not allowed" });
    }
    next();
}

function limitPayload(req, res, next) {
    if (req.method !== "GET" && Object.keys(req.body).length > 0) {
        return res.status(400).json({ error: "Request body is not allowed." });
    }
    next();
}

function limitQuery() {
    if ((req.originalUrl.split("?")[1] || "").length > 1) {
        return res.status(400).json({ error: "No query allowed" });
    }
    if (req.url.length > 30) {
        return res.status(414).json({ error: "Request-URI too long." });
    }
    next();
}

const corsOptions = {
    origin: "https://shields.io",
    methods: ["GET"],
    allowedHeaders: ["Content-Type"]
};

module.exports = { limiter, shieldAgentWhitelist, ipWhitelist, blockBots, limitPayload, limitQuery, corsOptions };
