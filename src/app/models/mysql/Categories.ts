import db from '../../db/connection';
import { DataTypes } from 'sequelize';

const Categories = db.define('Categories', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.STRING,
    }
})

export default Categories;