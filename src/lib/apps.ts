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
    /** Browser extension store listings. Rendered as small links when any are set. */
    extensions?: { chrome?: string; firefox?: string; safari?: string };
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
        image: { src: "/apps/snapback/features/layouts.webp", alt: "Snapback's Layouts settings, a grid of preset window layouts", aspect: "1732 / 1154" },
      },
      {
        title: "Your shortcuts, your rules",
        body: "Every snap gets a global shortcut, and every shortcut can be rebound. Bring your muscle memory.",
        image: { src: "/apps/snapback/features/snaps.webp", alt: "Snapback's Snaps settings with a rebindable shortcut beside every snap", aspect: "1732 / 1154" },
      },
      {
        title: "Drag to snap",
        body: "Hold ⌘, fling a window at an edge, and watch it land exactly where the preview said it would.",
        image: { src: "/apps/snapback/features/drag-snap.webp", alt: "A window being dragged toward a screen corner with the snap target shown", aspect: "1732 / 1154" },
      },
      {
        title: "More screens, less chaos",
        body: "Built for multi-monitor desks. Windows move between displays like they know where they're going.",
        image: { src: "/apps/snapback/features/save.webp", alt: "A restored workspace filling both the laptop display and an external monitor", aspect: "1732 / 1154" },
      },
      {
        title: "Save the whole desk",
        body: "Positions, apps, monitors, even fullscreen state. Save it once, bring it all back with one shortcut.",
        image: { src: "/apps/snapback/features/workspaces.webp", alt: "Snapback's Workspaces settings listing Design, Writing and Developer, each with a shortcut", aspect: "1732 / 1154" },
      },
      {
        title: "Right there in the menu bar",
        body: "Every snap one click away, with its shortcut printed next to it for when you're ready to go keyboard-only.",
        image: { src: "/apps/snapback/features/menu.webp", alt: "Snapback's menu bar menu listing every snap and workspace with its shortcut", aspect: "1732 / 1154" },
      },
      {
        title: "No mystery moves",
        body: "Small, quiet toasts tell you what just happened to your windows and workspaces.",
        image: { src: "/apps/snapback/features/toast.webp", alt: "A small toast reading Design restored, above the restored windows", aspect: "1732 / 1154" },
      },
    ],
    tech: ["Swift", "SwiftUI", "Accessibility API", "Sparkle"],
    video: {
      src: "/apps/snapback/restore",
      title: "Save once. Restore everything.",
      caption: "One shortcut and every app, window and display snaps back to exactly where it was.",
      aspect: "1920 / 1080",
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
    links: {
      download: "https://dl.66labs.dev/Snapback/Snapback-0.48.0.dmg",
      purchase: "https://store.66labs.dev/checkout/buy/83715b0a-448b-4e25-80d2-b2e6203c713e",
    },
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
    status: "available",
    accent: "#0f9d8a",
    glow: ["#0f9d8a", "#0b63e5"],
    features: [
      {
        title: "Your whole clipboard, one hotkey",
        body: "Hit the shortcut and everything you've copied is right there. Find it, pick it, paste it.",
        image: { src: "/apps/peggo/features/clipboard.webp", alt: "Peggo's history panel listing links, code, an email address, a color and an image, with the color previewed", aspect: "1732 / 1154" },
      },
      {
        title: "Not just text",
        body: "Text, code, links, images, files, even video and audio. Peggo tells them apart and keeps every one.",
        image: { src: "/apps/peggo/features/images.webp", alt: "Peggo filtered to images, previewing a screenshot", aspect: "1732 / 1154" },
      },
      {
        title: "Pin what you'll need again",
        body: "Pin anything to keep it at the top, tagged Pinned so it never scrolls away with the rest.",
        image: { src: "/apps/peggo/features/pinned.webp", alt: "Pinned clips held at the top of Peggo's history, with pin icons and shortcuts", aspect: "1732 / 1154" },
      },
      {
        title: "⌘1–⌘9, straight back out",
        body: "Every visible clip gets a number. Press it and it lands exactly where your cursor is.",
        image: { src: "/apps/peggo/features/quick-paste.webp", alt: "Peggo's Quick Paste setting, where a modifier plus 1 to 9 pastes a clip", aspect: "1732 / 1154" },
      },
      {
        title: "20 themes, and bring your own",
        body: "Catppuccin, Dracula, Nord and 17 more, picked in Appearance settings. Or import one of your own.",
        image: { src: "/apps/peggo/features/themes.webp", alt: "Peggo's Themes settings, a grid of themes with an Import Theme button", aspect: "1732 / 1154" },
      },
      {
        title: "Stays on your Mac",
        body: "A local database, on your machine. Peggo ignores its own clipboard writes and anything from apps you exclude.",
        image: { src: "/apps/peggo/features/privacy.webp", alt: "Peggo's Privacy settings, listing apps whose clipboard changes are never recorded", aspect: "1732 / 1154" },
      },
      {
        title: "Cleans up after itself",
        body: "An automatic retention sweep keeps storage lean. No settings safari required.",
        image: { src: "/apps/peggo/features/cleanup.webp", alt: "Peggo's History settings with a history limit, retention and clear history", aspect: "1732 / 1154" },
      },
    ],
    tech: ["Swift", "SwiftUI", "SQLite", "Accessibility API"],
    video: {
      src: "/apps/peggo/demo",
      title: "Copy anything. Paste it back in a second.",
      caption: "One hotkey opens your whole clipboard. Filter by kind, search it, and paste any clip straight back.",
      aspect: "1512 / 942",
    },
    pricing: {
      free: "Free to download",
      pro: {
        price: "$6.00",
        note: "one-time",
        perks: [
          "Unlimited clipboard history and retention",
          "Every theme, including Catppuccin, Dracula and Nord",
        ],
      },
    },
    links: {
      download: "https://dl.66labs.dev/Peggo/Peggo-0.5.0.dmg",
      purchase: "https://store.66labs.dev/checkout/buy/bedb74bc-98d8-4dae-9724-8a94f9852aee",
    },
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
    status: "available",
    accent: "#e5890b",
    glow: ["#e5890b", "#0b63e5"],
    features: [
      {
        title: "A palette, not a folder graveyard",
        body: "Search, add, open, pin, tag and delete, all from one keyboard-first palette.",
        image: { src: "/apps/boomark/features/palette.webp", alt: "Boomark's palette with pinned and recent bookmarks and a preview of the selected one", aspect: "1732 / 1154" },
      },
      {
        title: "Grab the tab you're on",
        body: "One shortcut saves the frontmost tab from Safari, Chrome, Arc, Brave or Edge, free, no Pro required. No window switching.",
        image: { src: "/apps/boomark/features/grab-tab.webp", alt: "Boomark's shortcut settings, with Save Current Tab on its own global shortcut", aspect: "1732 / 1154" },
      },
      {
        title: "Save from the browser toolbar too",
        body: "A free browser extension for Chrome, Firefox, Edge, Arc, Brave and Safari saves without leaving the tab.",
        image: { src: "/apps/boomark/features/toolbar.webp", alt: "The Boomark browser extension popup, connected, with a page saved and two tags", aspect: "1732 / 1154" },
      },
      {
        title: "Bring your old bookmarks",
        body: "One-time import from Safari and Chromium browsers. Your folders become tags.",
        image: { src: "/apps/boomark/features/import.webp", alt: "Boomark's import settings, with one-click import from Safari, Arc, Brave and Edge", aspect: "1732 / 1154" },
      },
      {
        title: "Tags that don't multiply",
        body: "Case-insensitive with autocomplete, so “Work” and “work” never become two tags.",
        image: { src: "/apps/boomark/features/tags.webp", alt: "Tag autocomplete in Boomark suggesting an existing tag as you type", aspect: "1732 / 1154" },
      },
      {
        title: "⌘1–⌘9 quick-open",
        body: "Your top results, one keystroke each. Faster than typing the URL.",
        image: { src: "/apps/boomark/features/quick-open.webp", alt: "Boomark's bookmark list with a numbered shortcut beside each result", aspect: "1732 / 1154" },
      },
      {
        title: "Dress it up",
        body: "Preset themes with vibrancy, light and dark, or bring your own.",
        image: { src: "/apps/boomark/features/themes.webp", alt: "Boomark's Themes settings, a grid of preset themes with an Import Theme button", aspect: "1732 / 1154" },
      },
    ],
    tech: ["Swift", "SwiftUI", "CloudKit", "Sparkle", "Expo"],
    video: {
      src: "/apps/boomark/demo",
      title: "Save it once. Find it in three keystrokes.",
      caption: "Save a page from the browser toolbar, tag it, then open the palette and it's right there.",
      aspect: "1512 / 942",
    },
    pricing: {
      free: "Free to download, browser extension included",
      pro: {
        note: "one-time license",
        perks: ["iCloud sync with Boomark on iPhone", "Every theme beyond Default"],
      },
    },
    links: {
      download: "https://dl.66labs.dev/Boomark/Boomark-0.8.2.dmg",
      extensions: {
        chrome: "https://chromewebstore.google.com/detail/boomark/idfahjjcbcfpbgiddaficfokghfkcjcd",
        firefox: "https://addons.mozilla.org/es-MX/firefox/addon/boomark/",
        safari: "https://dl.66labs.dev/Boomark/Boomark-Safari-Extension-1.0.zip",
      },
    },
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
