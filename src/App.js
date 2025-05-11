import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';

// Pages
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import CarDetailsPage from './pages/CarDetailsPage';
import VoiceAssistantPage from './pages/VoiceAssistantPage';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Layout from './components/common/Layout';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/car/:id" element={<CarDetailsPage />} />
            <Route path="/voice-assistant" element={<VoiceAssistantPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;