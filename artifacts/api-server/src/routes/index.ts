import { Router } from 'express';
import prayersRouter from './prayers.js';
import testimoniesRouter from './testimonies.js';
import resourcesRouter from './resources.js';
import contentRouter from './content.js';
import siteCopyRouter from './site-copy.js';
import nuraRouter from './nura.js';
import forgeRouter from './forge.js';
import stripeRouter from './stripe.js';
import statsRouter from './stats.js';
import crisisRouter from './crisis.js';
import autopilotRouter from './autopilot.js';
import forgeGenerateRouter from './forge-generate.js';

const router = Router();

// Mount all route modules
router.use('/prayers', prayersRouter);
router.use('/testimonies', testimoniesRouter);
router.use('/resources', resourcesRouter);
router.use('/content', contentRouter);
router.use('/site-copy', siteCopyRouter);
router.use('/nura', nuraRouter);
router.use('/forge', forgeRouter);
router.use('/forge/autopilot', autopilotRouter);
router.use('/forge/media', forgeGenerateRouter);
router.use('/stripe', stripeRouter);
router.use('/stats', statsRouter);
router.use('/crisis', crisisRouter);

export default router;
