// API-endpoint-related JSON validation schemas
const createProjectSchema = {
  properties: {
    project_id: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    size: { type: 'string', enum: ['S', 'M', 'L', 'XL'] },
    due: { type: 'integer' },
    estimated: { type: 'integer' },
    github_address: { type: 'string' },
    technologies: { items: { type: 'string' } },
    tags: { items: { type: 'string' } },
    skills: { items: { type: 'string' } },
    slack_channel: { type: 'string' },
  },
  additionalProperties: false,
  required: [
    'project_id',
    'name',
    'description',
    'size',
    'due',
    'github_address',
    'estimated',
    'technologies',
  ],
};

const editProjectSchema = {
  properties: {
    project_id: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    size: { type: 'string', enum: ['S', 'M', 'L', 'XL'] },
    due: { type: 'integer' },
    estimated: { type: 'integer' },
    completed: { type: 'integer' },
    technologies: { items: { type: 'string' } },
    tags: { items: { type: 'string' } },
    skills: { items: { type: 'string' } },
    github_address: { type: 'string' },
    slack_channel: { type: 'string' },
  },
  additionalProperties: false,
  required: [
    'project_id',
  ],
};

const updateProjectStatusSchema = {
  properties: {
    project_id: { type: 'string' },
    status: { type: 'string' },
  },
  additionalProperties: false,
  required: ['project_id', 'status'],
};

// Special JSON validation schemas
const nullSchema = {
  properties: {},
  additionalProperties: false,
};

const projectIdOnlySchema = {
  properties: {
    project_id: { type: 'string' },
  },
  additionalProperties: false,
  required: ['project_id'],
};

// Put all schemas together
const validationSchemas: any = {
  createProjectSchema,
  editProjectSchema,
  updateProjectStatusSchema,
  nullSchema,
  projectIdOnlySchema,
};

export default validationSchemas;
