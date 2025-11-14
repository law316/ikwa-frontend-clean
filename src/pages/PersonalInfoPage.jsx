import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import Heading from '../components/typography/Heading';
import Text from '../components/typography/Text';
import Button from '../components/buttons/Button';
import Spinner from '../components/loaders/Spinner';
import Input from '../components/forms/Input';
import { productService, normalizeProducts } from '../services/api';

const PersonalInfoPage = () => {
  const { user, isAuthenticated, updateProfile } = useUser();
  const { addToCart, isLoading: isCartLoading, items, itemCount, total } = useCart();
  const navigate = useNavigate();
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);
  const [profileProducts, setProfileProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  

  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const apiProducts = await productService.getProducts();
        const normalized = normalizeProducts(apiProducts?.data || apiProducts || []);
        setProfileProducts(normalized.slice(0, 12));
      } catch (error) {
        console.error('Failed to load products for profile page:', error);
        toast.error('Failed to load products');
        setProfileProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
    setAvatarUrl(user?.avatar || '');
  }, [user]);

  

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please select an image file');
    if (file.size > 5 * 1024 * 1024) return toast.error('Image size should be less than 5MB');
    setAvatarLoading(true);
    try {
      const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const dataUrl = await toBase64(file);
      await updateProfile({ avatar: dataUrl });
      toast.success('Profile picture updated successfully');
    } catch {
      toast.error('Failed to update profile picture');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleAvatarUrlSave = async () => {
    if (!avatarUrl) {
      toast.error('Please enter a valid avatar URL');
      return;
    }
    setAvatarLoading(true);
    try {
      await updateProfile({ avatar: avatarUrl });
      toast.success('Avatar updated');
    } catch {
      toast.error('Failed to update avatar');
    } finally {
      setAvatarLoading(false);
    }
  };

  

  const handleGetProduct = async (product) => {
    if (!isAuthenticated) {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: Array.isArray(product.sizes) ? product.sizes[0] : product.size || 'M',
        color: product.color || 'Default',
        era: product.era,
        quantity: 1
      };
      try { localStorage.setItem('pendingCartItem', JSON.stringify(cartItem)); } catch {}
      toast.error('Please log in to add items to your cart');
      navigate('/login', { state: { returnTo: '/account/personal-info' } });
      return;
    }

    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: Array.isArray(product.sizes) ? product.sizes[0] : product.size,
        color: product.color || 'Default',
        era: product.era,
        quantity: 1
      };
      await addToCart(cartItem);
      navigate('/payment');
    } catch (error) {
      toast.error('Failed to proceed to payment');
    }
  };

  // Activity Summary is stubbed for now
  const handleActivityRefresh = async () => {
    setActivityLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Activity refreshed');
    } catch {
      toast.error('Failed to refresh activity');
    } finally {
      setActivityLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Summary Card */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
              <img
                src={user?.avatar || '/images/avatars/default.jpg'}
                alt={user?.firstName || 'Profile'}
                className="w-full h-full object-cover"
              />
              {avatarLoading && <Spinner size="sm" className="absolute inset-0 m-auto" />}
            </div>
            <label htmlFor="avatar" className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full cursor-pointer hover:bg-gray-900 transition-colors duration-300">
              <Camera className="h-4 w-4" />
              <input type="file" id="avatar" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          <div>
            <Heading level={2}>{user?.firstName} {user?.lastName}</Heading>
            <Text variant="small">{user?.email}</Text>
            <div className="flex gap-4 mt-2">
              <Text variant="small">Orders: {user?.stats?.orders ?? 0}</Text>
              <Text variant="small">Wishlist: {user?.stats?.wishlist ?? 0}</Text>
              <Text variant="small">Reviews: {user?.stats?.reviews ?? 0}</Text>
            </div>
            <div className="mt-4">
              <Link to="/account/edit-profile">
                <Button className="!bg-black !text-white hover:!bg-black/90">Edit Profile</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Heading level={3}>Cart</Heading>
            <Text variant="small">{(itemCount ?? 0)} items · ${Number(total ?? 0).toFixed(2)}</Text>
          </div>
          {Array.isArray(items) && items.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {items.slice(0, 3).map((item) => (
                <div key={item.cartId || item.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                    <div>
                      <div className="text-brown-darkest text-sm line-clamp-1">{item.name}</div>
                      <div className="text-gray-600 text-sm">Qty {item.quantity} · ${Number(item.price).toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="text-brown-darkest font-medium">${(Number(item.price) * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          ) : (
            <Text variant="small" className="text-gray-600">Your cart is empty.</Text>
          )}
          <div className="flex justify-end">
            <Link to="/cart">
              <Button variant="secondary">See more</Button>
            </Link>
          </div>
        </div>

        {/* Edit Profile CTA moved sections */}
        <div className="hidden bg-white rounded-xl border-2 border-gray-200 p-6 space-y-2">
          <Heading level={3}>Profile Settings</Heading>
          <Text variant="small">Manage your personal info, security, addresses and preferences.</Text>
          <div className="flex justify-end">
            <Link to="/account/edit-profile">
              <Button className="!bg-black !text-white hover:!bg-black/90">Open Edit Profile</Button>
            </Link>
          </div>
        </div>

        {/* Get the Product You Want */}
        <div className="hidden bg-white rounded-xl border-2 border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Heading level={3}>Get the product you want</Heading>
          </div>
          <Text variant="small">Click a product to add it to your cart and go straight to payment.</Text>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {productsLoading ? (
              <div className="flex items-center justify-center py-6"><Spinner size="sm" /></div>
            ) : profileProducts.length > 0 ? (
              profileProducts.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center justify-between border-2 border-amber-200 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded" />
                    <div>
                      <div className="text-amber-900 font-mono text-sm line-clamp-1">{p.name}</div>
                      <div className="text-amber-700 text-sm">${p.price.toFixed(2)}</div>
                    </div>
                  </div>
                  <Button onClick={() => handleGetProduct(p)} disabled={isCartLoading || p.inStock === false}>
                    {isCartLoading ? <Spinner size="sm" /> : 'Get it'}
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-700 py-4">No products available</div>
            )}
          </div>
          <div className="flex justify-end">
            <Link to="/payment">
              <Button variant="secondary">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>

        {/* Activity Summary Section (Stub) */}
        <div className="hidden bg-white rounded-xl border-2 border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Heading level={3}>Activity Summary</Heading>
            <Button variant="secondary" size="sm" onClick={handleActivityRefresh} disabled={activityLoading}>
              {activityLoading ? <Spinner size="sm" /> : 'Refresh'}
            </Button>
          </div>
          <Text variant="small">Recent activity and stats will appear here.</Text>
        </div>

        {/* Avatar URL Update */}
        <div className="hidden bg-white rounded-xl border-2 border-gray-200 p-6 space-y-4">
          <Heading level={3}>Update Avatar via URL</Heading>
          <Text variant="small">Paste an image URL to update your profile picture.</Text>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Avatar URL"
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              type="url"
            />
            <div className="flex items-end">
              <Button onClick={handleAvatarUrlSave} disabled={avatarLoading}>
                {avatarLoading ? <Spinner size="sm" /> : 'Save Avatar'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoPage;