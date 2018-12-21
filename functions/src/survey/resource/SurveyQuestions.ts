export default (connection:any, databaseTypes:any) => {
    return connection.define('survey_questions', {
        id: {
            type: databaseTypes.INTEGER,
            primaryKey: true
        },
        survey_id: databaseTypes.INTEGER,
        text: databaseTypes.TEXT,
        type: databaseTypes.TEXT,
        is_required: databaseTypes.INTEGER,
    },
    {
        timestamps: false,
        freezeTableName: true,
    });
}