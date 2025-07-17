# 2048-Hangeul

A minimalist version of the classic **2048 game**, using **Korean characters (Hangul)** instead of numbers.  
Built with **TypeScript**, **Vite** for development/build, and **Firebase** for deployment.

---

## 🎮 Features

- Core 2048 logic using tiles with Korean characters.
- Responsive design, playable on desktop and mobile.
- Smooth animations and keyboard/touch input support.
- Simple UI with soft color palette and Hangul-friendly fonts.

---

## 🕹️ How to Play

- Combine matching tiles to progress through Korean characters.
- The goal is to reach the final Hangul tile (빠 in this case, in honor of my name).
- **PC Controls**: Use arrow keys to move tiles.
- **Mobile Controls**: Swipe in any direction to move tiles.
- When two matching tiles collide, they merge into the next character.
- The game ends when no more moves are possible.

---

## 🛠 Technologies

- TypeScript + HTML5 + CSS3
- [Vite](https://vitejs.dev/) for development and build
- [Firebase Hosting](https://firebase.google.com/products/hosting) for deployment

---

## 🚀 How to Run Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/2048-hangeul.git
   cd 2048-hangeul
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🌐 Deployment (Firebase)

To deploy your build to Firebase:

```bash
npm run build
firebase deploy
```

Make sure Firebase is initialized and linked to your project. See [`firebase.json`](./firebase.json) for configuration.

---

## 📄 License

This project is open-source and available under the MIT License.
