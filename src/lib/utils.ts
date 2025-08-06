import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import React from "react"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// 检测文本是否包含中文字符
export function containsChinese(text: string): boolean {
    return /[\u4e00-\u9fff]/.test(text);
}

// 检测文本是否包含英文字符
export function containsEnglish(text: string): boolean {
    return /[a-zA-Z]/.test(text);
}

// 检测文本是否包含数字
export function containsNumbers(text: string): boolean {
    return /\d/.test(text);
}

// 获取混合文本的字体类名
export function getMixedFontClass(text: string): string {
    const hasChinese = containsChinese(text);
    const hasEnglish = containsEnglish(text);
    const hasNumbers = containsNumbers(text);

    if (hasChinese && (hasEnglish || hasNumbers)) {
        // 中英文混合或中文数字混合，使用思源宋体作为主字体
        return 'font-mixed';
    } else if (hasChinese) {
        // 纯中文，使用思源宋体
        return 'font-chinese';
    } else if (hasEnglish || hasNumbers) {
        // 纯英文或数字，使用 Times New Roman
        return 'font-english';
    } else {
        // 其他情况，使用默认字体
        return 'font-default';
    }
}

// 应用字体样式的工具函数
export function applyFontStyles(element: HTMLElement): void {
    const text = element.textContent || '';
    const fontClass = getMixedFontClass(text);
    element.className = element.className.replace(/font-(mixed|chinese|english|default)/g, '') + ' ' + fontClass;
}

// React Hook 用于自动应用字体样式
export function useFontClass(text: string): string {
    return getMixedFontClass(text);
}

// 自动应用字体样式的 React Hook
export function useAutoFont(ref: React.RefObject<HTMLElement>, text: string) {
    React.useEffect(() => {
        if (ref.current) {
            applyFontStyles(ref.current);
        }
    }, [ref, text]);
} 