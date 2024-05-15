const {LearningStatistics, Vocabulary, VocabularyStatistic} = require('../models');

const updateLearningStatistic = async (req, res) => {
    const { learningTime } = req.body;
    const { topicId } = req.params;
    const userId = req.user.data._id;

    try {
        // Tìm kiếm thống kê học tập hiện có cho người dùng và chủ đề này
        let learningStatistic = await LearningStatistics.findOne({ userId, topicId });

        // Nếu không có thống kê nào, tạo mới
        if (!learningStatistic) {
            learningStatistic = new LearningStatistics({
                userId,
                topicId,
                learningPercentage: 0, // Khởi tạo với 0
                learningTime, // Thời gian học từ yêu cầu
                learningCount: 1, // Số lần học khởi tạo là 1
                vocabLearned: 0 // Số từ đã học khởi tạo là 0
            });
        } else {
            // Tăng thời gian học
            learningStatistic.learningTime += learningTime;
            learningStatistic.learningCount += 1;
        }

        // Lấy tất cả từ vựng của chủ đề
        const vocabularies = await Vocabulary.find({ topicId: topicId });
        const vocabStats = [];

        // Lặp qua từng từ vựng để tìm thống kê cho mỗi từ
        for (let vocab of vocabularies) {
            const stat = await VocabularyStatistic.findOne({ userId, vocabularyId: vocab._id });
            if (stat) {
                vocabStats.push(stat);
            }
        }

        // Tính toán các chỉ số cần thiết
     
        let learnedVocabularies = vocabStats.filter(stat => stat.learningCount > 0).length;

        // Cập nhật tỷ lệ học tập dựa trên số từ đã học chia cho tổng số từ trong chủ đề
        learningStatistic.learningPercentage = learnedVocabularies / vocabularies.length;
        learningStatistic.vocabLearned = learnedVocabularies;
        // Lưu thay đổi
        await learningStatistic.save();

        // Phản hồi thành công
        return res.status(200).json({ message: 'Update learning statistic successfully', learningStatistic });
    } catch (error) {
        // Xử lý lỗi
        return res.status(500).json({ message: error.message });
    }
}


const getProcessLearning = async (req, res) => {
    const { topicId } = req.params;
    const userId = req.user.data._id;
    try {
        const learningStatistic = await LearningStatistics.findOne({ userId, topicId });
        if (!learningStatistic) {
            return res.status(200).json({ message: 'Get learning statistic successfully', learningStatistic: {userId, topicId ,learningPercentage: 0, learningTime: 0, learningCount: 0, vocabLearned: 0 } });
        }
        return res.status(200).json({ message: 'Get learning statistic successfully', learningStatistic });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getAllStatisticsForTopic = async (req, res) => {
    const {topicId} = req.params;
    try {
        const learningStatistic = await LearningStatistics.find({topicId})
                                                          .populate("userId")
                                                          .sort({learningPercentage: -1});
        return res.status(200).json({learningStatistic});
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
}

const getUserStatisticForTopic = async (req, res)=>{
    const {topicId, userId} = req.params;
    try{
        const learningStatistic = await LearningStatistics.findOne({topicId, userId}).populate("userId").exec();
        return res.status(200).json({learningStatistic});
    }catch(error){
        return res.status(500).json({error : error.message});
    }
}

module.exports = {
    updateLearningStatistic,
    getProcessLearning,
    getAllStatisticsForTopic,
    getUserStatisticForTopic
}