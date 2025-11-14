import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';

const Breadcrumbs = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const { user } = useUser();

  const getPrimaryName = () =>
    user?.firstName ||
    user?.firstname ||
    user?.name ||
    user?.username ||
    (user?.email ? user.email.split('@')[0] : null);

  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join('/')}`;
      let label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      if (path === 'account') {
        const primaryName = getPrimaryName();
        label = primaryName || 'Account';
      }

      return { url, label };
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <nav
      className={`py-4 px-4 sm:px-6 lg:px-8 ${
        theme === 'light' ? 'bg-amber-100' : 'bg-gray-800'
      }`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link
            to="/"
            className={`flex items-center hover:text-amber-600 transition-colors duration-300 ${
              theme === 'light' ? 'text-amber-900' : 'text-amber-200'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.url} className="flex items-center">
            <ChevronRight
              className={`w-4 h-4 ${
                theme === 'light' ? 'text-amber-600' : 'text-amber-400'
              }`}
            />
            {index === breadcrumbs.length - 1 ? (
              <span
                className={`ml-2 font-medium ${
                  theme === 'light' ? 'text-amber-900' : 'text-amber-200'
                }`}
              >
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                to={breadcrumb.url}
                className={`ml-2 hover:text-amber-600 transition-colors duration-300 ${
                  theme === 'light' ? 'text-amber-900' : 'text-amber-200'
                }`}
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs; 