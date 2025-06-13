import { libreCaslonText, poppins } from "@/fonts/fonts";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${libreCaslonText.variable}, ${poppins.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
