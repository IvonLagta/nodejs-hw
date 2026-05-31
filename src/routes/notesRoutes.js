import { Router } from 'express';
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from '../controllers/notesController.js';

const notesRouter = Router();

notesRouter.get('/notes', getAllNotes);
notesRouter.post('/notes', createNote);
notesRouter.get('/notes/:noteId', getNoteById);
notesRouter.delete('/notes/:noteId', deleteNote);
notesRouter.patch('/notes/:noteId', updateNote);

export default notesRouter;
