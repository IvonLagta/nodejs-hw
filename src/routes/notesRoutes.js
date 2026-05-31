import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from '../controllers/notesController.js';
import {
  createNoteSchema,
  getAllNotesSchema,
  noteIdSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const notesRouter = Router();

notesRouter.get('/', celebrate(getAllNotesSchema), getAllNotes);
notesRouter.get('/:noteId', celebrate(noteIdSchema), getNoteById);
notesRouter.post('/', celebrate(createNoteSchema), createNote);
notesRouter.patch('/:noteId', celebrate(updateNoteSchema), updateNote);
notesRouter.delete('/:noteId', celebrate(noteIdSchema), deleteNote);

export default notesRouter;
