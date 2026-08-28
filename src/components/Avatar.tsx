import { forwardRef, ImgHTMLAttributes, useEffect, useState } from 'react';
import type { ImageResponse } from 'src/apis/account/account.type';
import cx from 'src/utils/cx';

export type AvatarResolution = 'original' | 'tiny' | 'small' | 'medium' | 'large';

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    fallbackImage?: string;
    resolutionSize?: AvatarResolution;
    size?: number;
    src?: ImageResponse | null;
}

function resolveAvatarSource(src: ImageResponse | null | undefined, resolutionSize: AvatarResolution) {
    if (!src || typeof src === 'string') return src ?? undefined;

    const fileId = src.fileId ?? src.file_id;
    if (!src.url || !fileId) return undefined;

    // Files service hiện chỉ đảm bảo ảnh original tồn tại ổn định; giữ prop để tương thích khi backend sửa xong.
    const safeResolution = src.resizable ? 'original' : resolutionSize;
    const resolutionUrl = src.resizable ? src.url.replace('{resolution_size}', safeResolution) : src.url;
    return resolutionUrl.replace('{file_id}', fileId);
}

function getInitials(name: string) {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return '?';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
    (
        { alt = '', className, fallbackImage, onError, resolutionSize = 'original', size = 24, src, style, ...props },
        ref,
    ) => {
        const resolvedSource = resolveAvatarSource(src, resolutionSize);
        const [activeSource, setActiveSource] = useState(resolvedSource ?? fallbackImage);
        const avatarSize = `${size / 16}rem`;

        useEffect(() => {
            setActiveSource(resolvedSource ?? fallbackImage);
        }, [fallbackImage, resolvedSource]);

        if (!activeSource) {
            return (
                <span
                    role='img'
                    aria-label={alt}
                    style={{ ...style, width: avatarSize, height: avatarSize }}
                    className={cx(
                        'inline-flex shrink-0 items-center justify-center rounded-full',
                        'bg-primary-main prose-caption1 text-white',
                        className,
                    )}
                >
                    {getInitials(alt)}
                </span>
            );
        }

        return (
            <img
                {...props}
                ref={ref}
                alt={alt}
                src={activeSource}
                style={{ ...style, width: avatarSize, height: avatarSize }}
                className={cx('shrink-0 rounded-full object-cover', className)}
                onError={(event) => {
                    setActiveSource(activeSource === fallbackImage ? undefined : fallbackImage);
                    onError?.(event);
                }}
            />
        );
    },
);

Avatar.displayName = 'Avatar';

export default Avatar;
