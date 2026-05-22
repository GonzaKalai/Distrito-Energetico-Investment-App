# Deploying to Vercel

This app is a fully client-side single-page app. No backend, no env vars needed.

## Steps

1. In Lovable, click **GitHub → Connect** (top right) and push the project to a new repo.
2. Go to [vercel.com/new](https://vercel.com/new), pick that repo, and click **Import**.
3. Vercel auto-detects the build from `vercel.json`:
   - Build Command: `bun run build`
   - Output Directory: `.output/public`
4. Click **Deploy**. Done.

## Notes

- All edits live in your browser's localStorage. Different browser/device = different content.
- Use the **JSON** button in the toolbar to back up your content tree, and **Import** to restore it.
- The same JSON file can be shared with another machine to copy your decks across.
