const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

function getMembers() {
  const rootMembersPath = path.join(__dirname, '../members.json');
  if (fs.existsSync(rootMembersPath)) {
    try {
      const data = fs.readFileSync(rootMembersPath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading members.json:', err.message);
    }
  }
  const parentMembersPath = path.join(__dirname, '../../members.json');
  if (fs.existsSync(parentMembersPath)) {
    try {
      const data = fs.readFileSync(parentMembersPath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading members.json:', err.message);
    }
  }
  // Default credentials as specified in SDN302 guidelines
  return [{ name: 'storeadmin', pass: 'Store@123' }];
}

const login = async (req, res, next) => {
  try {
    const { name, pass } = req.body;

    if (!name || !pass) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const members = getMembers();
    const member = members.find((m) => m.name === name && m.pass === pass);

    if (!member) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is missing in environment variables');
      return res.status(500).json({ error: 'Internal server configuration error' });
    }

    const payload = {
      name: member.name,
      role: 'admin',
    };

    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    return res.status(200).json({
      token,
      token_type: 'Bearer',
      expires_in: 3600,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};
