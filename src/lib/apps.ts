export type Platform = "macOS" | "iPhone";

export type AppStatus = "available" | "coming-soon";

export const STATUS_LABEL: Record<AppStatus, string> = {
  available: "Available now",
  "coming-soon": "Coming soon",
};

export interface AppVideo {
  /** Path without extension: expects `<src>.mp4`, `<src>.webm` and `<src>-poster.webp` in /public */
  src: string;
  title: string;
  caption?: string;
  /** Intrinsic ratio as "w / h", so the frame reserves space before the video loads */
  aspect: string;
}

export interface AppFeature {
  title: string;
  body?: string;
  /** Screenshot for the feature showcase. Lives in /public/apps/<slug>/features/. */
  image?: { src: string; alt: string; aspect: string };
}

export interface App {
  slug: string;
  name: string;
  /** One-liner shown on cards and as the page subtitle */
  tagline: string;
  /** Short paragraph for the app page */
  description: string;
  kind: string;
  platforms: Platform[];
  /** Minimum OS, shown next to the download button */
  requires: string;
  status: AppStatus;
  accent: string;
  glow: [string, string];
  /** When any feature has an image, the page shows the scroll showcase; otherwise a numbered list. */
  features: AppFeature[];
  tech: string[];
  pricing: {
    free: string;
    pro?: { price?: string; note?: string; perks: string[] };
  };
  links: {
    /** DMG / store link. Until it's set, the page shows a "download soon" state instead of a button. */
    download?: string;
    purchase?: string;
  };
  /**
   * The real app icon lives at /public/apps/<slug>.png (1024px, exported from the
   * Xcode asset catalog). Set this when the artwork fills the whole square
   * instead of sitting inside macOS's standard icon padding, so it's scaled to match.
   */
  iconFullBleed?: boolean;
  /** The app page's demo video. Without one, the page shows a "demo on the way" frame. */
  video?: AppVideo;
}

/**
 * Every app the lab ships. Add new entries here: the homepage shelf, the
 * /apps index, and each /apps/[slug] page are all driven off this array.
 */
