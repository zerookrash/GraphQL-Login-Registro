import { IResolvers } from "graphql-tools";
import JWT from '../lib/jwt';
import bcryptjs from 'bcryptjs';


const query : IResolvers = {
    Query : {
        async users (_: void, __: any, { db }): Promise<any> {
            return await db.collection('users').find().toArray();
        },
        async login (_: void, {email, password}, { db }): Promise<any> {
            const user = await db.collection('users').findOne({email});
            if (user === null) {
                return {
                    status: false,
                    message: 'No existe el Usuario \u{1F6AB}. Comprueba la Información',
                    token: null 
                }
            }
            if ( !bcryptjs.compareSync(password, user.password) ) {
                return {
                    status: false,
                    message: 'Contraseña incorrecta \u{1F6AB}. Comprueba la Información',
                    token: null 
                }
            }
            delete user.password;
            return {
                status: true,
                message: 'Login Correcto \u{2705}',
                token: new JWT().sing({ user })
            }
        },
        me(_: void, __: any, { token }) {
            let info: any = new JWT().verify(token);
            if (info === 'La autenticacion del token es invalida \u{1F6AB}'  ) {
                return {
                    status: false,
                    message: info,
                    user: null
                }
            }
            return {
                status: true,
                message: `Token Correcto \u{2705}`,
                user: info.user
            }
        },
        async productos (_: void, __: any, { db }): Promise<any> {
            return await db.collection('productos').find().toArray();
        },
    }
}

export default query;