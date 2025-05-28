import { Libre_Caslon_Text, Poppins } from 'next/font/google';

export const libreCaslonText = Libre_Caslon_Text({
    subsets: ['sans-serif'],
    variable: '--font-libre-caslon-text',
});

export const poppins = Poppins({
    subsets: ['latin'],
    variable: '--font-poppins',
});