import { Libre_Caslon_Text, Poppins } from 'next/font/google';

export const libreCaslonText = Libre_Caslon_Text({
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-libre-caslon-text',
});

export const poppins = Poppins({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-poppins',
});