import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    showCloseButton = true
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 背景遮罩 */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* 弹窗内容 */}
            <Card className="relative w-full max-w-md mx-4 glassmorphism animate-slide-in">
                <CardHeader className="pb-4">
                    <CardTitle className="text-foreground text-lg">{title}</CardTitle>
                    {showCloseButton && (
                        <Button
                            onClick={onClose}
                            variant="ghost"
                            size="sm"
                            className="absolute top-4 right-4 h-8 w-8 p-0"
                        >
                            ✕
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="pt-0">
                    {children}
                </CardContent>
            </Card>
        </div>
    );
};

// 简化的消息弹窗组件
interface MessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
}

export const MessageModal: React.FC<MessageModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    type = 'info'
}) => {
    const getIcon = () => {
        switch (type) {
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'error': return '❌';
            default: return 'ℹ️';
        }
    };

    const getButtonClass = () => {
        switch (type) {
            case 'success': return 'bg-green-500 hover:bg-green-600';
            case 'warning': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'error': return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-primary hover:bg-primary/90';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} showCloseButton={false}>
            <div className="text-center space-y-4">
                <div className="text-4xl">{getIcon()}</div>
                <div className="text-foreground whitespace-pre-line leading-relaxed">
                    {message}
                </div>
                <Button
                    onClick={onClose}
                    className={`w-full ${getButtonClass()} text-white`}
                >
                    确定
                </Button>
            </div>
        </Modal>
    );
}; 