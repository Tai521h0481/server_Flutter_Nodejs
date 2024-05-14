const express = require('express');
const bookmarkVocabulariesRouter = express.Router();

const { BookmarkVocabulary } = require('../models');
const { authentication } = require('../middlewares/authentication/authenticate');
const { isExistId, validateInput, checkId } = require('../middlewares/validation/validation');
const { createBookmarkVocabulary,deleteAllBookmarkVocabulary,getBookmarkedVocabulariesByTopic,
    deleteBookmarkVocabulary, getAllBookmarkVocabulary, deleteBookmarkVocabularyByVocabularyId, getBookmarkedByTopic } = require('../controllers/bookmarkVocabularies.controller');

bookmarkVocabulariesRouter.post("/", authentication, createBookmarkVocabulary);
bookmarkVocabulariesRouter.delete("/", deleteAllBookmarkVocabulary);
bookmarkVocabulariesRouter.delete("/:id", authentication, deleteBookmarkVocabulary);
// xoá bookmark vocabulary theo vocabularyId
bookmarkVocabulariesRouter.delete("/vocabularies/:vocabularyId", authentication, deleteBookmarkVocabularyByVocabularyId);

bookmarkVocabulariesRouter.get("/", authentication, getAllBookmarkVocabulary);
bookmarkVocabulariesRouter.get("/topics/:topicId", authentication, getBookmarkedByTopic);
bookmarkVocabulariesRouter.get("/topics/:topicId/vocabs", authentication, getBookmarkedVocabulariesByTopic);

module.exports = bookmarkVocabulariesRouter;