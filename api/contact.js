const nodemailer = require("nodemailer");

const parseRequestPayload = async (req) => {
  if (req.headers["content-type"]?.includes("application/json")) {
    if (typeof req.body === "string") {
      return JSON.parse(req.body);
    }
    if (req.body && typeof req.body === "object") {
      return req.body;
    }
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    return JSON.parse(Buffer.concat(buffers).toString("utf8"));
  }

  return {};
};

const buildTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP_HOST, SMTP_USER et SMTP_PASSWORD doivent être définis dans les variables d'environnement."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
};

const formatMessage = (data) => {
  const {
    lastname,
    firstname,
    company,
    email,
    phone,
    activity = [],
    message = ""
  } = data;

  const activityList = Array.isArray(activity) ? activity : [activity].filter(Boolean);

  const text = [
    `Nom : ${lastname || "-"}`,
    `Prénom : ${firstname || "-"}`,
    `Entreprise : ${company || "-"}`,
    `Email : ${email || "-"}`,
    `Téléphone : ${phone || "-"}`,
    `Prestations souhaitées : ${activityList.length ? activityList.join(", ") : "-"}`,
    "",
    "Message :",
    message || "-"
  ].join("\n");

  const html = `
    <h2>Nouveau message depuis le site Magali &amp; Ghislain</h2>
    <ul>
      <li><strong>Nom :</strong> ${lastname || "-"}</li>
      <li><strong>Prénom :</strong> ${firstname || "-"}</li>
      <li><strong>Entreprise :</strong> ${company || "-"}</li>
      <li><strong>Email :</strong> ${email || "-"}</li>
      <li><strong>Téléphone :</strong> ${phone || "-"}</li>
      <li><strong>Prestations souhaitées :</strong> ${
        activityList.length ? activityList.join(", ") : "-"
      }</li>
    </ul>
    <h3>Message</h3>
    <p>${(message || "-").replace(/\n/g, "<br>")}</p>
  `;

  return { text, html };
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.end("Method Not Allowed");
    return;
  }

  let payload;
  try {
    payload = await parseRequestPayload(req);
  } catch (error) {
    console.error("Impossible de parser les données reçues :", error);
    res.statusCode = 400;
    res.end("Requête invalide.");
    return;
  }

  const required = ["lastname", "firstname", "email", "consent"];
  const missing = required.filter((field) => !payload[field]);
  if (missing.length) {
    res.statusCode = 400;
    res.end(`Champs manquants : ${missing.join(", ")}`);
    return;
  }

  let transporter;
  try {
    transporter = buildTransporter();
  } catch (error) {
    console.error("Configuration SMTP invalide :", error);
    res.statusCode = 500;
    res.end("Le service de messagerie n'est pas configuré.");
    return;
  }

  const recipient = process.env.CONTACT_RECIPIENT || "gchamonard@yahoo.com";
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;

  const { text, html } = formatMessage(payload);

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      replyTo: payload.email,
      subject: `Nouveau message du site – ${payload.lastname} ${payload.firstname}`,
      text,
      html
    });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true }));
  } catch (error) {
    console.error("Erreur lors de l'envoi du mail :", error);
    res.statusCode = 502;
    res.end("Impossible d'envoyer le message pour le moment.");
  }
};
