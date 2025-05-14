import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "./globals.css";
import HeaderClient from "../components/headerClient"

export const metadata = {
  title: "Mi App",
  description: "Empresa Ficticia",
};

export default  function RootLayout({ children }) {
  // const cookieStore = cookies();
  // const session = cookieStore.get("access_token");

  // if (!session) {
  //   redirect("/");
  // }

  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        <HeaderClient />
        <main>{children}</main>
      </body>
    </html>
  );
}
