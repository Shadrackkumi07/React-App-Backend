// middleware/auth.js
const admin = require("firebase-admin");

// ---------- 1. Read & validate env vars ----------
const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} = process.env;

// Convert escaped newlines to real newlines
const privateKey = FIREBASE_PRIVATE_KEY
  ? FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !privateKey) {
  console.error(
    "❌  Firebase env vars are missing.\n" +
    "Make sure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set."
  );
  process.exit(1);
}

// ---------- 2. Initialize Firebase Admin ----------
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey,
  }),
});

// ---------- 3. Auth middleware ----------
module.exports = async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid auth header" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = { uid: decoded.uid, email: decoded.email };
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};
