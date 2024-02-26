// user.ts
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database'; // Import Sequelize instance

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  }
);

export { User };
