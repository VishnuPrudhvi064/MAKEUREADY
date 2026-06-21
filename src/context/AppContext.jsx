import { createContext, useContext, useState, useEffect } from 'react';
import { initMockData, getFromStorage, saveToStorage } from '../storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [shortlists, setShortlists] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Initialize default mock data if empty
    initMockData();
    if (!localStorage.getItem('shortlists')) saveToStorage('shortlists', []);
    if (!localStorage.getItem('messages')) saveToStorage('messages', []);
    if (!localStorage.getItem('reviews')) saveToStorage('reviews', []);
    if (!localStorage.getItem('notifications')) saveToStorage('notifications', []);

    // Load state from local storage
    setCurrentUser(getFromStorage('currentUser') || null);
    setUsers(getFromStorage('users') || []);
    setPackages(getFromStorage('packages') || []);
    setBookings(getFromStorage('bookings') || []);
    setShortlists(getFromStorage('shortlists') || []);
    setMessages(getFromStorage('messages') || []);
    setReviews(getFromStorage('reviews') || []);
    setNotifications(getFromStorage('notifications') || []);
  }, []);

  // --- HELPER WRAPPER FOR SYNC ---
  const updateStateAndStorage = (key, data, setter) => {
    setter(data);
    saveToStorage(key, data);
  };

  // --- AUTH ---
  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const safeUser = { ...user };
      delete safeUser.password;
      updateStateAndStorage('currentUser', safeUser, setCurrentUser);
      return safeUser;
    }
    return null;
  };

  const register = (userData) => {
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email already registered.' };
    }
    const newUser = {
      ...userData,
      id: userData.role === 'BRIDE' ? 'b_' + Date.now() : 'new_a_' + Date.now(),
      profileImage: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userData.name) + '&background=1a1a1a&color=d4af37&size=400',
      average_rating: 5.0,
      reviews_count: 0,
      specialty: 'Salon & Bridal Makeup',
      location: 'Delhi NCR',
      experience_years: 1,
      bio: 'Professional artist ready to make your day special.',
      portfolio: [],
      blockedDates: [],
      instagram: '',
      isVerified: false,
      createdAt: new Date().toISOString()
    };
    const newUsers = [...users, newUser];
    updateStateAndStorage('users', newUsers, setUsers);
    
    const safeUser = { ...newUser };
    delete safeUser.password;
    updateStateAndStorage('currentUser', safeUser, setCurrentUser);
    return { success: true, user: safeUser };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (userId, updatedData) => {
    const newUsers = users.map(u => u.id === userId ? { ...u, ...updatedData } : u);
    updateStateAndStorage('users', newUsers, setUsers);
    if (currentUser?.id === userId) {
      const safeUser = { ...newUsers.find(u => u.id === userId) };
      delete safeUser.password;
      updateStateAndStorage('currentUser', safeUser, setCurrentUser);
    }
  };

  // --- NOTIFICATIONS ---
  const pushNotification = (userId, message, type = 'info') => {
    const newNotif = {
      id: 'notif_' + Date.now(),
      userId,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    const newNotifs = [newNotif, ...notifications];
    updateStateAndStorage('notifications', newNotifs, setNotifications);
  };

  const markNotificationsAsRead = (userId) => {
    const newNotifs = notifications.map(n => n.userId === userId ? { ...n, read: true } : n);
    updateStateAndStorage('notifications', newNotifs, setNotifications);
  };

  // --- SHORTLISTS ---
  const toggleShortlist = (brideId, artistId) => {
    const exists = shortlists.find(s => s.brideId === brideId && s.artistId === artistId);
    let newShortlists;
    if (exists) {
      newShortlists = shortlists.filter(s => s.id !== exists.id);
    } else {
      newShortlists = [...shortlists, { id: 'sh_' + Date.now(), brideId, artistId }];
      pushNotification(brideId, `You shortlisted a new artist.`, 'success');
    }
    updateStateAndStorage('shortlists', newShortlists, setShortlists);
  };

  // --- BOOKINGS & PAYMENTS ---
  const addBooking = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: 'bk_' + Date.now(),
      status: bookingData.status || 'PENDING_PAYMENT',
      advancePaid: bookingData.advancePaid || 0,
      createdAt: new Date().toISOString()
    };
    const newBookings = [...bookings, newBooking];
    updateStateAndStorage('bookings', newBookings, setBookings);
    
    // Notify artist only if it's already PENDING (e.g., if bypassing payment step)
    if (newBooking.status === 'PENDING') {
      pushNotification(newBooking.artistId, `New booking request from ${newBooking.brideName} for ${newBooking.eventType}.`, 'info');
    }
    return newBooking;
  };

  const updateBookingStatus = (bookingId, status) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    let finalStatus = status;
    let extraData = {};

    // Handle rejection with refund
    if (status === 'REJECTED' && (booking.advancePaid || 0) > 0) {
      finalStatus = 'REFUNDED';
      extraData = { refundDate: new Date().toISOString() };
    }

    const newBookings = bookings.map(b => b.id === bookingId ? { ...b, status: finalStatus, ...extraData } : b);
    updateStateAndStorage('bookings', newBookings, setBookings);

    // Notifications
    if (finalStatus === 'CONFIRMED') {
      pushNotification(booking.brideId, `Your booking for ${booking.eventType} has been confirmed!`, 'success');
    } else if (finalStatus === 'REFUNDED') {
      pushNotification(booking.brideId, `Booking declined by artist. Your advance of ₹${booking.advancePaid?.toLocaleString()} has been refunded.`, 'error');
    } else if (status === 'REJECTED') {
      pushNotification(booking.brideId, `Your booking for ${booking.eventType} was declined.`, 'error');
    } else if (finalStatus === 'COMPLETED') {
      pushNotification(booking.brideId, `Your ${booking.eventType} booking is marked completed. Please leave a review!`, 'success');
      pushNotification(booking.artistId, `Booking for ${booking.eventType} marked as completed.`, 'success');
    } else if (finalStatus === 'CANCELLED') {
      const targetUser = currentUser.id === booking.brideId ? booking.artistId : booking.brideId;
      pushNotification(targetUser, `Booking for ${booking.eventType} has been cancelled.`, 'error');
    }
  };

  const processPayment = (bookingId, transactionId, amount) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    const newBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return { 
          ...b, 
          advancePaid: amount, 
          status: 'PENDING', 
          transactionId, 
          paymentDate: new Date().toISOString() 
        };
      }
      return b;
    });
    updateStateAndStorage('bookings', newBookings, setBookings);
    pushNotification(booking.artistId, `New booking request! Received ₹${amount.toLocaleString()} advance from ${booking.brideName} for ${booking.eventType}.`, 'success');
    pushNotification(booking.brideId, `Payment of ₹${amount.toLocaleString()} successful for ${booking.eventType}. Booking sent to artist for confirmation.`, 'success');
  };

  // --- PACKAGES ---
  const addNewPackage = (packageData) => {
    const newPackage = { ...packageData, id: 'pkg_' + Date.now() };
    const newPackages = [...packages, newPackage];
    updateStateAndStorage('packages', newPackages, setPackages);
  };

  // --- MESSAGES ---
  const sendMessage = (senderId, receiverId, text) => {
    const newMsg = {
      id: 'msg_' + Date.now(),
      senderId,
      receiverId,
      text,
      timestamp: new Date().toISOString(),
      read: false
    };
    const newMessages = [...messages, newMsg];
    updateStateAndStorage('messages', newMessages, setMessages);
    
    // Notify receiver
    const sender = users.find(u => u.id === senderId);
    pushNotification(receiverId, `New message from ${sender?.name || 'someone'}.`, 'info');
  };

  const markMessagesAsRead = (receiverId, senderId) => {
    const newMessages = messages.map(m => 
      (m.receiverId === receiverId && m.senderId === senderId && !m.read) ? { ...m, read: true } : m
    );
    updateStateAndStorage('messages', newMessages, setMessages);
  };

  // --- REVIEWS ---
  const addNewReview = (reviewData) => {
    const newReview = {
      ...reviewData,
      id: 'rev_' + Date.now(),
      timestamp: new Date().toISOString()
    };
    const newReviews = [...reviews, newReview];
    updateStateAndStorage('reviews', newReviews, setReviews);

    // Update Artist Average Rating & Count
    const artistReviews = newReviews.filter(r => r.artistId === reviewData.artistId);
    const avgRating = (artistReviews.reduce((sum, r) => sum + r.rating, 0) / artistReviews.length).toFixed(1);
    
    updateProfile(reviewData.artistId, {
      average_rating: parseFloat(avgRating),
      reviews_count: artistReviews.length
    });

    pushNotification(reviewData.artistId, `You received a new ${reviewData.rating}-star review!`, 'success');
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, packages, bookings, shortlists, messages, reviews, notifications,
      login, register, logout, updateProfile,
      pushNotification, markNotificationsAsRead,
      toggleShortlist,
      addBooking, updateBookingStatus, processPayment,
      addNewPackage,
      sendMessage, markMessagesAsRead,
      addNewReview
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
