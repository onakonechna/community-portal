export default (connection:any, databaseTypes:any) => {
	const Scope = connection.define('scopes', {
		scope: databaseTypes.STRING,
		description: databaseTypes.TEXT,
		createdAt: {
			type: databaseTypes.DATE,
			field: 'created_at',
		},
		updatedAt: {
			type: databaseTypes.DATE,
			field: 'updated_at'
		},
	});

	Scope.associateUser = (user:any) => {
		Scope.belongsToMany('users', {as:'userScope', through: 'user_scopes', foreignKey: 'scopeId', targetKey: 'scope'});
	};

	return Scope;
}