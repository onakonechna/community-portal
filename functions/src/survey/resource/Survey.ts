export default (connection:any, databaseTypes:any) => {
    return connection.define('survey', {
        id: {
            type: databaseTypes.INTEGER,
            primaryKey: true
        },
        code: databaseTypes.STRING,
        text: databaseTypes.TEXT,
        enabled: databaseTypes.INTEGER,
    },
    {
        timestamps: false,
        freezeTableName: true,
    });
}