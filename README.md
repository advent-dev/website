# Terry's Pocketmart - 3D Prints Gallery

A sleek, responsive static website for 3D printed objects, featuring light/dark theme toggle, dynamic multi-page galleries, interactive before/after comparison slider modal, contact page, and coming soon waitlist page.

---

## 🚀 How to Deploy on GitHub Pages (Free Static Hosting)

### Method 1: Using GitHub Desktop (Easiest & Recommended)
1. Open **GitHub Desktop** (or download it free from [desktop.github.com](https://desktop.github.com)).
2. In GitHub Desktop, click **File > Add Local Repository** (or press `Ctrl + O`).
3. Choose your desktop folder: `C:\Users\teren\Desktop\website` (or `C:\Users\teren\OneDrive\Desktop\website`).
4. If it says *“This directory does not appear to be a Git repository”*, click **create a repository** to initialize it.
5. Click **Publish repository** to push it to your GitHub account (make sure to leave it **Public** so GitHub Pages can host it for free).
6. Go to your repository on [github.com](https://github.com), click **Settings > Pages**:
   - Under **Build and deployment > Source**, select **Deploy from a branch**.
   - Select **Branch**: `main`, and folder: `/(root)`.
   - Click **Save**.
7. In 1–2 minutes, your website will be live at:
   `https://<your-username>.github.io/<repository-name>/`

---

### Method 2: Using the Command Line
Open PowerShell or Command Prompt inside this folder:

```bash
git init
git add .
git commit -m "Initial commit of static website"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git push -u origin main
```

Then in your repository on GitHub, go to **Settings > Pages**, set the branch to `main`, and save.

---

### Method 3: Drag & Drop via Web Browser
1. Create a new public repository on [github.com/new](https://github.com/new).
2. On the empty repository setup page, click the link that says **uploading an existing file**.
3. Select and drag all files and folders from this `website` folder into the GitHub web page.
4. Click **Commit changes**.
5. Go to **Settings > Pages**, set **Source** to `Deploy from a branch`, choose `main`, and click **Save**.

---

## 📁 What’s Included

* `index.html` - The main homepage showcasing your 3D print gallery, search bar, and interactive comparison slider lightbox.
* `page.html` - Dynamic page template that renders custom galleries (e.g. *Generation 1*, *Generation 2*, *About Us*).
* `contact.html` - Contact page with form and feedback simulation.
* `coming_soon.html` - The coming soon landing page with waitlist signup and thank-you popup.
* `admin.html` - Interactive editor to customize titles, galleries, backgrounds, and navigation.
* `data.json` - Central static database containing your prints, descriptions, images, and pages.
* `css/style.css` - Full responsive styling with light and dark mode variables.
* `js/main.js` - Dynamic script that loads `data.json`, handles the theme switcher, search filtering, and lightbox slider.
* `js/admin.js` - Dashboard script for managing site content.
* `images/` - All 238 high-resolution gallery images, comparison photos, and logos.
* `.nojekyll` - Ensures GitHub Pages serves all assets directly without Jekyll processing.
* `app.py` - Optional local Python Flask server if you ever want to preview or edit locally with `python app.py`.
