import { _mock } from './_mock';

export const _ID = [...(Array(40) as number[])].map((_, index) => `e99f09a7-dd88-49d5-b1c8-1daf80c2d7b${index + 1}`);

// ----------------------------------------------------------------------

export const _BOOLEANS = [
    true,
    true,
    true,
    false,
    false,
    true,
    false,
    false,
    false,
    false,
    true,
    true,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    true,
];
// ----------------------------------------------------------------------

export const _EMAILS = [
    'nannie_abernathy70@yahoo.com',
    'ashlynn_ohara62@gmail.com',
    'milo.farrell@hotmail.com',
    'violet.ratke86@yahoo.com',
    'letha_lubowitz24@yahoo.com',
    'aditya_greenfelder31@gmail.com',
    'lenna_bergnaum27@hotmail.com',
    'luella.ryan33@gmail.com',
    'joana.simonis84@gmail.com',
    'marjolaine_white94@gmail.com',
    'vergie_block82@hotmail.com',
    'vito.hudson@hotmail.com',
    'tyrel_greenholt@gmail.com',
    'dwight.block85@yahoo.com',
    'mireya13@hotmail.com',
    'dasia_jenkins@hotmail.com',
    'benny89@yahoo.com',
    'dawn.goyette@gmail.com',
    'zella_hickle4@yahoo.com',
    'avery43@hotmail.com',
    'olen_legros@gmail.com',
    'jimmie.gerhold73@hotmail.com',
    'genevieve.powlowski@hotmail.com',
    'louie.kuphal39@gmail.com',
];

export const _FULL_NAMES = [
    'Jayvion Simon',
    'Lucian Obrien',
    'Deja Brady',
    'Harrison Stein',
    'Reece Chung',
    'Lainey Davidson',
    'Cristopher Cardenas',
    'Melanie Noble',
    'Chase Day',
    'Shawn Manning',
    'Soren Durham',
    'Cortez Herring',
    'Brycen Jimenez',
    'Giana Brandt',
    'Aspen Schmitt',
    'Colten Aguilar',
    'Angelique Morse',
    'Selina Boyer',
    'Lawson Bass',
    'Ariana Lang',
    'Amiah Pruitt',
    'Harold Mcgrath',
    'Esperanza Mcintyre',
    'Mireya Conner',
];

export const _FIRST_NAMES = [
    'John',
    'Jane',
    'Robert',
    'Michael',
    'William',
    'David',
    'Richard',
    'Joseph',
    'Thomas',
    'Charles',
    'Daniel',
    'Matthew',
    'Anthony',
    'Donald',
    'Mark',
    'Paul',
    'Steven',
    'Andrew',
    'Kenneth',
    'Joshua',
    'George',
    'Kevin',
    'Brian',
    'Edward',
];

export const _LAST_NAMES = [
    'Smith',
    'Johnson',
    'Williams',
    'Jones',
    'Brown',
    'Davis',
    'Miller',
    'Wilson',
    'Moore',
    'Taylor',
    'Anderson',
    'Thomas',
    'Jackson',
    'White',
    'Harris',
    'Martin',
    'Thompson',
    'Garcia',
    'Martinez',
    'Robinson',
    'Clark',
    'Rodriguez',
    'Lewis',
    'Lee',
];

// ----------------------------------------------------------------------
export const _API_MESSAGES_DEFAULT = {
    success: 'Success',
    error: 'Error',
};

// ----------------------------------------------------------------------

export const __PHONE_NUMBER = [
    '1234567890',
    '2345678901',
    '3456789012',
    '4567890123',
    '5678901234',
    '6789012345',
    '7890123456',
    '8901234567',
];

export const _PASSWORDS = {
    valid: 'Password123!',
    lowercase: 'password123!',
    uppercase: 'PASSWORD123!',
    number: '12345678',
    special: 'Password!',
    short: 'Pass1!',
    empty: '',
    invalid: 'Invalid123!',
};

// ----------------------------------------------------------------------

export const SENTENCES = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Lorem ipsum dolor sit amet',
    'consectetur adipiscing elit',
    'Sed do eiusmod tempor incididunt ut labore et',
    'dolore magna aliqua',
];

// ----------------------------------------------------------------------

export const IMAGES = ['https://images.unsplash.com/photo-1551963831-b3b1ca40c98e'];

// ----------------------------------------------------------------------

export const _PERSONNEL = [
    {
        id: '1',
        fullName: 'John Doe',
        avatar: 'https://example.com/avatar.jpg',
        accountId: '1',
        addresses: ['123 Main St', '456 Elm St'],
        created: 1622549767,
        dateFormat: 'MM/DD/YYYY',
        emails: ['johndoe@example.com', 'john.doe@workplace.com'],
        enable2fa: 1,
        firstName: 'John',
        language: 'en-US',
        numberFormat: '1,234.56',
        objectType: 'Personnel',
        phoneNumbers: ['+1234567890', '+0987654321'],
        receciveMarketing: 1,
        registerIp: '192.168.1.1',
        status: 'active',
        timeFormat: 'HH:mm:ss',
        timezone: 'America/New_York',
        updated: 1622549867,
        workspaceId: 'abcde',
        setting: {
            avatarBg: '#ffffff',
            avatarColor: '#000000',
        },
        lastName: 'Doe',
    },
    {
        lastName: 'Doe',
        id: '2',
        fullName: 'Jane Doe',
        avatar: 'https://example.com/avatar.jpg',
        accountId: '2',
        addresses: ['123 Main St', '456 Elm St'],
        created: 1622549767,
        dateFormat: 'MM/DD/YYYY',
        emails: ['johndoe@example.com', 'john.doe@workplace.com'],
        enable2fa: 1,
        firstName: 'John',
        language: 'en-US',
        numberFormat: '1,234.56',
        objectType: 'Personnel',
        phoneNumbers: ['+1234567890', '+0987654321'],
        receciveMarketing: 1,
        registerIp: '192.168.1.1',
        status: 'active',
        timeFormat: 'HH:mm:ss',
        timezone: 'America/New_York',
        updated: 1622549867,
        workspaceId: 'abcde',
        setting: {
            avatarBg: '#ffffff',
            avatarColor: '#000000',
        },
    },
];
