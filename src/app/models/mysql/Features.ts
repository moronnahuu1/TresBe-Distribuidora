import db from '../../db/connection';
import { DataTypes } from 'sequelize';

const Features = db.define('Features', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    product_id: {
        type: DataTypes.STRING,
    },
    name: {
        type: DataTypes.STRING,
    },
    value: {
        type: DataTypes.STRING
    }
})

export default Features;