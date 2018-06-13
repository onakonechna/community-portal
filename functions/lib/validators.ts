const ajv = require('ajv');

const createProjectValidator = ajv();
const createProjectSchema = {
  properties: {
    project_id: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    size: { type: 'string', enum: ['S', 'M', 'L', 'XL'] },
    due: { type: 'integer' },
    estimated: { type: 'integer' },
    github_address: { type: 'string' },
    technologies: { items: { type: 'string' }, },
    tags: { items: { type: 'string' }, },
    skills: { items: { type: 'string' }, },
    slack_channel: { type: 'string' },
  },
  additionalProperties: false,
  required: ['project_id', 'name', 'description', 'size', 'due', 'github_address', 'estimated', 'technologies'],
};
createProjectValidator.addSchema(createProjectSchema, 'createProjectSchema');


module.exports.createProjectValidator = createProjectValidator;