export const apps: App[] = [
  {
    slug: "snapback",
    name: "Snapback",
    tagline:
      "Stop dragging windows around like it's 2009. One shortcut snaps them into place. One more brings your whole desk back.",
    description:
      "macOS still thinks window management means a green button. Snapback lives in your menu bar and fixes that: halves, thirds, quarters and almost-maximize on a shortcut, drag-to-snap when the mouse is closer, and whole workspaces, every app, every window, every display, saved and restored in one keystroke.",
    kind: "Window manager",
    platforms: ["macOS"],
    requires: "macOS 12.4+",
    status: "available",
    accent: "#0b63e5",
    glow: ["#0b63e5", "#4f8dff"],
    features: [
      {
        title: "Every layout, one shortcut away",
        body: "Halves, thirds, quarters, two-thirds, fullscreen, almost-maximize. Pick one, press the keys, done.",
        image: { src: "/apps/snapback/features/layouts.webp", alt: "Snapback's predefined window layouts", aspect: "1732 / 1154" },
      },
      {
        title: "Your shortcuts, your rules",
        body: "Every snap gets a global shortcut, and every shortcut can be rebound. Bring your muscle memory.",
        image: { src: "/apps/snapback/features/snaps.webp", alt: "Snapback's Snaps settings with a shortcut for each layout", aspect: "1732 / 1154" },
      },
      {
        title: "Drag to snap",
        body: "Hold ⌘, fling a window at an edge, and watch it land exactly where the preview said it would.",
        image: { src: "/apps/snapback/features/drag-snap.webp", alt: "A window being dragged to snap with a live preview", aspect: "1724 / 1150" },
      },
      {
        title: "More screens, less chaos",
        body: "Built for multi-monitor desks. Windows move between displays like they know where they're going.",
        image: { src: "/apps/snapback/features/save.webp", alt: "A workspace preview spanning the main display and an external monitor", aspect: "1726 / 1150" },
      },
      {
        title: "Save the whole desk",
        body: "Positions, apps, monitors, even fullscreen state. Save it once, bring it all back with one shortcut.",
        image: { src: "/apps/snapback/features/workspaces.webp", alt: "Saved Snapback workspaces", aspect: "1732 / 1154" },
      },
      {
        title: "Right there in the menu bar",
        body: "Every snap one click away, with its shortcut printed next to it for when you're ready to go keyboard-only.",
        image: { src: "/apps/snapback/features/menu.webp", alt: "Snapback's menu bar menu listing snaps and shortcuts", aspect: "792 / 476" },
      },
      {
        title: "No mystery moves",
        body: "Small, quiet toasts tell you what just happened to your windows and workspaces.",
      },
    ],
    tech: ["Swift", "SwiftUI", "Accessibility API", "Sparkle"],
    video: {
      src: "/apps/snapback/restore",
      title: "Save once. Restore everything.",
      caption: "One shortcut and every app, window and display snaps back to exactly where it was.",
      aspect: "3024 / 1964",
    },
    pricing: {
      free: "Free to download",
      pro: {
        price: "$9.99",
        note: "one-time",
        perks: [
          "Command palette for every window action",
          "Spaces and custom layouts",
          "Adaptive resize: the rest of the windows follow",
          "Themes, including Catppuccin, Dracula and Nord",
        ],
      },
    },
    links: {},
  },
  {
    slug: "peggo",
    name: "Peggo",
    tagline:
      "A clipboard with an actual memory. Everything you copy: text, images, video, audio, one hotkey away.",
    description:
      "macOS remembers exactly one thing you copied. Peggo remembers all of it. It sits in your menu bar, keeps your whole clipboard history, and pastes any of it straight back into whatever you're working on, from a hotkey, in a second, without leaving the keyboard.",
    kind: "Clipboard manager",
    platforms: ["macOS"],
    requires: "macOS 14.6+",
    status: "coming-soon",
    accent: "#0f9d8a",
    glow: ["#0f9d8a", "#0b63e5"],
    features: [
      { title: "Your whole clipboard, one hotkey", body: "Hit the shortcut and everything you've copied is right there. Find it, pick it, paste it." },
      { title: "Not just text", body: "Images, video and audio clips get remembered too. Yes, even that screenshot from an hour ago." },
      { title: "Actually pastes", body: "Pick a clip and it lands straight in the app you're using. No copy-switch-⌘V dance." },
      { title: "Cleans up after itself", body: "An automatic retention sweep keeps storage lean. No settings safari required." },
      { title: "Stays on your Mac", body: "A local database, on your machine. Nothing you copy goes anywhere else." },
    ],
    tech: ["Swift", "SwiftUI", "SQLite", "Accessibility API"],
    pricing: { free: "Free to download" },
    links: {},
    iconFullBleed: true,
  },
  {
    slug: "boomark",
    name: "Boomark",
    tagline:
      "Browser bookmarks are where links go to die. Boomark puts yours behind a hotkey: save, tag and find them without touching the mouse.",
    description:
      "Boomark is a bookmark manager that acts like a launcher. Hit a hotkey, paste a URL or grab the tab you're already on, tag it, and get back to work. When you need it again, it's three keystrokes away, on your Mac and on your iPhone.",
    kind: "Bookmark manager",
    platforms: ["macOS", "iPhone"],
    requires: "macOS 14.6+",
    status: "coming-soon",
    accent: "#e5890b",
    glow: ["#e5890b", "#0b63e5"],
    features: [
      { title: "A palette, not a folder graveyard", body: "Search, add, open, pin, tag and delete, all from one keyboard-first palette." },
      { title: "Grab the tab you're on", body: "One shortcut saves the frontmost tab from Safari, Chrome, Arc, Brave or Edge, free, no Pro required. No window switching." },
      { title: "Bring your old bookmarks", body: "One-time import from Safari and Chromium browsers. Your folders become tags." },
      { title: "Tags that don't multiply", body: "Case-insensitive with autocomplete, so “Work” and “work” never become two tags." },
      { title: "⌘1–⌘9 quick-open", body: "Your top results, one keystroke each. Faster than typing the URL." },
      { title: "Dress it up", body: "Preset themes with vibrancy, in light and dark." },
    ],
    tech: ["Swift", "SwiftUI", "CloudKit", "Sparkle", "Expo"],
    pricing: {
      free: "Free to download, browser extension included",
      pro: {
        note: "one-time license",
        perks: ["iCloud sync with Boomark on iPhone", "Every theme beyond Default"],
      },
    },
    links: {},
    iconFullBleed: true,
  },
];

/** Short price label for cards: the Pro price when one exists, else "Free". */
export function getPriceLabel(app: App): string {
  if (app.pricing.pro?.price) return `${app.pricing.pro.price} once`;
  if (app.pricing.pro) return "One-time";
  return "Free";
}

export function getApp(slug: string): App | undefined {
  return apps.find((a) => a.slug === slug);
}

export function getNextApp(slug: string): App {
  const idx = apps.findIndex((a) => a.slug === slug);
  return apps[(idx + 1) % apps.length];
}
