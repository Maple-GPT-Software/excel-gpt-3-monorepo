import express from 'express';

import validate from '../middleware/validate';

const router = express.Router();

router.post('/', () => console.log('hello world'));

router.delete('/:id', () => console.log('hello world'));

// for saving / renaming
router.patch('/edit/:id', () => console.log('hello world'));

export default router;
