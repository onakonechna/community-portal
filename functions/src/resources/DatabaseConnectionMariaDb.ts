import * as Sequelize from "sequelize";

class DatabaseConnection {
  connection;

  connect() {
    if (this.connection) return this.connection;
    this.connection = process.env.IS_OFFLINE ?
      this.localConnect() : this.productionConnect();

    return this.connection;
	}

	private localConnect () {
		return new Sequelize('community_portal', 'root', null, {
			host: 'localhost',
			operatorsAliases: false,
			logging: console.log,
			dialect: 'mysql'
		});
	}

	private productionConnect () {
    return new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_USERPASSWORD, {
			host: process.env.DB_HOST,
			logging: console.log,
			dialect: 'mysql',
			operatorsAliases: false,
			dialectOptions: {
				ssl:'Amazon RDS'
			}
		});
  }
}

export const databaseTypes = Sequelize;
export default new DatabaseConnection();