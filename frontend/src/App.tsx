import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DatasetProvider } from './context/DatasetContext';
import { ToastProvider } from './components/ui/Toast';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import PreviewPage from './pages/PreviewPage';
import ExplorePage from './pages/ExplorePage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <DatasetProvider>
          <BrowserRouter>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/preview/:id" element={<PreviewPage />} />
                <Route path="/explore/:id" element={<ExplorePage />} />
                <Route path="/dashboard/:id" element={<DashboardPage />} />
              </Routes>
            </main>
          </BrowserRouter>
        </DatasetProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
