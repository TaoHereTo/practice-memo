import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MessageModal } from '../ui/modal';
import type { EMARecord } from '../../types';
import { activityOptions, socialContextOptions } from '../../data/emaData';
import { storageService } from '../../services/storage';

interface EMACaptureProps {
    onRecordAdded?: () => void;
}

export const EMACapture: React.FC<EMACaptureProps> = ({ onRecordAdded }) => {
    // 步骤状态
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    // 情绪捕捉状态
    const [moodValence, setMoodValence] = useState(0); // -1 到 1
    const [moodArousal, setMoodArousal] = useState(0); // -1 到 1
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
    const [selectedSocialContext, setSelectedSocialContext] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 弹窗状态
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        type: 'info' as 'info' | 'success' | 'warning' | 'error'
    });

    // 今日EMA记录
    const [todayRecords, setTodayRecords] = useState<EMARecord[]>([]);

    // 加载今日记录
    useEffect(() => {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        const endOfDay = startOfDay + 24 * 60 * 60 * 1000;
        const records = storageService.getEMARecordsByTimeRange(startOfDay, endOfDay);
        setTodayRecords(records);
    }, []);

    // 处理步骤完成
    const handleStepComplete = (step: number) => {
        if (!completedSteps.includes(step)) {
            setCompletedSteps(prev => [...prev, step]);
        }
        if (step < 3) {
            setCurrentStep(step + 1);
            // 自动滚动到下一个步骤
            setTimeout(() => {
                const nextStepElement = document.querySelector(`[data-step="${step + 1}"]`);
                if (nextStepElement) {
                    nextStepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    };

    // 处理活动选择
    const handleActivityToggle = (activityKey: string) => {
        setSelectedActivities(prev =>
            prev.includes(activityKey)
                ? prev.filter(key => key !== activityKey)
                : [...prev, activityKey]
        );
    };

    // 检查步骤是否可以完成
    const canCompleteStep = (step: number) => {
        switch (step) {
            case 1: return moodValence !== 0 || moodArousal !== 0;
            case 2: return selectedActivities.length > 0;
            case 3: return selectedSocialContext !== '';
            default: return false;
        }
    };

    // 提交EMA记录
    const handleSubmitEMA = async () => {
        if (!selectedSocialContext) {
            setModalConfig({
                title: '提示',
                message: '请选择社交环境',
                type: 'warning'
            });
            setShowModal(true);
            return;
        }

        setIsSubmitting(true);

        const record: EMARecord = {
            id: `ema_${Date.now()}`,
            timestamp: Date.now(),
            moodValence,
            moodArousal,
            activities: selectedActivities,
            socialContext: selectedSocialContext
        };

        storageService.saveEMARecord(record);

        // 生成简单的情绪分析
        const moodAnalysis = generateMoodAnalysis(record);

        // 重置表单
        setMoodValence(0);
        setMoodArousal(0);
        setSelectedActivities([]);
        setSelectedSocialContext('');

        // 重置步骤状态
        setCurrentStep(1);
        setCompletedSteps([]);

        // 更新今日记录
        setTodayRecords(prev => [record, ...prev]);

        setIsSubmitting(false);
        onRecordAdded?.();

        // 显示分析结果
        showMoodAnalysis(moodAnalysis);
    };

    // 生成情绪分析
    const generateMoodAnalysis = (record: EMARecord) => {
        const valence = record.moodValence;
        const arousal = record.moodArousal;

        let moodState = '';
        let description = '';
        let suggestion = '';

        // 根据愉快度和激动度判断情绪状态
        if (valence >= 0.5 && arousal >= 0.5) {
            moodState = '兴奋愉悦';
            description = '你此刻处于高度积极的状态，既有愉快的感受，又充满活力。';
            suggestion = '这是一个很好的状态，适合进行创造性工作或社交活动。';
        } else if (valence >= 0.5 && arousal < 0.5) {
            moodState = '平静满足';
            description = '你感到平静和满足，内心平和。';
            suggestion = '适合进行需要专注的任务，或者享受当下的宁静。';
        } else if (valence < 0.5 && arousal >= 0.5) {
            moodState = '紧张焦虑';
            description = '你感到紧张或焦虑，内心不安。';
            suggestion = '建议深呼吸，或者暂时离开当前环境，给自己一些空间。';
        } else {
            moodState = '低落疲惫';
            description = '你感到低落或疲惫，缺乏能量。';
            suggestion = '建议休息一下，或者做一些能让你感到舒适的事情。';
        }

        return {
            moodState,
            description,
            suggestion,
            valence,
            arousal,
            activities: record.activities,
            socialContext: record.socialContext
        };
    };

    // 显示情绪分析
    const showMoodAnalysis = (analysis: any) => {
        const message = `📊 情绪分析报告

当前状态：${analysis.moodState}
${analysis.description}

💡 建议：${analysis.suggestion}

📈 详细数据：
• 愉快度：${analysis.valence.toFixed(1)}
• 激动度：${analysis.arousal.toFixed(1)}
• 活动：${analysis.activities.map((a: string) => activityOptions.find(opt => opt.key === a)?.label).join('、')}
• 社交环境：${socialContextOptions.find(c => c.key === analysis.socialContext)?.label}

💡 小贴士：你可以在"数据洞察"页面查看更详细的分析和趋势。`;

        setModalConfig({
            title: '情绪分析报告',
            message,
            type: 'success'
        });
        setShowModal(true);
    };

    // 情感网格点击处理
    const handleAffectGridClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        // 转换为 -1 到 1 的范围
        const valence = (x - 0.5) * 2; // X轴：不愉快(-1) 到 愉快(1)
        const arousal = (0.5 - y) * 2;  // Y轴：平静(-1) 到 激动(1)

        setMoodValence(Math.max(-1, Math.min(1, valence)));
        setMoodArousal(Math.max(-1, Math.min(1, arousal)));

        // 添加点击动效
        const point = event.currentTarget.querySelector('.mood-point');
        if (point) {
            point.classList.add('affect-grid-point');
            setTimeout(() => {
                point.classList.remove('affect-grid-point');
            }, 300);
        }
    };

    return (
        <>
            <div className="space-y-6 pb-8">
                {/* 页面标题 */}
                <div className="text-center mb-6">
                    <h2 className="text-lg font-semibold text-foreground">实时情绪记录</h2>
                    <p className="text-sm text-muted mt-1">分步记录此刻的心情状态</p>
                </div>

                {/* 步骤指示器 */}
                <div className="flex justify-center space-x-4 mb-6">
                    {[1, 2, 3].map((step) => (
                        <div
                            key={step}
                            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 ${completedSteps.includes(step)
                                ? 'bg-green-500 text-white'
                                : currentStep === step
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-gray-200 text-gray-500'
                                }`}
                        >
                            {completedSteps.includes(step) ? '✓' : step}
                        </div>
                    ))}
                </div>

                {/* 步骤 1: 情感网格 */}
                <div className="card-container">
                    <Card data-step="1" className={`glassmorphism transition-all duration-300 ${currentStep === 1 ? 'opacity-100' : completedSteps.includes(1) ? 'opacity-80' : 'opacity-50'}`}>
                        <CardHeader className="cursor-pointer" onClick={() => setCurrentStep(1)}>
                            <CardTitle className="text-foreground text-base flex items-center justify-between">
                                <span>1. 此刻的心情如何？</span>
                                {completedSteps.includes(1) && <span className="text-green-500">✓</span>}
                            </CardTitle>
                        </CardHeader>
                        {currentStep === 1 && (
                            <CardContent>
                                <div className="text-center mb-4">
                                    <p className="text-sm text-muted">点击下方网格来表达你的情绪</p>
                                </div>

                                <div className="relative mx-4 my-8">
                                    {/* 情感网格 */}
                                    <div
                                        className="w-full h-48 border-2 border-gray-300 rounded-xl cursor-crosshair relative bg-gradient-to-br from-red-100 via-gray-100 to-green-100"
                                        onClick={handleAffectGridClick}
                                    >
                                        {/* 轴标签 - 减少距离 */}
                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-muted font-medium">
                                            激动
                                        </div>
                                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-muted font-medium">
                                            平静
                                        </div>
                                        <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 -rotate-90 text-xs text-muted font-medium">
                                            不愉快
                                        </div>
                                        <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 rotate-90 text-xs text-muted font-medium">
                                            愉快
                                        </div>

                                        {/* 中心线 */}
                                        <div className="absolute top-0 left-1/2 w-px h-full bg-gray-400 opacity-50" />
                                        <div className="absolute left-0 top-1/2 w-full h-px bg-gray-400 opacity-50" />

                                        {/* 当前选择点 */}
                                        <div
                                            className="absolute w-3 h-3 bg-primary rounded-full border border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out mood-point"
                                            style={{
                                                left: `${(moodValence + 1) * 50}%`,
                                                top: `${(1 - moodArousal) * 50}%`
                                            }}
                                        />
                                    </div>

                                    {/* 当前值显示 - 调整位置，避免覆盖标签 */}
                                    <div className="mt-12 text-center text-xs text-muted">
                                        愉快度: {moodValence.toFixed(1)} | 激动度: {moodArousal.toFixed(1)}
                                    </div>
                                </div>

                                {currentStep === 1 && (
                                    <div className="flex justify-center mt-6">
                                        <Button
                                            onClick={() => handleStepComplete(1)}
                                            disabled={!canCompleteStep(1)}
                                            className="custom-button"
                                            size="lg"
                                        >
                                            下一步
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        )}
                    </Card>

                    {/* 步骤 2: 当前活动 */}
                    <Card data-step="2" className={`glassmorphism transition-all duration-300 ${currentStep === 2 ? 'opacity-100' : completedSteps.includes(2) ? 'opacity-80' : 'opacity-50'}`}>
                        <CardHeader className="cursor-pointer" onClick={() => completedSteps.includes(1) && setCurrentStep(2)}>
                            <CardTitle className="text-foreground text-base flex items-center justify-between">
                                <span>2. 你在做什么？</span>
                                {completedSteps.includes(2) && <span className="text-green-500">✓</span>}
                            </CardTitle>
                        </CardHeader>
                        {currentStep === 2 && (
                            <CardContent>
                                <div className="grid grid-cols-2 gap-3">
                                    {activityOptions.map((activity) => (
                                        <button
                                            key={activity.key}
                                            onClick={() => handleActivityToggle(activity.key)}
                                            className={`p-3 rounded-lg border text-left transition-all duration-200 ease-in-out text-sm transform hover:scale-105 hover:-translate-y-0.5 ${selectedActivities.includes(activity.key)
                                                ? 'border-primary bg-primary/10 text-foreground scale-105 shadow-md'
                                                : 'border-gray-300 hover:border-primary/50 text-foreground hover:shadow-sm'
                                                }`}
                                        >
                                            <div className="text-lg mb-1">{activity.icon}</div>
                                            <div className="font-medium">{activity.label}</div>
                                        </button>
                                    ))}
                                </div>

                                {currentStep === 2 && (
                                    <div className="flex justify-center mt-6">
                                        <Button
                                            onClick={() => handleStepComplete(2)}
                                            disabled={!canCompleteStep(2)}
                                            className="custom-button"
                                            size="lg"
                                        >
                                            下一步
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        )}
                    </Card>

                    {/* 步骤 3: 社交环境 */}
                    <Card data-step="3" className={`glassmorphism transition-all duration-300 ${currentStep === 3 ? 'opacity-100' : completedSteps.includes(3) ? 'opacity-80' : 'opacity-50'}`}>
                        <CardHeader className="cursor-pointer" onClick={() => completedSteps.includes(2) && setCurrentStep(3)}>
                            <CardTitle className="text-foreground text-base flex items-center justify-between">
                                <span>3. 你和谁在一起？</span>
                                {completedSteps.includes(3) && <span className="text-green-500">✓</span>}
                            </CardTitle>
                        </CardHeader>
                        {currentStep === 3 && (
                            <CardContent>
                                <div className="space-y-3">
                                    {socialContextOptions.map((context) => (
                                        <button
                                            key={context.key}
                                            onClick={() => setSelectedSocialContext(context.key)}
                                            className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ease-in-out transform hover:scale-102 hover:-translate-y-0.5 ${selectedSocialContext === context.key
                                                ? 'border-primary bg-primary/10 text-foreground scale-102 shadow-md'
                                                : 'border-gray-300 hover:border-primary/50 text-foreground hover:shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span className="text-lg">{context.icon}</span>
                                                <span className="font-medium text-sm">{context.label}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {currentStep === 3 && (
                                    <div className="flex justify-center mt-6">
                                        <Button
                                            onClick={handleSubmitEMA}
                                            disabled={!canCompleteStep(3) || isSubmitting}
                                            className="custom-button"
                                            size="lg"
                                        >
                                            {isSubmitting ? '保存中...' : '完成记录'}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        )}
                    </Card>

                    {/* 今日记录 */}
                    {todayRecords.length > 0 && (
                        <Card className="glassmorphism">
                            <CardHeader>
                                <CardTitle className="text-foreground text-base">今日记录 ({todayRecords.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {todayRecords.slice(0, 3).map((record) => (
                                        <div key={record.id} className="p-3 bg-white/50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm">
                                                    <div className="font-medium text-foreground">
                                                        {new Date(record.timestamp).toLocaleTimeString('zh-CN', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                    <div className="text-muted text-xs">
                                                        愉快度: {record.moodValence.toFixed(1)} |
                                                        激动度: {record.moodArousal.toFixed(1)}
                                                    </div>
                                                </div>
                                                <div className="text-right text-xs text-muted">
                                                    <div>{record.activities.length} 个活动</div>
                                                    <div>{socialContextOptions.find(c => c.key === record.socialContext)?.label}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* 自定义弹窗 */}
            <MessageModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
            />
        </>
    );
};