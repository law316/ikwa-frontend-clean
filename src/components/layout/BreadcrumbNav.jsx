import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BreadcrumbNav = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const getBreadcrumbName = (path) => {
    const nameMap = {
      'catalog': 'Catalog',
      'product': 'Product Details',
      'cart': 'Shopping Cart',
      'checkout': 'Checkout',
      'account': 'My Account',
      'orders': 'Order History',
      'wishlist': 'Wishlist',
      'personal-info': 'Personal Information',
      'about': 'About Us',
      'blog': 'Blog',
      'careers': 'Careers',
      'contact': 'Contact Us',
      'faq': 'FAQ',
      'size-guide': 'Size Guide',
      'return-policy': 'Return Policy'
    };

    return nameMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <nav className="bg-amber-50 py-3 px-4">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link to="/" className="text-amber-600 hover:text-amber-700">
              Home
            </Link>
          </li>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;

            return (
              <li key={to} className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                {isLast ? (
                  <span className="text-gray-600">{getBreadcrumbName(value)}</span>
                ) : (
                  <Link to={to} className="text-amber-600 hover:text-amber-700">
                    {getBreadcrumbName(value)}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default BreadcrumbNav; 