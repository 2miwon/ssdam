const createTopicImagePath = (topicName) => require(`../../../../public/assets/topic/${topicName}.png`);

export const TOPICS = [
    { topic: '여행', imageName: 'travel' },
    { topic: '사진', imageName: 'photo' },
    { topic: '영화', imageName: 'movie' },
    { topic: '책', imageName: 'book' },
    { topic: '글쓰기', imageName: 'writing' },
    { topic: '음악', imageName: 'music' },
    { topic: '요리', imageName: 'cook' },
    { topic: '육아', imageName: 'parenting' },
    { topic: '스타트업', imageName: 'startup' },
    { topic: '건강', imageName: 'health' },
    { topic: '운동', imageName: 'exercise' },
    { topic: '멘탈', imageName: 'mental' },
    { topic: '인문학', imageName: 'Humanities' },
    { topic: '사랑', imageName: 'love' },
    { topic: '인생', imageName: 'economic' },
    { topic: '감성', imageName: 'emotional' }
];

export const getTopicList = () => TOPICS.map(topic => ({
    ...topic,
    path: createTopicImagePath(topic.imageName)
}));