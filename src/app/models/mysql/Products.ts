import db from '../../db/connection';
import { DataTypes } from 'sequelize';

const Products = db.define('Products', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    category: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.FLOAT
    },
    image: {
        type: DataTypes.STRING
    },
    stock: {
        type: DataTypes.INTEGER
    },
    quantity: {
        type: DataTypes.INTEGER
    },
    description: {
        type: DataTypes.STRING
    }
})

export default Products;