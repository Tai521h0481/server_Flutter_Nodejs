const {BookmarkVocabulary, Vocabulary} = require('../models');

const createBookmarkVocabulary = async (req, res) => {
    const userId = req.user.data._id;
    const {vocabularies} = req.body;
    try {
        for(let vocabulary of vocabularies){
            const vocabularyId = vocabulary._id;
            
            const vocab = await Vocabulary.findById(vocabularyId);
            if (!vocab) {
                return res.status(404).json({ error: 'Vocabulary does not exist' });
            }

            const bookmarkVocab = await BookmarkVocabulary.findOne({userId, vocabularyId});
            if(bookmarkVocab){
                return res.status(400).json({error: 'Vocabulary is already bookmarked'});
            }

            const newBookmarkVocab = new BookmarkVocabulary({
                userId,
                vocabularyId
            });
            await newBookmarkVocab.save();
        }

        res.status(200).json({message: 'Bookmark vocabulary created successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const deleteBookmarkVocabulary = async (req, res) => {
    const userId = req.user.data._id;
    const id = req.params.id || req.query.id;

    try {
        const bookmarkVocab = await BookmarkVocabulary.findOneAndDelete({userId, _id: id});
        if(!bookmarkVocab){
            return res.status(404).json({error: 'Bookmark vocabulary not found'});
        }
        res.status(200).json({message: 'Bookmark vocabulary deleted successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const getAllBookmarkVocabulary = async (req, res) => {
    const userId = req.user.data._id;
    try {
        const bookmarkVocabs = await BookmarkVocabulary.find({userId}).populate('vocabularyId');
        res.status(200).json({bookmarkVocabs});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const deleteBookmarkVocabularyByVocabularyId = async (req, res) => {
    const userId = req.user.data._id;
    const vocabularyId = req.params.vocabularyId || req.query.vocabularyId;
    try {
        const bookmarkVocab = await BookmarkVocabulary.findOneAndDelete({userId, vocabularyId});
        if(!bookmarkVocab){
            return res.status(404).json({error: 'Bookmark vocabulary not found'});
        }
        res.status(200).json({message: 'Bookmark vocabulary deleted successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const deleteAllBookmarkVocabulary = async (req, res) => {
    try {
        await BookmarkVocabulary.deleteMany({});
        res.status(200).json({message: 'All bookmark vocabularies deleted successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const getBookmarkedByTopic = async (req, res) => {
    const userId = req.user.data._id;
    const topicId = req.params.topicId || req.query.topicId;
    try {
        const vocabularies = await Vocabulary.find({ topicId: topicId });
        const bookmarkedVocabularies = await BookmarkVocabulary.find({ userId: userId }).select('vocabularyId');
        const bookmarkedSet = new Set(bookmarkedVocabularies.map(bv => bv.vocabularyId.toString()));
        const result = vocabularies.filter(vocab => bookmarkedSet.has(vocab._id.toString()));

        // Extract only the IDs
        const bookmarkedVocabIds = result.map(vocab => vocab._id.toString());

        res.status(200).json({ bookmarkedVocabIds });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const getBookmarkedVocabulariesByTopic = async (req, res) => {
    const userId = req.user.data._id;
    const topicId = req.params.topicId || req.query.topicId;

    try {
        const vocabularies = await Vocabulary.find({ topicId: topicId });

        const userBookmarks = await BookmarkVocabulary.find({ userId: userId }).select('vocabularyId');
        const bookmarkedSet = new Set(userBookmarks.map(bv => bv.vocabularyId.toString()));

        const bookmarkedVocabularies = vocabularies.filter(vocab => bookmarkedSet.has(vocab._id.toString()));

        res.status(200).json({ bookmarkedVocabularies });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createBookmarkVocabulary,
    deleteBookmarkVocabulary,
    getAllBookmarkVocabulary,
    deleteBookmarkVocabularyByVocabularyId,
    deleteAllBookmarkVocabulary,
    getBookmarkedVocabulariesByTopic,
    getBookmarkedByTopic
}