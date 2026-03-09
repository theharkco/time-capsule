import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Time Capsule - Messages to Your Future Self",
  description: "Seal your thoughts, dreams, and messages for the future. Create beautiful time capsules that unlock on specific dates.",
  keywords: ["time capsule", "future self", "messages", "journal", "memories"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}