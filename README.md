# INNOVIXA Website

A responsive, dark technology-themed website for GitHub Pages.

## Included
- INNOVIXA logo in the header, hero and favicon.
- Separate responsive pages: Home (`index.html`), Videos (`videos.html`), Projects (`projects.html`) and About (`about.html`).
- YouTube RSS synchronization through GitHub Actions (every 15 minutes).
- Google Drive resource links on project cards.

## Publish to GitHub Pages
1. Upload the contents of this folder into the root of `innovixa/INNOVIXA`.
2. In GitHub, open **Settings → Pages**.
3. Set the source to **Deploy from a branch**, choose `main` and `/ (root)`, then Save.
4. Open **Actions**, enable workflows if GitHub asks, and run **Sync INNOVIXA YouTube videos** once using **Run workflow**.
5. Wait for the workflow to complete, then visit https://innovixa.github.io/INNOVIXA/.

The workflow detects the channel ID from `https://www.youtube.com/@INNOVIXA` and reads the public YouTube RSS feed. It does not need a YouTube API key. GitHub Actions may run scheduled jobs with a delay.

## Add Google Drive resources
Edit `projects.json`. For each project, add its details and a shareable Drive URL:

```json
[
  {
    "title": "My project",
    "description": "What this project does.",
    "icon": "⚙",
    "driveUrl": "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
    "projectUrl": "https://github.com/innovixa/INNOVIXA"
  }
]
```

Set the Drive file/folder sharing permission to **Anyone with the link** if you want public visitors to access it. Do not add private links or sensitive files.

## Customize
- Replace or edit `assets/innovixa-logo.png` to change the logo.
- Edit the text in `index.html`.
- Change colors and layout in `styles.css`.
- Edit project cards in `projects.json`.


## Homepage layout and Shorts filtering
The homepage (`index.html`) intentionally contains only the introduction and the latest four regular videos. The Videos page shows up to 12 recent regular uploads. The GitHub Actions workflow checks YouTube's `/shorts/VIDEO_ID` route and excludes entries that remain on the Shorts route. If YouTube changes its redirects or blocks classification, uncertain entries are excluded rather than displayed as Shorts.


## Social links and animated robot background
The footer links to YouTube, the INNOVIXA WhatsApp Channel, and Instagram. GitHub is not shown in the footer. A decorative looping robot-workshop GIF appears as a subtle background layer, with a pause/play control. The background animation is hidden when the visitor's device requests reduced motion.
