export const requireManager = (req, res, next) => {
  const userType = req.headers['x-user-type'];
  
  if (userType !== 'manager') {
    return res.status(403).json({ error: 'Acesso negado. Apenas gestores.' });
  }
  
  next();
};

export const requireAuth = (req, res, next) => {
  const userType = req.headers['x-user-type'];
  
  if (!userType) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  
  next();
};