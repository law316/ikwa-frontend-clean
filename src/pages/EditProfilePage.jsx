import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useUser } from '../contexts/UserContext';
import Heading from '../components/typography/Heading';
import Text from '../components/typography/Text';
import Button from '../components/buttons/Button';
import Input from '../components/forms/Input';
import Spinner from '../components/loaders/Spinner';

const EditProfilePage = () => {
  const { user, updateProfile, updatePreferences } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    language: 'en',
    country: 'US',
    bio: '',
  });
  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: true,
    language: 'en',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        language: user.language || 'en',
        country: user.country || 'US',
        bio: user.bio || '',
      });
      setPreferences({
        theme: user.preferences?.theme || 'light',
        notifications: user.preferences?.notifications ?? true,
        language: user.preferences?.language || 'en',
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handlePrefChange = (field, value) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      // handled upstream
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setPasswordLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      toast.error('Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePreferencesSave = async () => {
    setIsLoading(true);
    try {
      await updatePreferences(preferences);
      toast.success('Preferences updated');
    } catch {
      toast.error('Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSave = async () => {
    setAddressLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Address updated');
    } catch {
      toast.error('Failed to update address');
    } finally {
      setAddressLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Personal Info Section */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-6">
          <Heading level={3}>Personal Information</Heading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="First Name"
              id="firstName"
              value={formData.firstName}
              onChange={e => handleInputChange('firstName', e.target.value)}
              error={errors.firstName}
              required
            />
            <Input
              label="Last Name"
              id="lastName"
              value={formData.lastName}
              onChange={e => handleInputChange('lastName', e.target.value)}
              error={errors.lastName}
              required
            />
            <Input
              label="Email"
              id="email"
              type="email"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              error={errors.email}
              required
            />
            <Input
              label="Phone"
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
              error={errors.phone}
              required
            />
            <div>
              <label htmlFor="language" className="block mb-2 font-medium text-brown-darkest">Language</label>
              <select
                id="language"
                value={formData.language}
                onChange={e => handleInputChange('language', e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 border-gray-medium focus:border-brown-medium focus:ring-brown-light/30 bg-white"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div>
              <label htmlFor="country" className="block mb-2 font-medium text-brown-darkest">Country</label>
              <select
                id="country"
                value={formData.country}
                onChange={e => handleInputChange('country', e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 border-gray-medium focus:border-brown-medium focus:ring-brown-light/30 bg-white"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Bio"
                id="bio"
                value={formData.bio}
                onChange={e => handleInputChange('bio', e.target.value)}
                type="text"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Spinner size="sm" /> : 'Save Changes'}
            </Button>
          </div>
        </form>

        {/* Account Security Section */}
        <form onSubmit={handlePasswordChange} className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-6">
          <Heading level={3}>Account Security</Heading>
          <Input
            label="Current Password"
            id="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            required
          />
          <Input
            label="New Password"
            id="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            required
          />
          <Input
            label="Confirm New Password"
            id="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            required
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={passwordLoading}>
              {passwordLoading ? <Spinner size="sm" /> : 'Change Password'}
            </Button>
          </div>
        </form>

        {/* Address Book Section */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-6">
          <Heading level={3}>Address Book</Heading>
          <Text variant="small">Manage your shipping and billing addresses.</Text>
          <Input label="Address Line 1" id="address1" value={user?.address1 || ''} onChange={() => {}} disabled />
          <Input label="Address Line 2" id="address2" value={user?.address2 || ''} onChange={() => {}} disabled />
          <Input label="City" id="city" value={user?.city || ''} onChange={() => {}} disabled />
          <Input label="State" id="state" value={user?.state || ''} onChange={() => {}} disabled />
          <Input label="Postal Code" id="postalCode" value={user?.postalCode || ''} onChange={() => {}} disabled />
          <div className="flex justify-end">
            <Button onClick={handleAddressSave} disabled={addressLoading}>
              {addressLoading ? <Spinner size="sm" /> : 'Save Address'}
            </Button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-6">
          <Heading level={3}>Preferences</Heading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="theme" className="block mb-2 font-medium text-brown-darkest">Theme</label>
              <select
                id="theme"
                value={preferences.theme}
                onChange={e => handlePrefChange('theme', e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 border-gray-medium focus:border-brown-medium focus:ring-brown-light/30 bg-white"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label htmlFor="notifications" className="block mb-2 font-medium text-brown-darkest">Notifications</label>
              <select
                id="notifications"
                value={preferences.notifications ? 'on' : 'off'}
                onChange={e => handlePrefChange('notifications', e.target.value === 'on')}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 border-gray-medium focus:border-brown-medium focus:ring-brown-light/30 bg-white"
              >
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </div>
            <div>
              <label htmlFor="pref-language" className="block mb-2 font-medium text-brown-darkest">Language</label>
              <select
                id="pref-language"
                value={preferences.language}
                onChange={e => handlePrefChange('language', e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 border-gray-medium focus:border-brown-medium focus:ring-brown-light/30 bg-white"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handlePreferencesSave} disabled={isLoading}>
              {isLoading ? <Spinner size="sm" /> : 'Save Preferences'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;


