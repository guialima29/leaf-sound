import { libreCaslonText, poppins } from "@/fonts/fonts";
import "./globals.css";

export const metadata = {
  title: "LeafSound",
  description: "A platform for music enthusiasts to connect and share their passion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${libreCaslonText.variable} ${poppins.variable} antialiased`}
      >
          {children}
      </body>
    </html>
  );
}
