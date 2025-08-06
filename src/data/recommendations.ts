import type { EmotionQuadrant } from '../types';

// 今日宜忌建议数据库
export const recommendationsData = {
    // 活力四射区 (高PA / 低NA)
    energetic: {
        focusEngagement: {
            suitable: [
                '今天是你进行深度工作的黄金时间，去攻克那个最复杂的难题吧！',
                '学习一门新课程或阅读一本有深度的书，你的吸收效率会非常高。',
                '规划一下未来一周的工作或学习，清晰的思路能让你事半功倍。'
            ],
            avoid: [
                '把时间浪费在无意义的闲聊或刷手机上，这会辜负你敏锐的头脑。',
                '同时开启太多任务，分散你宝贵的注意力。'
            ]
        },
        vitalityEnthusiasm: {
            suitable: [
                '进行一次酣畅淋漓的体育锻炼，让身体的能量尽情释放。',
                '启动一个你期待已久的新项目，用你的热情感染团队。',
                '主动组织一次社交活动，你的活力会是全场的焦点。'
            ],
            avoid: [
                '久坐不动，让身体的能量无处安放。',
                '勉强自己做需要极大耐心和安静的细致工作。'
            ]
        },
        confidenceStrength: {
            suitable: [
                '主动承担一项有挑战性的任务或在会议中大胆发言。',
                '进行一次重要的、需要说服对方的谈话。',
                '回顾近期的成就，写下来，让这份自信感得到巩固。'
            ],
            avoid: [
                '自我怀疑，或因担心失败而回避机会。',
                '将他人的负面评价放在心上。'
            ]
        }
    },

    // 悲喜交加区 (高PA / 高NA)
    mixed: {
        anxietyFear: {
            suitable: [
                '将让你焦虑的大任务分解成一个个可执行的小步骤，然后完成第一步。',
                '进行结构化的活动，如整理房间或按照清单购物，掌控感能缓解焦虑。',
                '与一位你信任的朋友聊聊你的担忧，把压力说出来。'
            ],
            avoid: [
                '任由思绪飘到遥远的、不确定的未来。',
                '在没有周全计划的情况下，凭着一股冲劲开始高风险任务。'
            ]
        },
        irritabilityHostility: {
            suitable: [
                '把这股"火气"用在建设性的地方，比如一场高强度的运动或一次彻底的房间大扫除。',
                '暂时离开让你烦躁的环境，独自听一些节奏感强的音乐。',
                '有意识地放慢语速和呼吸，给自己物理降温。'
            ],
            avoid: [
                '与人进行可能引起争执的辩论。',
                '处理需要极大共情和耐心的客户服务类工作。'
            ]
        },
        guiltShame: {
            suitable: [
                '把注意力从"结果"转移到"努力"上，肯定自己付出的过程。',
                '做一件能立即看到成果的小事，比如做一顿饭、修复一个小物件，重建成就感。',
                '阅读名人传记，看看他们是如何面对和走出失败的。'
            ],
            avoid: [
                '反复回味犯错的细节，进行自我批判。',
                '因为害怕再次犯错而完全回避相关的任务。'
            ]
        }
    },

    // 心力交瘁区 (低PA / 高NA)
    exhausted: {
        anxietyFear: {
            suitable: [
                '用温暖的毯子包裹自己，看一部熟悉的、治愈系的电影。',
                '做一些简单的、重复性的手工，如涂色、编织，让大脑得以休息。',
                '只专注于一件事：让你的呼吸变得深长而平缓。'
            ],
            avoid: [
                '强迫自己去社交或接触大量新信息。',
                '关注新闻或社交媒体上可能引起焦虑的内容。'
            ]
        },
        irritabilityHostility: {
            suitable: [
                '给自己创造一个安静、不被打扰的独处空间。',
                '用冷水洗把脸，或者洗个舒服的热水澡。',
                '把烦恼写在纸上，然后把它撕掉或揉成一团扔掉。'
            ],
            avoid: [
                '压抑自己的情绪，假装"我很好"。',
                '处理琐碎且容易出错的行政类事务。'
            ]
        },
        guiltShame: {
            suitable: [
                '对自己说一句："没关系，这是可以被原谅的。"',
                '和宠物玩耍，或者看看可爱的动物视频，感受无条件的爱。',
                '帮助一个需要帮助的人，哪怕只是微不足道的小事，这能提升自我价值感。'
            ],
            avoid: [
                '孤立自己，拒绝与外界的一切连接。',
                '拿自己和别人比较。'
            ]
        }
    },

    // 心如止水区 (低PA / 低NA)
    calm: {
        general: {
            suitable: [
                '整理你的书桌、衣柜或电脑文件，为生活建立新的秩序。',
                '进行一次平静的散步，不设定目的地，只是感受身体的移动。',
                '回顾过去一周，写下值得感恩的三件事。',
                '做一些未来的规划，比如制定旅行计划或学习蓝图，但暂时不用开始执行。'
            ],
            avoid: [
                '强迫自己表现出热情和活力。',
                '参加能量消耗巨大的大型派对或活动。',
                '对自己缺乏动力感到愧疚，这只是一个正常的身心休整期。'
            ]
        }
    }
};

// 根据象限和主导维度生成建议
export function generateRecommendations(
    quadrant: EmotionQuadrant,
    dominantPositive: string,
    dominantNegative: string
): string[] {
    const recommendations: string[] = [];

    if (quadrant === 'energetic') {
        const dimension = dominantPositive as keyof typeof recommendationsData.energetic;
        const data = recommendationsData.energetic[dimension];
        if (data) {
            // 随机选择1-2条适宜建议
            const suitable = data.suitable.sort(() => 0.5 - Math.random()).slice(0, 2);
            // 随机选择1条忌讳建议
            const avoid = data.avoid.sort(() => 0.5 - Math.random()).slice(0, 1);
            recommendations.push(...suitable.map(item => `宜👍：${item}`));
            recommendations.push(...avoid.map(item => `忌👎：${item}`));
        }
    } else if (quadrant === 'mixed') {
        const dimension = dominantNegative as keyof typeof recommendationsData.mixed;
        const data = recommendationsData.mixed[dimension];
        if (data) {
            const suitable = data.suitable.sort(() => 0.5 - Math.random()).slice(0, 2);
            const avoid = data.avoid.sort(() => 0.5 - Math.random()).slice(0, 1);
            recommendations.push(...suitable.map(item => `宜👍：${item}`));
            recommendations.push(...avoid.map(item => `忌👎：${item}`));
        }
    } else if (quadrant === 'exhausted') {
        const dimension = dominantNegative as keyof typeof recommendationsData.exhausted;
        const data = recommendationsData.exhausted[dimension];
        if (data) {
            const suitable = data.suitable.sort(() => 0.5 - Math.random()).slice(0, 2);
            const avoid = data.avoid.sort(() => 0.5 - Math.random()).slice(0, 1);
            recommendations.push(...suitable.map(item => `宜👍：${item}`));
            recommendations.push(...avoid.map(item => `忌👎：${item}`));
        }
    } else if (quadrant === 'calm') {
        const data = recommendationsData.calm.general;
        const suitable = data.suitable.sort(() => 0.5 - Math.random()).slice(0, 2);
        const avoid = data.avoid.sort(() => 0.5 - Math.random()).slice(0, 1);
        recommendations.push(...suitable.map(item => `宜👍：${item}`));
        recommendations.push(...avoid.map(item => `忌👎：${item}`));
    }

    return recommendations;
}