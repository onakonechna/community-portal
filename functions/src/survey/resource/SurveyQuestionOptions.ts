export default (connection:any, databaseTypes:any) => {
    return connection.define('survey_question_options', {
        id: {
            type: databaseTypes.INTEGER,
            primaryKey: true
        },
        survey_id: databaseTypes.INTEGER,
        question_id: databaseTypes.INTEGER,
        order: databaseTypes.INTEGER,
        text: databaseTypes.TEXT,
    },
    {
        timestamps: false,
        freezeTableName: true,
    });
}