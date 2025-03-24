const express = require("express");
const { param, validationResult } = require("express-validator");
const { client, DB_NAME, DB_COLLECTION } = require("./config");

const router = express.Router();
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300 }); // 300 seconds = 5 minutes

// MARK: getStats
async function getStats(platform) {
    try {
        const db = client.db(DB_NAME);
        if (platform === "discordservers") {
            return await db.collection("discord").countDocuments();
        } else if (platform === "discordusers") {
            const result = await db.collection("discord").aggregate([
                {
                  $group: {
                    _id: null,
                    totalPopulation: { $sum: "$population" }
                  }
                }
              ]).toArray();
              const totalPopulation = result.length > 0 ? result[0].totalPopulation : 0;

            return totalPopulation;
        } else {
            const stats = await db.collection(DB_COLLECTION).findOne(
                { social: platform },
                { projection: { _id: 0, followers: 1 } }
            );
            return stats;
        }
    } catch (error) {
        console.error(error);
        return { error: "Database error" };
    }
}

// MARK: Endpoint
router.get("/api/stats/:platform",
    param("platform").isIn(["discordservers", "discordusers", "bluesky", "twitter"]).withMessage("Invalid platform"),
    async (req, res) => {
        const platform = req.params.platform;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: "Invalid platform" });
        }

        const cachedData = cache.get(platform);
        if (cachedData) 
            return res.json(cachedData);

        let response = {
            schemaVersion: 1,
            label: platform,
            message: "N/A",
            color: "gray"
        };

        const stats = await getStats(platform);
        if (stats.error) {
            return res.status(500).json({ error: "Database error" });
        }

        switch (platform) {
            case "discordservers":
                response.label = "Discord Servers";
                response.message = stats ? `${stats}` : "No data";
                response.color = "#5865f2";
                break;
            case "discordusers":
                response.label = "Discord Users";
                response.message = stats ? `${stats}` : "No data";
                response.color = "#5865f2";
                break;
            case "bluesky":
                response.label = "Followers on Bluesky"
                response.message = stats.followers ? `${stats.followers}` : "No data";
                response.color = "#0285ff";
                break;
            case "twitter":
                response.label = "Followers on X"
                response.message = stats.followers ? `${stats.followers}` : "No data";
                response.color = "#211f2d";
                break;
        }
        cache.set(platform, response);
        res.json(response);
});
module.exports = router;
