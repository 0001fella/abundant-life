import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey'; // replace with your actual secret

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};
