import { QueryProvider } from "@/providers/query-provider";
import "@/app/editor/editor-styles.css"
import "./globals.css";
import { libreCaslonText, poppins } from "@/fonts/fonts";

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
		<html lang="pt-br" className={`${libreCaslonText.variable} ${poppins.variable}`} suppressHydrationWarning>
			<body suppressHydrationWarning
				className="antialiased"
			>
				<QueryProvider>
					{children}
				</QueryProvider>
			</body>
		</html>
	);
}
