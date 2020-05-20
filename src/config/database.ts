import MongoClient from 'mongodb';
import chalk from 'chalk';

class Database {
    async init() {
        const MONGODB = String(process.env.DABASE);
        const client = await MongoClient.connect(MONGODB, { useNewUrlParser: true });

        const db = await client.db();

        if ( client.isConnected() ) {
            console.log('==================DATABASE==================');
            console.log(`STATUS: ${chalk.greenBright('ONLINE 👌')}`);
            console.log(`DATABASE: ${chalk.magenta('db.databaseName ⏺')}`);
        }

        return db;
    }
}

export default Database;