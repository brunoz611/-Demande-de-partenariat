#!/usr/bin/env node

/**
 * Script de test du système admin
 * Vérifie que toutes les API fonctionnent correctement
 * Usage: node test-admin.js
 */

const http = require("http");

const BASE_URL = "http://localhost:3000";
let token = "";

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

async function runTests() {
  console.log("\n🧪 Tests du système admin Délicissime\n");

  for (const { name, fn } of tests) {
    try {
      process.stdout.write(`Testing: ${name}... `);
      await fn();
      console.log("✅ OK");
    } catch (error) {
      console.log(`❌ FAIL: ${error.message}`);
    }
  }

  console.log("\n✨ Tests terminés!\n");
}

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        "Content-Type": "application/json"
      }
    };

    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on("error", reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// Tests
test("GET / (Page d'accueil)", async () => {
  const res = await request("GET", "/");
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
});

test("GET /login (Page de connexion)", async () => {
  const res = await request("GET", "/login");
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
});

test("POST /api/auth/login (Authentification)", async () => {
  const res = await request("POST", "/api/auth/login", {
    username: "admin",
    password: "password123"
  });

  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (!res.data.token) throw new Error("No token received");

  token = res.data.token;
});

test("GET /api/auth/verify (Vérification du token)", async () => {
  const res = await request("GET", "/api/auth/verify");
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (!res.data.ok) throw new Error("Invalid response");
});

test("GET /api/content/config (Charger la config)", async () => {
  const res = await request("GET", "/api/content/config");
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (!res.data.colors) throw new Error("No colors in config");
});

test("POST /api/content/colors (Mettre à jour les couleurs)", async () => {
  const res = await request("POST", "/api/content/colors", {
    colors: {
      primary: "#123456",
      accent: "#654321",
      background: "#ffffff"
    }
  });

  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (!res.data.ok) throw new Error("Update failed");
});

test("POST /api/content/content (Mettre à jour le contenu)", async () => {
  const res = await request("POST", "/api/content/content", {
    content: {
      title: "Test Title",
      tagline: "Test Tagline"
    }
  });

  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (!res.data.ok) throw new Error("Update failed");
});

test("POST /api/content/image (Mettre à jour une image)", async () => {
  const res = await request("POST", "/api/content/image", {
    pageKey: "hero",
    imageUrl: "https://example.com/image.jpg"
  });

  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (!res.data.ok) throw new Error("Update failed");
});

test("GET /admin (Dashboard admin)", async () => {
  const res = await request("GET", "/admin");
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
});

test("POST /api/auth/login avec mauvais mot de passe (Doit échouer)", async () => {
  const res = await request("POST", "/api/auth/login", {
    username: "admin",
    password: "wrongpassword"
  });

  if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
});

// Lancer les tests
runTests().catch(console.error);
