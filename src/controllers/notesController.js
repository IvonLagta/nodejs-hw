import createHttpError from 'http-errors';
import Note from '../models/note.js';

export const getNoteById = async (req, res) => {
	const { noteId } = req.params;
	const note = await Note.findById(noteId);

	if (!note) {
		throw createHttpError(404, 'Note not found');
	}

	res.status(200).json(note);
};

