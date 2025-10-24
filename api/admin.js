const fs = require("fs/promises");
const path = require("path");

const realm = 'Admin Area';
const USERNAME = process.env.ADMIN_USER || "";
const PASSWORD = process.env.ADMIN_PASSWORD || "";

const unauthorized = (res) => {
  res.statusCode = 401;
  res.setHeader("WWW-Authenticate", `Basic realm="${realm}"`);
  res.end("Authentication required.");
};

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end("Method Not Allowed");
    return;
  }

  if (!USERNAME || !PASSWORD) {
    console.error(
      "ADMIN_USER et ADMIN_PASSWORD ne sont pas définis dans l'environnement. L'accès à /admin est bloqué."
    );
    res.statusCode = 500;
    res.end("Configuration manquante. Veuillez définir ADMIN_USER et ADMIN_PASSWORD.");
    return;
  }

  const authHeader = req.headers.authorization || "";
  const [scheme, encoded] = authHeader.split(" ");

  if (scheme !== "Basic" || !encoded) {
    unauthorized(res);
    return;
  }

  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const separatorIndex = decoded.indexOf(":");
  if (separatorIndex === -1) {
    unauthorized(res);
    return;
  }
  const providedUser = decoded.slice(0, separatorIndex);
  const providedPassword = decoded.slice(separatorIndex + 1);

  if (providedUser !== USERNAME || providedPassword !== PASSWORD) {
    unauthorized(res);
    return;
  }

  try {
    const filePath = path.join(__dirname, "..", "admin.html");
    const html = await fs.readFile(filePath, "utf8");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.statusCode = 200;
    res.end(html);
  } catch (error) {
    console.error("Impossible de charger admin.html :", error);
    res.statusCode = 500;
    res.end("Erreur serveur.");
  }
};
