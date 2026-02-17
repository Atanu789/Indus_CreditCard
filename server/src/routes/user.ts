import { Router, Request, Response } from 'express';
import User from '../models/User';

const router = Router();

// POST /api/users — Create or update user
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      mobileNumber,
      dob,
      email,
      city,
      cardHolderName,
      cardTotalLimit,
      simLabel,
    } = req.body;

    // Validate required fields
    if (!fullName || !mobileNumber || !dob || !email || !city || !cardHolderName || !cardTotalLimit) {
      res.status(400).json({
        success: false,
        error: 'All fields are required',
      });
      return;
    }

    // Upsert: update if mobile number exists, otherwise create
    const user = await User.findOneAndUpdate(
      { mobileNumber },
      {
        fullName,
        mobileNumber,
        dob,
        email,
        city,
        cardHolderName,
        cardTotalLimit,
        simLabel: simLabel || '',
      },
      { new: true, upsert: true, runValidators: true },
    );

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('[User] Create error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      res.status(400).json({ success: false, error: messages.join(', ') });
      return;
    }
    res.status(500).json({ success: false, error: 'Failed to create user' });
  }
});

// GET /api/users/:mobileNumber — Get user by mobile number
router.get('/:mobileNumber', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ mobileNumber: req.params.mobileNumber });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('[User] Get error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

// GET /api/users — List all users
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(100);
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('[User] List error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

export default router;
