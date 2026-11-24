LITTLE LOVE NOTE — CREATOR + SHAREABLE EXPERIENCE

THIS IS THE SAME WEBSITE YOU HAVE BEEN BUILDING.
The creator form and the romantic experience are integrated into one project. There is no separate product or second website.

LOCAL PREVIEW
1. Keep index.html, style.css, script.js and cute love gif.mp4 in the same folder.
2. Open the folder in VS Code and run index.html with Live Server.
3. The builder appears first. Fill in the fields and click Create my shareable link.
4. Preview the generated link. For a share link to work for other people, publish this exact folder on GitHub Pages first.

PUBLISH ON GITHUB PAGES
1. Create a public GitHub repository.
2. Upload the contents of this folder to the repository root.
3. Open Settings → Pages.
4. Choose Deploy from a branch, select main and /(root), then Save.
5. Wait for GitHub Pages to publish. Open your published site, create an experience, and share its generated URL.

HOW SHARING WORKS
The generated URL points back to this same index.html and carries the creator's settings in a URL-safe encoded parameter. When the recipient opens it, the builder is skipped and the personalized experience opens directly. Recipient-facing names are locked: only the creator can set or change the sender and recipient names in the builder. No database or account is needed for this static version.

CUSTOM FIELDS
- Sender and recipient names
- Custom question
- Theme: Blush, Lavender, Midnight, Sunset
- Love letter and final surprise message
- Optional direct MP3/audio URL
- Optional direct MP4 video URL

NOTES
- Music playback requires the visitor to tap Sound on because browsers block autoplay with sound.
- Audio/video URLs must be direct public file URLs and allow cross-origin/browser playback. A YouTube page URL is not a direct MP3/MP4 file.
- The included cute love gif.mp4 is used when no custom video URL is provided.
- Share links contain the personalized text in encoded form, not encrypted form. Do not put private or sensitive information in them.
- This is a static GitHub Pages implementation. Very long messages or media files should be hosted separately.


LATEST FIXES
- Removed editable name fields from the recipient welcome screen. Names now come only from the creator's generated link.
- Rebuilt the No-button escape area with a much larger two-dimensional arena, randomized collision-safe positions, and a grid fallback. It checks the Yes button before every move and selects a new location away from the pointer.
