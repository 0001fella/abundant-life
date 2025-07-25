// Dummy controller for now (replace with DB logic later)
export const getMembers = (req, res) => {
  res.status(200).json([{ id: 1, name: 'John Doe' }]);
};

export const createMember = (req, res) => {
  res.status(201).json({ message: 'Member created' });
};

export const updateMember = (req, res) => {
  res.status(200).json({ message: `Member ${req.params.id} updated` });
};

export const deleteMember = (req, res) => {
  res.status(200).json({ message: `Member ${req.params.id} deleted` });
};
