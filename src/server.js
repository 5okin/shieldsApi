const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const routes = require("./routes");
const { limiter, ipWhitelist, blockBots, limitPayload, corsOptions } = require("./middlewares");


const app = express();
const PORT = process.env.PORT || 4000;

app.set("trust proxy", 1);
app.use(helmet());
app.use(compression());
app.use(cors(corsOptions));
app.use(limiter);
app.use(ipWhitelist);
app.use(blockBots);
app.use(limitPayload);
app.use(express.json({ limit: "1kb" }));
app.use(express.urlencoded({ extended: true, limit: "1kb" }));

app.use("/", routes);

app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
