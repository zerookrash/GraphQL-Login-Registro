import { SECRET_KEY } from "../config/constant";
import jwt from 'jsonwebtoken';

class JWT {
    private secretKey = SECRET_KEY as string;
    
    // Firma

    sing(data: any): string {
        return jwt.sign({ user: data.user }, this.secretKey, { expiresIn: 24 * 60 * 60 });
    }

    // Verificación

    verify(token: string): string {
        try {
            return jwt.verify(token, this.secretKey) as string;
        } catch (e) {
            return 'La autenticacion del token es invalida \u{1F6AB}' 
        }
    }
}

export default JWT;