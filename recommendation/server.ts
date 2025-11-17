/**
 * Recommendation API Server
 * 
 * Express server providing recommendation endpoints.
 */

import express from 'express';
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import engine modules
import { buildCoMatrix } from './engine/cooccurrence.js';
import { trainEmbeddings } from './engine/item2vec.js';
import { loadTracks, getAllTracks } from './engine/features.js';
import { recommendForTrack, recommendForUser } from './engine/recommend.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize recommendation engine
console.log('🚀 Initializing recommendation engine...\n');

// Load data
loadTracks();

const sessionsPath = path.join(__dirname, '../data/sessions.json');
const sessions = JSON.parse(fs.readFileSync(sessionsPath, 'utf-8'));
console.log(`✓ Loaded ${sessions.length} sessions\n`);

// Build models
console.log('Building models...');
buildCoMatrix(sessions);
trainEmbeddings(sessions);

console.log('\n✅ Recommendation engine ready!\n');

// Routes

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Recommendation engine is running' });
});

/**
 * GET /recommend/track/:id
 * Get recommendations for a specific track
 */
app.get('/recommend/track/:id', (req, res) => {
  try {
    const trackId = req.params.id;
    const limit = parseInt(req.query.limit as string) || 10;

    const recommendations = recommendForTrack(trackId, limit);

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /recommend/user/:userId
 * Get recommendations for a specific user
 */
app.get('/recommend/user/:userId', (req, res) => {
  try {
    const userId = req.params.userId;
    const limit = parseInt(req.query.limit as string) || 10;

    const recommendations = recommendForUser(userId, limit);

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /tracks
 * Get all available tracks
 */
app.get('/tracks', (req, res) => {
  const tracks = getAllTracks();
  res.json({
    success: true,
    data: tracks,
  });
});

/**
 * GET /tracks/:id
 * Get a specific track
 */
app.get('/tracks/:id', (req, res) => {
  const tracks = getAllTracks();
  const track = tracks.find(t => t.id === req.params.id);

  if (!track) {
    return res.status(404).json({
      success: false,
      error: 'Track not found',
    });
  }

  res.json({
    success: true,
    data: track,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 Recommendation API server running on http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET  /health`);
  console.log(`  GET  /tracks`);
  console.log(`  GET  /tracks/:id`);
  console.log(`  GET  /recommend/track/:id`);
  console.log(`  GET  /recommend/user/:userId`);
  console.log(`\nExample: http://localhost:${PORT}/recommend/track/track_001\n`);
});

export default app;
