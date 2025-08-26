# EcoHaul - Smart Waste Management Mobile App

EcoHaul is a comprehensive, full-stack mobile application that revolutionizes waste management by gamifying recycling and providing intelligent disposal solutions. Built with React Native and Expo, it serves as an end-to-end platform for users to identify, categorize, and properly dispose of household waste.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure email/password authentication with persistent sessions
- **Gamified Dashboard**: Personal point tracking, monthly goals, community leaderboards, and disposal history
- **Intelligent Scanning**: Real-time camera-based waste item detection and classification
- **Dynamic Cart Management**: Review, edit, and manage scanned items before disposal
- **AI-Powered Disposal Agent**: Location-based recycling center recommendations
- **LLM-Generated Guides**: Step-by-step disposal instructions with safety warnings

### Key Screens
1. **Authentication Screen**: Sign up/sign in with form validation
2. **Dashboard Screen**: Gamified overview with stats, leaderboards, and quick actions
3. **Scanner Screen**: Camera interface for waste item detection
4. **Cart Screen**: Item management with category editing and disposal options
5. **Disposal Centers Screen**: Location-based center finder with directions
6. **Disposal Guide Screen**: AI-generated disposal instructions

## 🛠 Technical Stack

### Frontend
- **React Native** with Expo SDK 51
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **React Navigation 7** for navigation
- **Expo Camera** for image capture
- **Expo Location** for geolocation services

### Key Libraries
```json
{
  "@reduxjs/toolkit": "State management",
  "react-redux": "Redux React bindings",
  "expo-camera": "Camera functionality",
  "expo-location": "Location services",
  "expo-image-picker": "Image selection",
  "@react-native-async-storage/async-storage": "Local storage",
  "expo-secure-store": "Secure credential storage",
  "react-native-paper": "UI components"
}
```

## 📱 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd EcoHaul
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
# or
expo start
```

4. **Run on device/simulator**
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 🏗 Project Structure

```
EcoHaul/
├── src/
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.ts      # Authentication logic
│   │   │   ├── cartSlice.ts      # Cart management
│   │   │   ├── disposalSlice.ts  # Disposal centers & guides
│   │   │   └── userSlice.ts      # User stats & leaderboard
│   │   ├── store.ts              # Redux store configuration
│   │   └── hooks.ts              # Typed hooks
│   ├── screens/
│   │   ├── AuthScreen.tsx        # Authentication
│   │   ├── DashboardScreen.tsx   # Main dashboard
│   │   ├── ScannerScreen.tsx     # Camera scanning
│   │   ├── CartScreen.tsx        # Cart management
│   │   ├── DisposalCentersScreen.tsx # Center finder
│   │   └── DisposalGuideScreen.tsx   # AI guide
│   └── components/               # Reusable components
├── App.tsx                       # Main app component
├── package.json
└── README.md
```

## 🎯 User Journey

### 1. Authentication Flow
- New users register with name, email, and password
- Returning users sign in with email/password
- Credentials stored securely with automatic session restore

### 2. Dashboard Experience
- View current points and leaderboard ranking
- Track monthly sustainability goals with progress bars
- Access disposal history and environmental impact stats
- Quick navigation to scanning and cart features

### 3. Waste Scanning Process
- Camera interface with scanning overlay
- Real-time item detection and classification
- Multiple items can be scanned simultaneously
- Gallery import option for existing photos

### 4. Cart Management
- Review detected items with confidence scores
- Edit item categories manually if needed
- Remove incorrect detections
- Calculate total points potential

### 5. Disposal Options
- **Find Centers**: Location-based disposal facility recommendations
- **Get Guide**: AI-generated step-by-step disposal instructions
- **Complete Disposal**: Earn points and update stats

## 🔧 Configuration

### Environment Setup
Create a `.env` file in the project root:
```env
EXPO_PUBLIC_API_URL=your_backend_api_url
EXPO_PUBLIC_AI_DETECTION_KEY=your_ai_service_key
EXPO_PUBLIC_LLM_API_KEY=your_llm_api_key
```

### Permissions Required
- **Camera**: For waste item scanning
- **Location**: For finding nearby disposal centers
- **Storage**: For caching user data and images

## 🧪 Development Roadmap

### Phase 1 (MVP) ✅
- [x] User authentication system
- [x] Basic dashboard with gamification
- [x] Camera scanning interface
- [x] Cart management functionality
- [x] Mock AI detection service

### Phase 2 (Enhanced Features) 🔄
- [ ] Backend API integration
- [ ] Real AI object detection
- [ ] Location-based center search
- [ ] Push notifications

### Phase 3 (Advanced Features) 📋
- [ ] LLM integration for guides
- [ ] Social features and challenges
- [ ] Offline mode support
- [ ] Advanced analytics

## 🎮 Gamification System

### Point System
- **Plastic Items**: 10 points each
- **Metal Items**: 15 points each
- **Glass Items**: 12 points each
- **Electronic Items**: 25 points each
- **Hazardous Items**: 30 points each

### Achievement Levels
- **Eco Novice**: 0-100 points
- **Green Explorer**: 101-500 points
- **Eco Warrior**: 501-1000 points
- **Sustainability Champion**: 1000+ points

### Monthly Goals
- Customizable point targets
- Progress tracking with visual indicators
- Streak counters for consistent disposal
- Environmental impact calculations

## 🌍 Environmental Impact

The app calculates and displays:
- **CO₂ Saved**: Estimated carbon footprint reduction
- **Trees Equivalent**: Environmental impact visualization
- **Items Recycled**: Total waste diverted from landfills
- **Disposal Sessions**: Consistency tracking

## 🔒 Security Features

- **Secure Storage**: Credentials encrypted with Expo SecureStore
- **Session Management**: Automatic token refresh and logout
- **Input Validation**: Form validation and sanitization
- **Permission Handling**: Graceful permission request flows

## 🐛 Known Issues & Limitations

### Current Limitations
1. **Mock AI Detection**: Uses simulated object detection responses
2. **Local Data**: No backend integration yet
3. **Limited Categories**: Fixed waste type classifications
4. **iOS/Android Only**: Web support is basic

### Planned Improvements
- Real-time AI model integration
- Cloud synchronization
- Expanded waste categories
- Community features

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow React Native best practices
- Maintain consistent formatting
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for the excellent development platform
- **React Native Community** for comprehensive libraries
- **Redux Toolkit** for simplified state management
- **Environmental Organizations** for waste management guidance

## 📞 Support

For support, email support@ecohaul.com or create an issue in the repository.

---

**EcoHaul** - Making waste management smart, engaging, and rewarding! 🌱♻️