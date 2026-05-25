# Touch That AI 🤖

An interactive AI literacy learning app that helps users master prompt engineering through structured lessons and hands-on practice. Built with React Native and Expo for cross-platform mobile and web experiences.

## 🎯 Features

- **Interactive Lessons**: Learn AI prompting fundamentals through bite-sized, structured content
- **Hands-on Practice**: Apply your skills with real-time AI feedback and scoring
- **Personalized Learning Path**: AI-powered recommendations based on your progress
- **Progress Tracking**: Monitor your mastery across different AI skills and techniques
- **Cross-Platform**: Works seamlessly on iOS, Android, and web
- **Modern UI**: Beautiful dark theme with purple/pink gradient aesthetics

## 🚀 Quick Start

1. **Clone and install dependencies**

   ```bash
   git clone https://github.com/Mqstered/Touch-that-AI.git
   cd Touch-that-AI
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Add your Supabase credentials to .env
   ```

3. **Start the development server**

   ```bash
   npx expo start
   ```

   **Useful options:**
   - `npx expo start --clear` - Clear cache and restart
   - `npx expo start --tunnel` - Enable tunnel for remote access

4. **Run on your preferred platform**

   - 📱 **Mobile**: Open Expo Go app and scan QR code
   - 💻 **Web**: Open `http://localhost:8081` in your browser
   - 🖥️ **Simulator**: Press `a` (Android) or `i` (iOS) in terminal
   - 🌐 **Remote**: Use tunnel URL from `--tunnel` flag


## 🛠️ Tech Stack

- **Frontend**: React Native 0.83.6 + Expo 55
- **Navigation**: Expo Router v3 (file-based routing)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Language**: TypeScript (strict mode)
- **Styling**: StyleSheet with custom theme system
- **Animations**: React Native Reanimated 4
- **State Management**: React Context + Hooks

## 📱 Development

### Available Scripts

```bash
npm start          # Start development server
npm run android    # Run on Android
npm run ios        # Run on iOS  
npm run web        # Run on web
npm run lint       # Run ESLint
```

### Environment Setup

1. Copy `.env.example` to `.env`
2. Add your Supabase URL and anon key
3. Run database migrations if needed

### Code Quality

- TypeScript strict mode enabled
- ESLint configuration for code standards
- Feature-based architecture for scalability
- Comprehensive component documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev)
- Backend powered by [Supabase](https://supabase.com)
- Inspired by modern AI education platforms

---

**Note**: This project uses npm/yarn for package management. See `requirements.txt` for a complete list of dependencies and their exact versions.

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/) - Comprehensive guides and API reference
- [React Native Documentation](https://reactnative.dev/) - Core React Native concepts
- [Expo Router Guide](https://docs.expo.dev/router/introduction/) - File-based routing system
- [Supabase Documentation](https://supabase.com/docs) - Backend services and database

## 💬 Support

- 🐛 **Report Issues**: [GitHub Issues](https://github.com/Mqstered/Touch-that-AI/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/Mqstered/Touch-that-AI/discussions)
- 📱 **Community**: Join our [Discord Community](https://chat.expo.dev) for Expo-related questions
