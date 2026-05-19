const { useMongoDBAuthState } = require('mongo-baileys');
const { MongoClient } = require('mongodb');
const logger = require('../utils/logger');

const sessions = new Map();
const qrStore = new Map();

let mongoClient = null;

async function getMongoClient() {
    if (!mongoClient) {
        mongoClient = new MongoClient(process.env.MONGODB_URI);
        await mongoClient.connect();
    }
    return mongoClient;
}

async function restoreAllSessions(createSessionViaQR) {
    try {
        const client = await getMongoClient();
        const db = client.db('preciousbot');
        const sessionsCollection = db.collection('auth_states');
        
        const sessionKeys = await sessionsCollection.distinct('key');
        
        for (const key of sessionKeys) {
            if (!sessions.has(key)) {
                logger.info(`Restoring session for ${key}`);
                await createSessionViaQR(key);
            }
        }
        
        logger.info(`Restored ${sessionKeys.length} sessions`);
    } catch (err) {
        logger.error('Failed to restore sessions:', err);
    }
}

module.exports = { sessions, qrStore, restoreAllSessions };
