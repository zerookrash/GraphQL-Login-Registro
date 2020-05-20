import dotenv from 'dotenv';
const enviroments = dotenv.config({ path: './src/.env' });

if ( process.env.NODE_ENV !== 'production') {
    if (enviroments.error) {
        throw enviroments.error;
    }
}
export default enviroments;