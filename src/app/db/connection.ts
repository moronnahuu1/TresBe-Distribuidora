 import { Sequelize } from "sequelize";

 const sequelize = new Sequelize('tresbe', 'root', 'Bocajuniors10', {
    host: 'localhost',
    port: 3306,
    dialect: "mysql"
 })
 export default sequelize;