import { Router } from 'express';
import { getNoteById } from '../controllers/notesController.js';

const notesRouter = Router();

notesRouter.get('/:noteId', getNoteById);

export default notesRouter;

