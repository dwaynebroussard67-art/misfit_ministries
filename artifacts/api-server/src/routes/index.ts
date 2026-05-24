import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import prayersRouter from './prayers';
import testimoniesRouter from './testimonies';
import resourcesRouter from './resources';
import contentRouter from './content';
import nuraRouter from './nura';
import forgeRouter from './forge';
import stripeRouter from './stripe';
import videoTestimonialsRouter from './video-testimonials';
import printifyRouter from './printify';
import autopilotRouter from './autopilot';
import contentCreatorRouter from './content-creator';
import authRouter from './auth';

const router: ExpressRouter = Router();

router.use('/prayers', prayersRouter);
router.use('/testimonies', testimoniesRouter);
router.use('/resources', resourcesRouter);
router.use('/content', contentRouter);
router.use('/nura', nuraRouter);
router.use('/forge', forgeRouter);
router.use('/stripe', stripeRouter);
router.use('/video-testimonials', videoTestimonialsRouter);
router.use('/printify', printifyRouter);
router.use('/autopilot', autopilotRouter);
router.use('/content-creator', contentCreatorRouter);
router.use('/auth', authRouter);

export default router;
