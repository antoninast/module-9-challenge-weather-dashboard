import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

const app = express();

// -done TODO: Define route to serve index.html
app.get('/', (_req, res) => {
    // Send the HTML file as the response
    res.sendFile(path.join(__dirname, 'index.html'));
});

export default router;
