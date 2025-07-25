import express from 'express';
const router = express.Router();

// Dummy resource store (replace with MongoDB later)
let resources = [];

// GET /api/resources
router.get('/', (req, res) => {
  res.json(resources);
});

// POST /api/resources
router.post('/', (req, res) => {
  const newResource = {
    id: Date.now().toString(),
    ...req.body,
  };
  resources.push(newResource);
  res.status(201).json(newResource);
});

// PUT /api/resources/:id
router.put('/:id', (req, res) => {
  const resourceId = req.params.id;
  const index = resources.findIndex((r) => r.id === resourceId);

  if (index === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[index] = { ...resources[index], ...req.body };
  res.json(resources[index]);
});

// DELETE /api/resources/:id
router.delete('/:id', (req, res) => {
  const resourceId = req.params.id;
  const index = resources.findIndex((r) => r.id === resourceId);

  if (index === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  const deleted = resources.splice(index, 1);
  res.json(deleted[0]);
});

export default router;
