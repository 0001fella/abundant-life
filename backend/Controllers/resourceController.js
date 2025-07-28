// controllers/resourceController.js

let resources = []; // In-memory storage (replace with DB later)

// GET all resources
export const getResources = (req, res) => {
  res.json(resources);
};

// CREATE a new resource
export const createResource = (req, res) => {
  const newResource = {
    id: Date.now().toString(),
    ...req.body,
  };
  resources.push(newResource);
  res.status(201).json(newResource);
};

// UPDATE a resource
export const updateResource = (req, res) => {
  const resourceId = req.params.id;
  const index = resources.findIndex((r) => r.id === resourceId);

  if (index === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[index] = { ...resources[index], ...req.body };
  res.json(resources[index]);
};

// DELETE a resource
export const deleteResource = (req, res) => {
  const resourceId = req.params.id;
  const index = resources.findIndex((r) => r.id === resourceId);

  if (index === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  const deleted = resources.splice(index, 1);
  res.json(deleted[0]);
};
