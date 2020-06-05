import { IResolvers } from 'graphql-tools'
import { Datetime } from '../lib/datetime'
import bcryptjs from 'bcryptjs'
import JWT from '../lib/jwt'

const mutation: IResolvers = {
  Mutation: {
    async register(_: void, { user }, { db }): Promise<any> {
      const userCheck = await db
        .collection('users')
        .findOne({ email: user.email })

      if (userCheck !== null) {
        return {
          status: false,
          message: `Usuario ya existe ${user.email}. No se creo un nuevo usuario. \u{274C}`,
          user: null,
        }
      }

      const lastUser = await db
        .collection('users')
        .find()
        .limit(1)
        .sort({ registerDate: -1 })
        .toArray()
      if (lastUser.length === 0) {
        user.id = 1
      } else {
        user.id = lastUser[0].id + 1
      }

      user.password = bcryptjs.hashSync(user.password, 10)

      user.registerDate = new Datetime().getCurrentDateTime()
      return await db
        .collection('users')
        .insertOne(user)
        .then((result: any) => {
          return {
            status: true,
            message: `Usuario: ${user.name} ${user.lastname} añadido correctamente`,
            user,
          }
        })
        .catch((e: any) => {
          return {
            status: false,
            message: 'Usuario NO añadido',
            user: null,
          }
        })
    },
    async addProduct(_: void, { producto }, { db, token }): Promise<any> {
      // Validando token y usuario

      let info: any = new JWT().verify(token)
      if (info === 'La autenticacion del token es invalida \u{1F6AB}') {
        return {
          status: false,
          message: info,
          user: null,
        }
      }

      // Validando token y usuario

      // Validando que el producto no se repita
      const productoCheck = await db
        .collection('productos')
        .findOne({ id: producto.id })

      if (productoCheck !== null) {
        return {
          status: false,
          message: `El Producto ya existe ${producto.nombre}. No se creo un nuevo producto. \u{274C}`,
          user: info.user,
          producto: null,
        }
      }

      // Creando el id de producto
      const lastProduct = await db
        .collection('productos')
        .find()
        .limit(1)
        .sort({ registerDate: -1 })
        .toArray()

      if (lastProduct.length === 0) {
        producto.id = 1
      } else {
        producto.id = lastProduct[0].id + 1
      }
      // Creando el id de producto

      // Validando que el producto no se repita

      // Incertando el producto en la colección productos
      producto.registerDate = new Datetime().getCurrentDateTime()

      return await db
        .collection('productos')
        .insertOne(producto)
        .then(async (result: any) => {
          // Actualizar el objeto del usuario Productos
          let productos = info.user.productos
          productos.push({
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            status: producto.status,
            stock: producto.stock,
            imgs: producto.imgs,
            precio: producto.precio,
            registerDate: producto.registerDate,
          })
          await db.collection('users').updateOne(
            { id: info.user.id },
            {
              $push: {
                productos: {
                  $each: productos,
                },
              },
            },
            { upsert: true },
          )

          // Actualizar el objeto del usuario Productos
          return {
            status: true,
            message: `Producto ${producto.nombre} añadido con exito. \u{2705}`,
            user: info.user,
            producto,
          }
        })
        .catch((e: any) => {
          return {
            status: false,
            message: 'Producto no añadido \u{1F92E} \u{1F92E} \u{1F92E}',
            user: info.user,
            producto: e,
          }
        })
      // Incertando el producto en la colección productos
    },
  },
}

export default mutation
