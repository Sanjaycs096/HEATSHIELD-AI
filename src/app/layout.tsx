import "./globals.css";

export const metadata = {
  title: "HeatShield AI",
  description: "Plan safer outdoor activities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className="antialiased bg-background text-foreground bg-gray-50">
        {children}
      </body>
    </html>
  );
}
