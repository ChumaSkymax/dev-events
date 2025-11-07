export type EventItem = {
  title: string;
  image: string; // path under /public/images
  slug: string;
  location: string;
  date: string; // yyyy-mm-dd
  time: string; // human-readable start time only (no range)
};

export const events: EventItem[] = [
  {
    title: "Next.js Conf 2025",
    image: "/images/event1.png",
    slug: "nextjs-conf-2025",
    location: "San Francisco, CA",
    date: "2025-10-21",
    time: "9:00 AM PDT",
  },
  {
    title: "React Summit US 2025",
    image: "/images/event2.png",
    slug: "react-summit-us-2025",
    location: "New York, NY",
    date: "2025-09-12",
    time: "9:30 AM EDT",
  },
  {
    title: "JSConf EU 2026",
    image: "/images/event3.png",
    slug: "jsconf-eu-2026",
    location: "Berlin, Germany",
    date: "2026-05-18",
    time: "9:00 AM CET",
  },
  {
    title: "KubeCon + CloudNativeCon NA 2025",
    image: "/images/event4.png",
    slug: "kubecon-na-2025",
    location: "Austin, TX",
    date: "2025-11-17",
    time: "9:00 AM CST",
  },
  {
    title: "Google I/O 2026",
    image: "/images/event5.png",
    slug: "google-io-2026",
    location: "Mountain View, CA",
    date: "2026-05-14",
    time: "10:00 AM PDT",
  },
  {
    title: "ETHGlobal San Francisco 2025",
    image: "/images/event6.png",
    slug: "ethglobal-san-francisco-2025",
    location: "San Francisco, CA",
    date: "2025-08-08",
    time: "6:00 PM PDT",
  },
  {
    title: "AWS re:Invent 2025",
    image: "/images/event-full.png",
    slug: "aws-reinvent-2025",
    location: "Las Vegas, NV",
    date: "2025-12-01",
    time: "9:00 AM PST",
  },
];

export default events;
