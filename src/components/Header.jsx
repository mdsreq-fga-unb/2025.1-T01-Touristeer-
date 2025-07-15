import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Globe, Map, Plus, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Header = ({ currentView, setCurrentView }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();

  const handleNavigation = (path, view) => {
    navigate(path);
    setCurrentView(view);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e Título */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Map className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              {t('appTitle')}
            </h1>
          </div>

          {/* Navegação */}
          <nav className="hidden md:flex items-center space-x-4">
            <Button
              variant={isActive('/routes') ? 'default' : 'ghost'}
              onClick={() => handleNavigation('/routes', 'routes')}
              className="flex items-center space-x-2"
            >
              <Map className="h-4 w-4" />
              <span>{t('routes')}</span>
            </Button>

            <Button
              variant={isActive('/create-route') ? 'default' : 'ghost'}
              onClick={() => handleNavigation('/create-route', 'create')}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>{t('createRoute')}</span>
            </Button>

            <Button
              variant={isActive('/tourist-spots') ? 'default' : 'ghost'}
              onClick={() => handleNavigation('/tourist-spots', 'spots')}
              className="flex items-center space-x-2"
            >
              <MapPin className="h-4 w-4" />
              <span>{t('touristSpots')}</span>
            </Button>
          </nav>

          {/* Seletor de Idioma */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-2"
            >
              <Globe className="h-4 w-4" />
              <span className="font-medium">{language}</span>
            </Button>
          </div>
        </div>

        {/* Navegação Mobile */}
        <nav className="md:hidden mt-4 flex justify-center space-x-2">
          <Button
            variant={isActive('/routes') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleNavigation('/routes', 'routes')}
            className="flex items-center space-x-1"
          >
            <Map className="h-4 w-4" />
            <span className="text-xs">{t('routes')}</span>
          </Button>

          <Button
            variant={isActive('/create-route') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleNavigation('/create-route', 'create')}
            className="flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span className="text-xs">{t('createRoute')}</span>
          </Button>

          <Button
            variant={isActive('/tourist-spots') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleNavigation('/tourist-spots', 'spots')}
            className="flex items-center space-x-1"
          >
            <MapPin className="h-4 w-4" />
            <span className="text-xs">{t('touristSpots')}</span>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;


