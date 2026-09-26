# Snapback Support Knowledge Base

Source of truth for support-ticket triage and reply drafting. Generated from
`snapback-web/web/src/app/help/page.tsx` (public Help Center) and
`Snapback/Features/Licensing/LicenseManager.swift` (actual app behavior).
Keep this in sync when either changes: it is the only doc the support bot
is allowed to cite from.

## Product facts

- Snapback is free forever for the core app; Pro is a one-time $9.99 purchase
  (no subscription), unlocking command palette, Spaces, custom layouts.
- Requires macOS 14.2+.
- Runs from the menu bar.
- A **workspace** = saved layout of open apps (position, size, display).
  Create via menu bar → New Workspace. Restore via menu bar → pick workspace.
  Closed apps are reopened automatically.
- Multi-monitor: workspaces capture positions across all displays. Disconnected
  display → those windows are skipped (no pile-up); reconnect + restore again
  to get them back. Swapped/rotated display → Snapback recalculates automatically.
- Needs Accessibility permission to read/restore window positions (macOS may
  warn about apps from the internet; Snapback is signed & notarized).
- Does not integrate with macOS Spaces (no stable public API for that), and
  restores window positions/arrangements instead, which is more reliable.
- Coexists with Rectangle/Magnet without conflict; can disable Snapback's own
  snapping in Settings if there's overlap.
- Excludes Dock/System Settings and all JetBrains IDEs (bundle prefix
  `com.jetbrains`) from window capture: JetBrains apps crash with a Metal
  rendering error when moved via the Accessibility API. This is a known,
  permanent exclusion, not a bug to "fix."
- Multi-instance (multiple windows of the same app): partial support, actively
  improving. If a user reports a specific app misbehaving, ask them to use
  "Send Feedback" in-app (auto-attaches logs) rather than promising a fix.
- App min-size constraints: some apps enforce a minimum window size; if the
  saved layout is smaller, the app resizes to its own minimum. Not a Snapback bug.

## Licensing (Lemon Squeezy)

- One-time purchase, license never expires.
- Key format: `XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`.
- Activate: Settings → License tab → paste key → Activate.
- Lost key: it's in the Lemon Squeezy order confirmation email, or look up
  every order/key at `app.lemonsqueezy.com/my-orders` with the purchase email.
- Move to a new Mac: License tab → Deactivate on the old Mac, then activate
  the same key on the new Mac. No access to the old Mac? Deactivate that
  device instead from the Lemon Squeezy order page.
- **Activation limit reached**: the key is already active on the max number
  of Macs. Fix: deactivate it on a Mac no longer in use, either from that
  Mac's License tab, or from the Lemon Squeezy order page
  (`app.lemonsqueezy.com/my-orders`), then activate again. This is fully
  self-serve; the customer does not need Ricky to touch anything in the
  Lemon Squeezy dashboard.
- Keychain prompt for the license key: expected, one-time (usually after an
  update), safe to "Always Allow". Denying it doesn't break Pro; Snapback
  just asks again next validation.
- Invoices/receipts: `app.lemonsqueezy.com/my-orders` (License tab links there).
- Engineering detail (LicenseManager.swift): activation errors map to HTTP
  400/422 from Lemon Squeezy's `/v1/licenses/activate`; the app's own error
  message is literally "This license has reached its activation limit.",
  which matches what Henrik (#410) saw. No manual reset by Ricky is required or
  offered today; the fix is customer-side self-service via the order page.

## Troubleshooting

- **Windows restore incorrectly / only some restore** (e.g. Michael Coll #428,
  macOS 27.0, "any number of random stuff happens, only 1 of 5 windows
  restored"): first ask the customer to (1) confirm Accessibility permission
  is granted in System Settings → Privacy & Security → Accessibility, (2)
  restart Snapback from the menu bar, (3) if it persists, ask for their macOS
  version + which specific apps misbehave + send-feedback logs. This is NOT
  a documented known issue in the KB as of now: do not claim it's "a known
  bug we're fixing" unless a GitHub issue confirms that. Draft a reply that
  troubleshoots via the FAQ steps and asks for logs; do not promise a timeline.
- App not reopening on restore: check it's still in /Applications and wasn't
  moved/deleted; some apps restrict automated launching.
- Bug reports / feedback: point users to the in-app "Send Feedback" button,
  which auto-copies logs and opens a pre-filled support email.

## Reply-drafting rules for the support bot

1. Only cite facts from this file. If the ticket needs something not covered
   here (a real bug, a refund, an edge case), draft a reply that asks
   clarifying questions or acknowledges the report, never invent a policy,
   timeline, or fix.
2. Never promise a specific bug fix or release date.
3. Always draft only: save to Drafts / local file for Ricky to review and
   send by hand. Never auto-send.
4. Tone: matches the site's voice, direct, friendly, no corporate filler.
