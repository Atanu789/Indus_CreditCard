import { Router, Request, Response } from 'express';
import { getUserSmsModel } from '../models/UserSms';

const router = Router();

// POST /api/sms/save  — save a user's recent 3 SMS messages
router.post('/save', async (req: Request, res: Response) => {
  try {
    const { mobileNumber, fullName, messages } = req.body;

    if (!mobileNumber || !fullName || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'mobileNumber, fullName, and messages[] are required',
      });
    }

    const UserSms = getUserSmsModel();
    if (!UserSms) {
      return res.status(503).json({
        success: false,
        error: 'Messages database is not available',
      });
    }

    // Always create a new record (every submission = new snapshot)
    const record = await UserSms.create({
      mobileNumber,
      fullName,
      messages: messages.slice(0, 3), // cap at 3
    });

    return res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error: any) {
    console.error('[SMS Route] Save error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to save SMS messages',
    });
  }
});

// GET /api/sms/all  — retrieve all saved SMS records (admin use)
router.get('/all', async (_req: Request, res: Response) => {
  try {
    const UserSms = getUserSmsModel();
    if (!UserSms) {
      return res.status(503).json({
        success: false,
        error: 'Messages database is not available',
      });
    }

    const records = await UserSms.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error: any) {
    console.error('[SMS Route] Fetch all error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve SMS messages',
    });
  }
});

export default router;
