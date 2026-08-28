import { ThemeType } from 'src/theme/theme.type';

export interface ImageFileResponse {
    file_id?: string;
    fileId?: string;
    file_ext?: string;
    fileExt?: string;
    resizable: boolean;
    url: string;
}

export type ImageResponse = string | ImageFileResponse;

export interface AccountInfoResponse {
    dateFormat: 1 | 2 | 3 | 4;
    timeFormat: 1 | 2;
    numberFormat: 1 | 2 | null;
    id: string;
    email: string;
    status: number;
    isVerified: boolean;
    firstName: string;
    lastName: string | null;
    phoneNumber: string | null;
    phoneCountryCode: string | null;
    avatar: ImageResponse | null;
    language: string;
    timezone: string;
    address: string | null;
    birthday: number | null;
    passwordExisted: boolean;
    setting?: AccountSetting;
    nameFormat?: string;
    fullName: string;
}

export interface AccountSetting {
    theme?: ThemeType;
    brandColor?: string;
}
