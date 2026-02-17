import { Router, Request, Response } from 'express';
import ServiceRequest from '../models/ServiceRequest';
import User from '../models/User';

const router = Router();

// POST /api/services — Create a new service request
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      serviceType,
      cardName,
      fullName,
      mobileNumber,
      dob,
      email,
      city,
      cardHolderName,
      cardTotalLimit,
      simLabel,
    } = req.body;

    if (!serviceType || !cardName || !fullName || !mobileNumber) {
      res.status(400).json({
        success: false,
        error: 'serviceType, cardName, fullName, and mobileNumber are required',
      });
      return;
    }

    // Find or create user
    let user = await User.findOne({ mobileNumber });
    if (!user) {
      user = await User.create({
        fullName,
        mobileNumber,
        dob,
        email,
        city,
        cardHolderName,
        cardTotalLimit,
        simLabel: simLabel || '',
      });
    }

    // Create service request
    const serviceRequest = await ServiceRequest.create({
      userId: user._id,
      serviceType,
      cardName,
      fullName,
      mobileNumber,
      dob,
      email,
      city,
      cardHolderName,
      cardTotalLimit,
      simLabel: simLabel || '',
    });

    res.status(201).json({
      success: true,
      data: {
        referenceId: serviceRequest.referenceId,
        serviceType: serviceRequest.serviceType,
        status: serviceRequest.status,
        fullName: serviceRequest.fullName,
        createdAt: serviceRequest.createdAt,
      },
    });
  } catch (error: any) {
    console.error('[Service] Create error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      res.status(400).json({ success: false, error: messages.join(', ') });
      return;
    }
    res.status(500).json({ success: false, error: 'Failed to create service request' });
  }
});

// GET /api/services/:referenceId — Get service request by reference ID
router.get('/:referenceId', async (req: Request, res: Response): Promise<void> => {
  try {
    const serviceRequest = await ServiceRequest.findOne({
      referenceId: req.params.referenceId,
    }).populate('userId', 'fullName mobileNumber email');

    if (!serviceRequest) {
      res.status(404).json({
        success: false,
        error: 'Service request not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: serviceRequest,
    });
  } catch (error) {
    console.error('[Service] Get error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch service request' });
  }
});

// GET /api/services — List all service requests
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const requests = await ServiceRequest.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('userId', 'fullName mobileNumber email');

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('[Service] List error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch service requests' });
  }
});

// PATCH /api/services/:referenceId/status — Update service request status
router.patch('/:referenceId/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'completed', 'rejected'];

    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        error: `Status must be one of: ${validStatuses.join(', ')}`,
      });
      return;
    }

    const serviceRequest = await ServiceRequest.findOneAndUpdate(
      { referenceId: req.params.referenceId },
      { status },
      { new: true },
    );

    if (!serviceRequest) {
      res.status(404).json({
        success: false,
        error: 'Service request not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: serviceRequest,
    });
  } catch (error) {
    console.error('[Service] Update error:', error);
    res.status(500).json({ success: false, error: 'Failed to update service request' });
  }
});

export default router;
