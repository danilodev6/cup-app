import localFont from "next/font/local";

export const geom = localFont({
  src: [
    {
      path: "/../fonts/geom/Geom-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "/../fonts/geom/Geom-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "/../fonts/geom/Geom-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "/../fonts/geom/Geom-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "/../fonts/geom/Geom-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-geom",
});
