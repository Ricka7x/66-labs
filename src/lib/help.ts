import type { App } from "@/lib/apps";

export interface HelpItem {
  q: string;
  a: string;
  link?: { href: string; label: string };
}

export interface HelpSection {
  /** Stable anchor: blog posts deep-link to these (/apps/<slug>/help#displays) */
  id: string;
  title: string;
  items: HelpItem[];
}

/**
 * Help content per app. Add a key for each new app; apps without one still get
 * a help page with the lab-wide questions and a contact link.
 */
export const appHelp: Record<App["slug"], HelpSection[]> = {
  snapback: [
    {
      id: "getting-started",
      title: "Getting started",
      items: [
        {
          q: "How do I install Snapback?",
          a: "Download the latest version from the Snapback page, open the DMG, and drag Snapback to your Applications folder. The first time you open it, macOS may ask you to confirm: click Open.",
        },
        {
          q: "Where does Snapback live?",
          a: "In your menu bar. You'll see its icon there after launching. It uses minimal resources and stays out of your way until you need it.",
        },
        {
          q: "Why does macOS ask for Accessibility permission?",
          a: "Snapback needs Accessibility access to read and restore window positions across your apps. macOS may show a warning about apps downloaded from the internet, but Snapback is signed and notarized by Apple.",
        },
      ],
    },
    {
      id: "workspaces",
      title: "Workspaces",
      items: [
        {
          q: "What is a workspace?",
          a: "A saved layout of all your open apps: their positions, sizes, and which display they're on. Think of it as a snapshot of your whole desk that you can restore instantly.",
        },
        {
          q: "How do I create a workspace?",
          a: "Set up your apps the way you like them, click the Snapback menu bar icon and choose New Workspace. Give it a name like “Dev Mode” or “Design” and you're done.",
        },
        {
          q: "How do I restore a workspace?",
          a: "Click the Snapback menu bar icon and pick the workspace. Every app snaps back to its saved position, and closed apps are reopened.",
        },
        {
          q: "Can I have multiple workspaces?",
          a: "Yes, one for coding, one for design, one for meetings, as many as you like. Switch between them with a single click.",
        },
      ],
    },
    {
      id: "shortcuts",
      title: "Keyboard shortcuts",
      items: [
        {
          q: "What can I control with keyboard shortcuts?",
          a: "Almost everything: snapping windows, switching layouts, activating workspaces and managing spaces.",
        },
        {
          q: "Where do I find snapping actions?",
          a: "The menu bar has quick snapping actions like left half and right half. You can assign custom snapping shortcuts in Settings under the Snaps tab.",
        },
        {
          q: "Where do I customize Snapback?",
          a: "Open Settings from the menu bar. General covers app behavior and global shortcuts, Snaps the snapping shortcuts, Workspaces your saved workspaces, and Layouts your window layouts. Pro users also get Spaces for shortcut groups and License for activating their key.",
        },
      ],
    },
    {
      id: "displays",
      title: "Multiple displays",
      items: [
        {
          q: "Does Snapback work with multiple monitors?",
          a: "Yes. Workspaces capture window positions across all connected displays, and restoring puts everything back exactly where it was.",
        },
        {
          q: "What happens if I disconnect a display?",
          a: "Windows saved on a missing display are skipped, so nothing piles up on your remaining screen. If the whole workspace was saved on one display, it restores on whatever screen is available. Reconnect the display and restore again to get the full layout back.",
        },
        {
          q: "What if I swap or rotate a display?",
          a: "Snapback recalculates window positions to match the new display arrangement.",
        },
      ],
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      items: [
        {
          q: "Snapback isn't restoring windows correctly",
          a: "Make sure Snapback has Accessibility permission in System Settings → Privacy & Security. If it still misbehaves, restart Snapback from the menu bar or email us with your macOS version.",
        },
        {
          q: "An app isn't reopening when I restore",
          a: "Some apps restrict automated launching. Make sure the app is installed in your Applications folder and hasn't been moved or deleted.",
        },
        {
          q: "How do I send feedback or report a bug?",
          a: "Click Send Feedback inside the app. It copies your logs to the clipboard and opens a pre-filled support email with everything we need to help.",
        },
      ],
    },
    {
      id: "app-behavior",
      title: "App behavior",
      items: [
        {
          q: "Why does Snapback ignore some apps?",
          a: "It automatically excludes certain system apps like the Dock and System Settings. Finder is fully supported.",
        },
        {
          q: "Can I exclude apps from being tracked?",
          a: "Yes. Add any app to the ignore list in Settings and Snapback will stop tracking and restoring it.",
        },
        {
          q: "Why doesn't an app resize to the exact size I saved?",
          a: "Some apps enforce a minimum width and height. If your saved layout is smaller than that, the app resizes to its minimum instead, a limit of the app itself, not Snapback.",
        },
      ],
    },
    {
      id: "compatibility",
      title: "Compatibility",
      items: [
        {
          q: "Does Snapback work with Rectangle or Magnet?",
          a: "Yes, side by side without conflicts. If you prefer your existing snapping tool, turn off Snapback's snapping in Settings so they don't overlap.",
        },
        {
          q: "Does it work with macOS Spaces?",
          a: "Not directly. Apple doesn't offer a stable public API for Spaces. Snapback restores window positions and arrangements instead, which gets you the same result without the fragility.",
        },
        {
          q: "Will it keep working after a macOS update?",
          a: "Snapback is actively maintained and updates are tested against new macOS releases.",
        },
        {
          q: "Why are JetBrains IDEs excluded?",
          a: "JetBrains apps (PyCharm, IntelliJ IDEA, WebStorm, GoLand, Rider, CLion and the rest) crash with a Metal rendering error when their windows are moved through the macOS Accessibility API. To prevent crashes and data loss, Snapback automatically excludes every app with the com.jetbrains bundle ID prefix.",
        },
        {
          q: "Does Snapback support multiple windows of the same app?",
          a: "Partly. Snapback can detect and restore multiple windows from the same app, though some edge cases don't behave perfectly yet. If a specific app gives you trouble, send feedback from inside Snapback.",
        },
      ],
    },
    {
      id: "licensing",
      title: "License & purchases",
      items: [
        {
          q: "How do I activate my Pro license?",
          a: "Open Settings from the menu bar, go to the License tab, paste the key from your confirmation email and press Activate. Keys look like XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX.",
        },
        {
          q: "I lost my license key. How do I get it back?",
          a: "It's in the order confirmation email from Lemon Squeezy, our payment provider. You can also sign in at app.lemonsqueezy.com/my-orders with the email you bought with. If a license is already active, the License tab has a Copy button next to your key.",
        },
        {
          q: "How do I move my license to a new Mac?",
          a: "Click Deactivate in the License tab on your old Mac to free the seat, then activate the same key on the new one. No access to the old Mac? Deactivate it from your Lemon Squeezy order page instead.",
        },
        {
          q: "I get an “activation limit reached” error",
          a: "Your key is active on the maximum number of Macs. Deactivate it on one you no longer use, from that Mac's License tab or from app.lemonsqueezy.com/my-orders, then try again.",
        },
        {
          q: "macOS asked me to let Snapback access the Keychain. What's that?",
          a: "Snapback stores your Pro key in the macOS Keychain, the same encrypted storage your passwords use. You may see the prompt once, usually after an update. Click Always Allow and macOS won't ask again. Clicked Deny by accident? Your license stays active. Snapback simply asks again next time it checks.",
        },
        {
          q: "Does my license expire?",
          a: "No. Snapback Pro is a one-time purchase and the license doesn't expire.",
        },
        {
          q: "Where's my invoice or receipt?",
          a: "On your Lemon Squeezy order page at app.lemonsqueezy.com/my-orders. The License tab in Snapback links there under Order & Receipts.",
        },
      ],
    },
  ],

  peggo: [
    {
      id: "getting-started",
      title: "Getting started",
      items: [
        {
          q: "Where does Peggo live?",
          a: "In your menu bar. It quietly keeps track of what you copy, and your history opens from a global hotkey whenever you need it.",
        },
        {
          q: "Why does Peggo ask for Accessibility permission?",
          a: "Auto-paste, dropping a clip straight into the app you're using, works through the macOS Accessibility API, which macOS only allows with your permission.",
        },
      ],
    },
    {
      id: "history",
      title: "Your clipboard history",
      items: [
        {
          q: "What does Peggo remember?",
          a: "Text, images, video and audio clips, not just the last thing you copied, all of it.",
        },
        {
          q: "Will my history fill up my disk?",
          a: "No. An automatic retention sweep clears out old clips so storage stays lean without you digging through settings.",
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacy",
      items: [
        {
          q: "Does anything I copy leave my Mac?",
          a: "No. Your history lives in a local database on your Mac, and Peggo doesn't send it anywhere.",
          link: { href: "/privacy#peggo", label: "Read the privacy details" },
        },
      ],
    },
  ],

  boomark: [
    {
      id: "getting-started",
      title: "Getting started",
      items: [
        {
          q: "How do I open Boomark?",
          a: "Press the global hotkey, ⌘⇧B by default, from any app. The palette opens on top of whatever you're doing: search, paste a URL, or pick a bookmark and hit Return.",
        },
        {
          q: "How do I save the tab I'm looking at?",
          a: "Press ⌘⇧S (the default). Boomark grabs the frontmost tab's URL and title from Safari, Chrome, Arc, Brave or Edge, no window switching.",
        },
        {
          q: "Why does macOS ask to let Boomark control my browser?",
          a: "Saving the current tab reads its URL and title through AppleScript, which macOS gates behind an Automation permission per browser. Allow it for the browsers you use. Boomark only reads the tab when you press the save shortcut.",
        },
      ],
    },
    {
      id: "organizing",
      title: "Organizing bookmarks",
      items: [
        {
          q: "Can I bring my existing bookmarks?",
          a: "Yes, there's a one-time import from Safari and Chromium-based browsers. Your folders become tags.",
        },
        {
          q: "How do tags work?",
          a: "Tags are case-insensitive with autocomplete (arrow keys, Return, Escape), so “Work” and “work” are always the same tag.",
        },
        {
          q: "Is there a faster way to open my top results?",
          a: "⌘1 through ⌘9 open the top results directly. You can change the modifier in Settings.",
        },
        {
          q: "Can Boomark clean up old bookmarks for me?",
          a: "Optionally. Turn on the retention sweep and old, unpinned bookmarks are removed automatically. Pin anything you want to keep forever.",
        },
      ],
    },
    {
      id: "pro",
      title: "Boomark Pro & sync",
      items: [
        {
          q: "What does Pro add?",
          a: "iCloud sync with Boomark on iPhone, and every theme beyond Default. Everything else is free.",
        },
        {
          q: "How does sync work?",
          a: "Through your own iCloud account (CloudKit). Sign in to the same Apple Account on your Mac and iPhone and your bookmarks follow. There's no separate account to create.",
        },
        {
          q: "How do I activate Pro?",
          a: "Open Settings → License and paste the key from your Lemon Squeezy confirmation email.",
        },
        {
          q: "Without Pro, where do my bookmarks live?",
          a: "On your Mac, and only there, including anything saved from the browser extension.",
        },
      ],
    },
  ],
};

/** Questions that apply to every app: shown on /help and at the bottom of each app's help page. */
export const labHelp: HelpSection = {
  id: "general",
  title: "General",
  items: [
    {
      q: "How do I get support?",
      a: "Email hello@66labs.dev. Tell us which app, your macOS version and what happened, screenshots help. It's a small lab, so replies come from the people who build the apps.",
    },
    {
      q: "Who handles payments?",
      a: "Paid licenses are sold through Lemon Squeezy, which processes the payment and emails you your key and receipt. Your order history is at app.lemonsqueezy.com/my-orders.",
    },
    {
      q: "Do I need a 66 labs account?",
      a: "No. None of our apps ask you to create an account with us.",
    },
  ],
};
