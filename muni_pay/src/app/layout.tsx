import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pagamentos Rateio Marque Facil",
  description: "Painel de controle de pagamentos anuais dos municípios da Baixada Fluminense",
  icons: "logo.svg"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      </body>
    </html>
  );
}
