// backend/routes/members.js
import express from 'express';
const router = express.Router();

// Sample in-memory array (replace with DB logic as needed)
let members = [
  { id: '1', name: 'John Doe', role: 'Admin' },
  { id: '2', name: 'Jane Smith', role: 'Member' }
];

// GET /members
router.get('/', (req, res) => {
  res.json(members);
});

// POST /members
router.post('/', (req, res) => {
  const newMember = { id: Date.now().toString(), ...req.body };
  members.push(newMember);
  res.status(201).json(newMember);
});

// PUT /members/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const index = members.findIndex(m => m.id === id);
  if (index === -1) return res.status(404).json({ message: 'Member not found' });

  members[index] = { ...members[index], ...req.body };
  res.json(members[index]);
});

// DELETE /members/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  members = members.filter(m => m.id !== id);
  res.status(204).send();
});

export default router;
