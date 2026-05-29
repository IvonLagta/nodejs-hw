import createHttpError from 'http-errors';
import Note from '../models/note.js';

const parsePaginationNumber = (value, defaultValue) => {
	const parsedValue = Number.parseInt(value, 10);

	if (Number.isNaN(parsedValue) || parsedValue < 1) {
		return defaultValue;
	}

	return parsedValue;
};

export const getNotes = async (req, res) => {
	const { tag, search } = req.query;
	const page = parsePaginationNumber(req.query.page, 1);
	const perPage = parsePaginationNumber(req.query.perPage, 10);
	const skip = (page - 1) * perPage;
	const filter = {};

	if (tag) {
		filter.tag = tag;
	}

	if (search) {
		filter.$or = [
			{ title: { $regex: search, $options: 'i' } },
			{ content: { $regex: search, $options: 'i' } },
		];
	}

	const [totalNotes, notes] = await Promise.all([
		Note.countDocuments(filter),
		Note.find(filter).skip(skip).limit(perPage),
	]);
	const totalPages = Math.ceil(totalNotes / perPage);

	res.status(200).json({
		page,
		perPage,
		totalNotes,
		totalPages,
		notes,
	});
};

export const getNoteById = async (req, res) => {
	const { noteId } = req.params;
	const note = await Note.findById(noteId);

	if (!note) {
		throw createHttpError(404, 'Note not found');
	}

	res.status(200).json(note);
};

export const createNote = async (req, res) => {
	const note = await Note.create(req.body);

	res.status(201).json(note);
};

export const updateNote = async (req, res) => {
	const { noteId } = req.params;
	const note = await Note.findByIdAndUpdate(noteId, req.body, {
		new: true,
		runValidators: true,
	});

	if (!note) {
		throw createHttpError(404, 'Note not found');
	}

	res.status(200).json(note);
};

export const deleteNote = async (req, res) => {
	const { noteId } = req.params;
	const note = await Note.findByIdAndDelete(noteId);

	if (!note) {
		throw createHttpError(404, 'Note not found');
	}

	res.status(204).send();
};

