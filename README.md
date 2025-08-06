# porzuczek.pl - Portfolio Application

Modern, responsive portfolio website built with Next.js and TypeScript, featuring custom typography, gradient designs, and optimized performance.

![Portfolio Screenshot](https://i.imgur.com/LqjFvMi.png)

## 🚀 Live Demo

Visit the live portfolio at: **[porzuczek.pl](http://porzuczek.pl)**

## ✨ Features

- **Modern Design**: Clean, minimalist interface with custom gradient color schemes
- **Custom Typography**: Four premium fonts (Basalte-Fond, Abordage, Karrik, Typefesse Claire-Obscure)
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Performance Optimized**: Font loading optimization with loading screens
- **Interactive Elements**: Hover effects, smooth scrolling, and animated components
- **SEO Ready**: Proper meta tags and semantic HTML structure
- **Accessibility**: ARIA labels and keyboard navigation support

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) - React framework for production
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) - Utility-first CSS framework
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful & consistent icon toolkit
- **Fonts**: Custom WOFF2 fonts for unique typography
- **Deployment**: Ready for Vercel, Netlify, or any Node.js hosting

### Dependencies

```json
{
  "next": "^14.2.18",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "^5.7.2",
  "tailwindcss": "^3.4.17",
  "lucide-react": "^0.460.0"
}
```

## 📁 Project Structure

```
├── app/
│   ├── globals.css          # Global styles and custom CSS
│   ├── layout.tsx           # Root layout component
│   ├── page.tsx             # Main portfolio page
│   └── favicon.ico          # Site favicon
├── lib/
│   └── portfolio-data.js    # Centralized data layer
├── public/
│   ├── *.woff2             # Custom font files
│   └── ...                 # Static assets
├── components/
│   └── ui/                 # Reusable UI components
└── README.md
```

## 🎨 Data Architecture

All content data is **exported to a separate data layer** (`lib/portfolio-data.js`) for easy maintenance and updates:

- **Personal Information**: Bio, contact details, social links
- **Work Experience**: Job history with descriptions and technologies
- **Projects**: Featured work with descriptions and links
- **Navigation**: Site structure and menu items
- **Loading Screen**: Customizable loading messages
- **Contact Information**: Email, location, and social profiles

This separation allows for easy content updates without touching the component code.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PeterPorzuczek/piotr-portfolio-5.git
   cd piotr-portfolio-5
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📝 Content Management

To update portfolio content, edit the `lib/portfolio-data.js` file:

```javascript
export const personalInfo = {
  name: "Your Name",
  title: "Your Title",
  bio: ["Your bio paragraphs..."],
  // ... more fields
}

export const projects = [
  {
    name: "Project Name",
    description: "Project description",
    tech: "Technologies used",
    url: "https://github.com/...",
    year: "2024"
  }
  // ... more projects
]
```

## 🎨 Customization

### Colors & Gradients

Custom gradient classes are defined in `app/globals.css`:
- `.holo-text-*` - Text gradients for different sections
- `.holo-gradient-*` - Background gradients for underlines
- `.holo-dot-*` - Colored dots for list items

### Typography

Four custom fonts are loaded:
- **Basalte-Fond**: Headers and titles
- **Abordage**: Body text (fallback)
- **Karrik**: Primary body text
- **Typefesse Claire-Obscure**: Section headers

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🔧 Performance Features

- **Font Loading Optimization**: Fonts load before content renders
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting for optimal loading
- **SEO Optimization**: Meta tags and semantic HTML

## 📄 License

This project is licensed under the **GNU General Public License v2.0** - see the [LICENSE](LICENSE) file for details.

```
Copyright (C) 2025 Piotr Porzuczek

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
```

## 👨‍💻 Author

**Piotr Porzuczek**
- Website: [porzuczek.pl](https://porzuczek.pl)
- GitHub: [@PeterPorzuczek](https://github.com/PeterPorzuczek)
- LinkedIn: [piotrporzuczek](https://linkedin.com/in/piotrporzuczek)

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

Built with ❤️ using Next.js and TypeScript 