import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Dashbard Pagamentos",
  description: "Dashboard do sistema de pagamentos dos municípios da Baixada Fluminense",
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
