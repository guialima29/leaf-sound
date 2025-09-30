import { libreCaslonText, poppins } from "@/fonts/fonts";
import { QueryProvider } from "@/providers/query-provider";
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
    	<html lang="pt-br">
      		<body
        	className={`${libreCaslonText.variable} ${poppins.variable} antialiased`}
      		>
				<QueryProvider>
					{children}
				</QueryProvider>
      		</body>
    	</html>
  	);
}
