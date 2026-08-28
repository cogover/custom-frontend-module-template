/** @type {import('tailwindcss').Config} */

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        colors: {
            brand: 'var(--primary-brand)',
            primary: {
                main: 'var(--primary-main)',
                'light-10': 'var(--primary-main-light-10)',
                'light-20': 'var(--primary-main-light-20)',
                'light-30': 'var(--primary-main-light-30)',
                'light-50': 'var(--primary-main-light-50)',
                'light-60': 'var(--primary-main-light-60)',
                'light-70': 'var(--primary-main-light-70)',
                'light-80': 'var(--primary-main-light-80)',
                'light-90': 'var(--primary-main-light-90)',
                'light-94': 'var(--primary-main-light-94)',
                'light-96': 'var(--primary-main-light-96)',
                'light-98': 'var(--primary-main-light-98)',
                'dark-10': 'var(--primary-main-dark-10)',
                'dark-20': 'var(--primary-main-dark-20)',
                'dark-30': 'var(--primary-main-dark-30)',
                'dark-40': 'var(--primary-main-dark-40)',
                'dark-50': 'var(--primary-main-dark-50)',
                'dark-60': 'var(--primary-main-dark-60)',
                'dark-80': 'var(--primary-main-dark-80)',
                'dark-90': 'var(--primary-main-dark-90)',
            },
            secondary: {
                main: 'var(--secondary-main)',
                'light-20': 'var(--secondary-main-light-20)',
                'light-50': 'var(--secondary-main-light-50)',
                'light-60': 'var(--secondary-main-light-60)',
                'light-70': 'var(--secondary-main-light-70)',
                'light-80': 'var(--secondary-main-light-80)',
                'light-90': 'var(--secondary-main-light-90)',
                'light-95': 'var(--secondary-main-light-95)',

                'dark-10': 'var(--secondary-main-dark-10)',
                'dark-20': 'var(--secondary-main-dark-20)',
                'dark-30': 'var(--secondary-main-dark-30)',
                'dark-40': 'var(--secondary-main-dark-40)',
                'dark-50': 'var(--secondary-main-dark-50)',
            },
            typo: {
                primary: 'var(--typography-primary)',
                secondary: 'var(--typography-secondary)',
                description: 'var(--typography-description)',
            },
            background: {
                default: 'var(--background-default)',
                reverse: 'var(--background-default-reverse)',
            },
            divider: {
                primary: 'var(--divider-primary)',
                secondary: 'var(--divider-secondary)',
            },
            gray: {
                5: 'var(--gray-5)',
                10: 'var(--gray-10)',
                20: 'var(--gray-20)',
                30: 'var(--gray-30)',
                40: 'var(--gray-40)',
                50: 'var(--gray-50)',
                70: 'var(--gray-70)',
                80: 'var(--gray-80)',
                90: 'var(--gray-90)',
                100: 'var(--gray-100)',
            },
            red: {
                50: 'var(--red-50)',
                100: 'var(--red-100)',
                500: 'var(--red-500)',
            },
            deepBlue: {
                50: 'var(--deepBlue-50)',
                100: 'var(--deepBlue-100)',
                400: 'var(--deepBlue-400)',
            },
            purple: {
                50: 'var(--purple-50)',
            },
            deepPurple: {
                50: 'var(--deepPurple-50)',
                100: 'var(--deepPurple-100)',
                400: 'var(--deepPurple-400)',
                500: 'var(--deepPurple-500)',
            },
            orange: {
                50: 'var(--orange-50)',
            },
            'deep-purple': {
                50: 'var(--deep-purple-50)',
                500: 'var(--deep-purple-500)',
            },
            blue: {
                50: 'var(--blue-50)',
                100: 'var(--blue-100)',
                200: 'var(--blue-200)',
                300: 'var(--blue-300)',
                400: 'var(--blue-400)',
                500: 'var(--blue-500)',
                600: 'var(--blue-600)',
                700: 'var(--blue-700)',
                800: 'var(--blue-800)',
                900: 'var(--blue-900)',
            },
            pink: {
                50: 'var(--pink-50)',
                100: 'var(--pink-100)',
                200: 'var(--pink-200)',
                300: 'var(--pink-300)',
                400: 'var(--pink-400)',
                500: 'var(--pink-500)',
                600: 'var(--pink-600)',
                700: 'var(--pink-700)',
                800: 'var(--pink-800)',
                900: 'var(--pink-900)',
            },
            orange2: {
                50: 'var(--orange-2-50)',
                100: 'var(--orange-2-100)',
                200: 'var(--orange-2-200)',
                300: 'var(--orange-2-300)',
                400: 'var(--orange-2-400)',
                500: 'var(--orange-2-500)',
                600: 'var(--orange-2-600)',
                700: 'var(--orange-2-700)',
                800: 'var(--orange-2-800)',
                900: 'var(--orange-2-900)',
            },
            green: {
                50: 'var(--green-50)',
                100: 'var(--green-100)',
                200: 'var(--green-200)',
                300: 'var(--green-300)',
                400: 'var(--green-400)',
                500: 'var(--green-500)',
                600: 'var(--green-600)',
                700: 'var(--green-700)',
                800: 'var(--green-800)',
                900: 'var(--green-900)',
            },
            green2: {
                50: 'var(--green-2-50)',
                100: 'var(--green-2-100)',
                200: 'var(--green-2-200)',
                300: 'var(--green-2-300)',
                400: 'var(--green-2-400)',
                500: 'var(--green-2-500)',
                600: 'var(--green-2-600)',
                700: 'var(--green-2-700)',
                800: 'var(--green-2-800)',
                900: 'var(--green-2-900)',
            },

            success: 'var(--success-main)',
            error: 'var(--error-main)',
            'error-10': 'var(--error-main-10)',
            warning: 'var(--warning-main)',
            info: 'var(--info-main)',
            'status-complete': 'var(--status-complete)',
            'status-in-progress': 'var(--status-in-progress)',
            'status-pending': 'var(--status-pending)',
            'status-rejected': 'var(--status-rejected)',
            'status-bg-complete': 'var(--status-bg-complete)',
            'status-bg-in-progress': 'var(--status-bg-in-progress)',
            'status-bg-pending': 'var(--status-bg-pending)',
            'status-bg-rejected': 'var(--status-bg-rejected)',
            white: 'var(--white)',
            'menu-hover-bg-color': 'var(--menu-hover-bg-color)',
            link: 'var(--primary-link)',
        },
        extend: {
            boxShadow: {
                'table-pinned-left': 'rgba(0, 0, 0, 0.21) 2px 0px 4px -2px',
                'table-pinned-right': 'rgba(0, 0, 0, 0.21) -2px 0px 4px -2px',
                //deprecated
                popover: '0px 9px 40px 0px rgba(0, 0, 0, 0.10)',
                primary: '0px 9px 40px 0px rgba(0, 0, 0, 0.10)',
                secondary: '0px 5px 10px 0px rgba(0, 0, 0, 0.05)',
            },
            typography: {
                h1: {
                    css: {
                        fontSize: '3.5rem',
                        lineHeight: '110%',
                        fontWeight: '700',
                    },
                },
                h2: {
                    css: {
                        fontSize: '3rem',
                        lineHeight: '110%',
                        fontWeight: '700',
                    },
                },
                h3: {
                    css: {
                        fontSize: '2.5rem',
                        lineHeight: '110%',
                        fontWeight: '700',
                    },
                },
                h4: {
                    css: {
                        fontSize: '2rem',
                        lineHeight: '110%',
                        fontWeight: '700',
                    },
                },
                h5: {
                    css: {
                        fontSize: '1.5rem',
                        lineHeight: '110%',
                        fontWeight: '700',
                    },
                },
                h6: {
                    css: {
                        fontSize: '1.25rem',
                        lineHeight: '140%',
                        fontWeight: '700',
                    },
                },
                subtitle1: {
                    css: {
                        fontSize: '1rem',
                        fontWeight: '700',
                    },
                },
                subtitle2: {
                    css: {
                        fontSize: '1rem',
                        fontWeight: '400',
                    },
                },
                body1: {
                    css: {
                        fontSize: '.875rem',
                        fontWeight: '700',
                    },
                },
                body2: {
                    css: {
                        fontSize: '.875rem',
                        fontWeight: '400',
                    },
                },
                caption: {
                    css: {
                        fontSize: '.75rem',
                        fontWeight: '400',
                        lineHeight: '125%',
                    },
                },
                caption1: {
                    css: {
                        fontSize: '.75rem',
                        fontWeight: '600',
                        lineHeight: '125%',
                    },
                },
                caption2: {
                    css: {
                        fontSize: '.75rem',
                        fontWeight: '400',
                        lineHeight: '125%',
                    },
                },
                'text-button': {
                    css: {
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        lineHeight: '142.857%',
                    },
                },
            },
        },
        screens: {
            'better-hover': { raw: '(hover: hover)' },
            desktop: {
                min: '1024px',
            },
            'auth-desktop': {
                min: '1025px',
            },
            'auth-lg-desktop': {
                min: '1281px',
            },
            'auth-tablet': {
                max: '1024px',
            },
            tablet: {
                max: '1024px',
            },
            'small-tablet': {
                max: '820px',
            },
            mobile: {
                max: '560px',
            },
        },
    },

    plugins: [require('@tailwindcss/typography')],
};
