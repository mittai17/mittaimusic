/**
 * Quick test script to verify the recommendation engine works
 */

import { buildCoMatrix } from './engine/cooccurrence.js';
import { trainEmbeddings } from './engine/item2vec.js';
import { loadTracks } from './engine/features.js';
import { recommendForTrack } from './engine/recommend.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing Recommendation Engine\n');

// Load data
loadTracks();
const sessions = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/sessions.json'), 'utf-8')
);

// Build models
buildCoMatrix(sessions);
trainEmbeddings(sessions);

// Test recommendations
console.log('\n📊 Testing Recommendations:\n');

const testTrackId = 'track_001';
const result = recommendForTrack(testTrackId, 5);

console.log(`\nInput Track: ${result.track.title} by ${result.track.artist}`);
console.log(`\nTop 5 Recommendations:\n`);

result.recommendations.forEach((rec, index) => {
  console.log(`${index + 1}. ${rec.title} by ${rec.artist}`);
  console.log(`   Genre: ${rec.genre} | Score: ${(rec.score * 100).toFixed(1)}%`);
  console.log(`   Breakdown: Embedding=${rec.breakdown.embedding.toFixed(2)}, Co-occur=${rec.breakdown.cooccurrence.toFixed(2)}, Genre=${rec.breakdown.genre.toFixed(2)}\n`);
});

console.log('✅ Test completed successfully!\n');
