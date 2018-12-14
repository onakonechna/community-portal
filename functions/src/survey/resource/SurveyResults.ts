export default (connection:any, databaseTypes:any) => {
    return connection.define('survey_results', {
        id: {
            type: databaseTypes.INTEGER,
            primaryKey: true
        },
        user_id: databaseTypes.INTEGER,
        survey_id: databaseTypes.INTEGER,
        option_id: databaseTypes.INTEGER,
        value: databaseTypes.TEXT,
        scope: databaseTypes.TEXT,
    },
    {
        timestamps: false,
        freezeTableName: true,
    });
}