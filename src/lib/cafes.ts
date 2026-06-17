export type Cafe = {
  id: string;
  name: string;
  neighborhood: "Indiranagar" | "Koramangala" | "Jayanagar" | "MG Road";
  blurb: string;
  image: string;
  tags: string[];
  wifi: boolean;
  open: boolean;
  hours: string;
};

export const cafes: Cafe[] = [
  {
    id: "third-wave-loft",
    name: "Third Wave Loft",
    neighborhood: "Indiranagar",
    blurb: "Sun-drenched corner spot pouring single-origin filter and house-baked sourdough.",
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&q=80",
    tags: ["Specialty Coffee", "Laptop Friendly", "Bakery"],
    wifi: true,
    open: true,
    hours: "8am – 10pm",
  },
  {
    id: "quiet-hours",
    name: "Quiet Hours",
    neighborhood: "Koramangala",
    blurb: "A bookshelf-lined nook built for deep work and slow pour-overs.",
    image: "https://images.unsplash.com/photo-1743389412243-7dbfdf6c48dd?w=1200&q=80",
    tags: ["Laptop Friendly", "Fast WiFi"],
    wifi: true,
    open: true,
    hours: "9am – 9pm",
  },
  {
    id: "petal-and-bean",
    name: "Petal & Bean",
    neighborhood: "Indiranagar",
    blurb: "Plant-filled courtyard cafe known for cardamom lattes and laminated pastries.",
    image: "https://images.unsplash.com/photo-1613274554329-70f997f5789f?w=1200&q=80",
    tags: ["Specialty Coffee", "Bakery"],
    wifi: false,
    open: true,
    hours: "7am – 8pm",
  },
  {
    id: "morning-ledger",
    name: "Morning Ledger",
    neighborhood: "Koramangala",
    blurb: "Open kitchen, communal tables, and a rotating guest roaster every month.",
    image: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=1200&q=80",
    tags: ["Laptop Friendly", "Fast WiFi", "Specialty Coffee"],
    wifi: true,
    open: true,
    hours: "8am – 11pm",
  },
  {
    id: "slow-roast",
    name: "Slow Roast Co.",
    neighborhood: "Jayanagar",
    blurb: "Tiny neighborhood roaster pulling shots from estate beans grown in Chikmagalur.",
    image: "https://images.unsplash.com/photo-1495862433577-132cf20d7902?w=1200&q=80",
    tags: ["Specialty Coffee", "Local Roaster"],
    wifi: false,
    open: false,
    hours: "9am – 6pm",
  },
  {
    id: "field-notes",
    name: "Field Notes Cafe",
    neighborhood: "MG Road",
    blurb: "Editorial-style coffee bar with mid-century furniture and a serious WiFi setup.",
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&q=80",
    tags: ["Laptop Friendly", "Fast WiFi"],
    wifi: true,
    open: true,
    hours: "8am – 10pm",
  },
];

export const neighborhoods = ["All neighborhoods", "Indiranagar", "Koramangala", "Jayanagar", "MG Road"] as const;
