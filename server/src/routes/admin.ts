import { Router, Request, Response } from 'express';

const router = Router();

const ADMIN_ID = 'atanu';
const ADMIN_PASSWORD = '6969';

// POST /api/admin/login  — hardcoded credential check
router.post('/login', (req: Request, res: Response) => {
  const { id, password } = req.body;

  if (id === ADMIN_ID && password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      message: 'Admin login successful',
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid admin credentials',
  });
});

export default router;
