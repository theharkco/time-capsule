# Time Capsule - 2026-03-09

## App Description
A beautiful, mysterious message app that lets you seal thoughts, dreams, and messages for your future self. Choose when to unlock your capsules with a countdown timer.

## Tech Stack
- **Framework**: Next.js 14 (App Router) with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Libraries**: date-fns, uuid
- **Persistence**: LocalStorage (client-side)

## Key Features
✅ Create time capsules with custom titles and messages
✅ Select unlock dates (past, present, or future)
✅ Beautiful dark theme with purple/pink gradient aesthetic
✅ Countdown timer showing days until unlock
✅ Overdue capsules highlighted in amber
✅ Unlocked capsules shown with green accent
✅ LocalStorage persistence
✅ Delete functionality

## Visual Design
- **Color scheme**: Dark background with purple-to-pink gradient
- **Effects**: Pulsing title, glowing borders for unlocked capsules
- **Status badges**: 
  - 🔒 SEALED (purple) - future dates
  - ⏰ OVERDUE (amber) - past dates ready to unlock
  - 🔓 UNLOCKED (green) - previously opened capsules

## Deployment Status
✅ **Code**: Pushed to GitHub at https://github.com/theharkco/time-capsule
⏳ **Deploy**: Ready for deployment via Coolify dashboard

## How to Deploy to Coolify
1. Go to https://apps.harkco.se
2. Login with: `minihark@zohomail.eu`
3. Click "Create New Resource" → "GitHub"
4. Select "Public repository"
5. Enter: `https://github.com/theharkco/time-capsule`
6. Build settings:
   - **Build pack**: Nixpacks
   - **Port**: 3000
7. Enable auto-deploy
8. Set custom domain: `time-capsule.apps.harkco.se`
9. SSL will be auto-configured

## Files Created
- `app/page.tsx` - Main page with capsule creation and display
- `app/layout.tsx` - Root layout with metadata
- `app/globals.css` - Custom styling with scrollbar
- `components/ui/date-picker.tsx` - Custom date picker component
- `components/ui/calendar.tsx` - shadcn calendar component
- `components/ui/popover.tsx` - shadcn popover component

## Next Steps
- Deploy to Coolify (manual login required)
- Test the app live
- Share the deployed URL
- Consider adding email notifications for when capsules unlock