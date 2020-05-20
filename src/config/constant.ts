import enviroment from './enviroment';
import enviroments from './enviroment';

if ( process.env.NODE_ENV !== 'production') {
    const enviroment = enviroments;
}

export const SECRET_KEY = process.env.SECRET || 'MARIOV';