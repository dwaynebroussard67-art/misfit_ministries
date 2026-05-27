import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import prayersRouter from './prayers.js';
import testimoniesRouter from './testimonies.js';
import resourcesRouter from './resources.js';
import contentRouter from './content.js';
import nuraRouter from './nura.js';
import forgeRouter from './forge.js';
import stripeRouter from './stripe.js';
import videoTestimonialsRouter from './video-testimonials.js';
import printifyRouter from './printify.js';
import autopilotRouter from './autopilot.js';
import contentCreatorRouter from './content-creator.js';
import authRouter from './auth.js';

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
