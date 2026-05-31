import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from '../controllers/notesController.js';
import authenticate from '../middleware/authenticate.js';
import {
  createNoteSchema,
  getAllNotesSchema,
  noteIdSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const notesRouter = Router();

notesRouter.use(authenticate);

notesRouter.get('/', celebrate(getAllNotesSchema), getNotes);
notesRouter.get('/:noteId', celebrate(noteIdSchema), getNoteById);
notesRouter.post('/', celebrate(createNoteSchema), createNote);
notesRouter.patch('/:noteId', celebrate(updateNoteSchema), updateNote);
notesRouter.delete('/:noteId', celebrate(noteIdSchema), deleteNote);

export default notesRouter;
