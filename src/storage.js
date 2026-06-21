export const MOCK_ARTISTS = [
  {
    id: 'a1', role: 'ARTIST', name: 'Priya Sharma', email: 'priya@example.com', password: 'password123',
    bio: 'Award-winning bridal makeup artist specializing in HD and Airbrush makeup. 10+ years of experience in Delhi NCR.',
    location: 'South Delhi', experience_years: 10, average_rating: 4.9, reviews_count: 124, specialty: 'HD Makeup',
    profileImage: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=d4af37&color=fff&size=400'
  },
  {
    id: 'a2', role: 'ARTIST', name: 'Meera Rajput', email: 'meera@example.com', password: 'password123',
    bio: 'Contemporary bridal looks with a focus on natural, glowing skin. Destination wedding expert.',
    location: 'Gurgaon', experience_years: 6, average_rating: 4.7, reviews_count: 89, specialty: 'Airbrush',
    profileImage: 'https://ui-avatars.com/api/?name=Meera+Rajput&background=f8c8dc&color=333&size=400'
  },
  {
    id: 'a3', role: 'ARTIST', name: 'Zoya Khan', email: 'zoya@example.com', password: 'password123',
    bio: 'Expert in traditional Nikah styling and dramatic eye makeup.',
    location: 'Noida', experience_years: 8, average_rating: 4.8, reviews_count: 156, specialty: 'Muslim Bridal',
    profileImage: 'https://ui-avatars.com/api/?name=Zoya+Khan&background=2c3e50&color=fff&size=400'
  },
  {
    id: 'a4', role: 'ARTIST', name: 'Anjali Verma', email: 'anjali@example.com', password: 'password123',
    bio: 'Renowned Mehendi Artist with intricate Marwari and Arabic designs.',
    location: 'West Delhi', experience_years: 12, average_rating: 4.9, reviews_count: 210, specialty: 'Mehendi',
    profileImage: 'https://ui-avatars.com/api/?name=Anjali+Verma&background=27ae60&color=fff&size=400'
  },
  {
    id: 'a5', role: 'ARTIST', name: 'Ritu Singh', email: 'ritu@example.com', password: 'password123',
    bio: 'Specialist in South Indian bridal draping and floral hair arrangements.',
    location: 'Central Delhi', experience_years: 9, average_rating: 4.6, reviews_count: 78, specialty: 'South Indian Bridal',
    profileImage: 'https://ui-avatars.com/api/?name=Ritu+Singh&background=8e44ad&color=fff&size=400'
  },
  {
    id: 'a6', role: 'ARTIST', name: 'Sonal Desai', email: 'sonal@example.com', password: 'password123',
    bio: 'Premium Hair Stylist. Hollywood waves, classic buns, and modern messy braids.',
    location: 'Vasant Vihar', experience_years: 5, average_rating: 4.5, reviews_count: 45, specialty: 'Hair Styling',
    profileImage: 'https://ui-avatars.com/api/?name=Sonal+Desai&background=e67e22&color=fff&size=400'
  },
  {
    id: 'a7', role: 'ARTIST', name: 'Neha Gupta', email: 'neha@example.com', password: 'password123',
    bio: 'Luxury Nail Artist. Acrylic extensions, 3D art, and gel polishing for the perfect ring photo.',
    location: 'Gurgaon', experience_years: 4, average_rating: 4.8, reviews_count: 112, specialty: 'Nail Art',
    profileImage: 'https://ui-avatars.com/api/?name=Neha+Gupta&background=e74c3c&color=fff&size=400'
  },
  {
    id: 'a8', role: 'ARTIST', name: 'Kavita Reddy', email: 'kavita@example.com', password: 'password123',
    bio: 'Soft glam and party makeup expert for Sangeet and Reception nights.',
    location: 'Faridabad', experience_years: 7, average_rating: 4.7, reviews_count: 92, specialty: 'Party Makeup',
    profileImage: 'https://ui-avatars.com/api/?name=Kavita+Reddy&background=16a085&color=fff&size=400'
  },
  {
    id: 'a9', role: 'ARTIST', name: 'Alia Bhattacharya', email: 'alia@example.com', password: 'password123',
    bio: 'Bengali bridal styling, traditional bindi art and dramatic Mukut placement.',
    location: 'CR Park', experience_years: 11, average_rating: 4.9, reviews_count: 145, specialty: 'Bengali Bridal',
    profileImage: 'https://ui-avatars.com/api/?name=Alia+Bhattacharya&background=c0392b&color=fff&size=400'
  },
  {
    id: 'a10', role: 'ARTIST', name: 'Simi Chawla', email: 'simi@example.com', password: 'password123',
    bio: 'All-in-one pre-bridal package specialist. Facials, spas, and glowing skin treatments.',
    location: 'Lajpat Nagar', experience_years: 8, average_rating: 4.6, reviews_count: 67, specialty: 'Pre-Bridal',
    profileImage: 'https://ui-avatars.com/api/?name=Simi+Chawla&background=2980b9&color=fff&size=400'
  }
];

export const MOCK_PACKAGES = [
  { id: 'p1', artistId: 'a1', title: 'Signature HD Bridal', description: 'Complete HD makeup for the wedding day.', price: 25000, features: ['HD Makeup', 'Hairstyling', 'Draping'] },
  { id: 'p2', artistId: 'a2', title: 'Airbrush Perfection', description: 'Flawless airbrush makeup that lasts 24 hours.', price: 30000, features: ['Airbrush Makeup', 'Trial Included'] },
  { id: 'p3', artistId: 'a3', title: 'Royal Nikah Look', description: 'Traditional styling with dramatic eyes.', price: 22000, features: ['Eye Focus', 'Hairstyling', 'Jewelry Setting'] },
  { id: 'p4', artistId: 'a4', title: 'Bridal Marwari Mehendi', description: 'Full hands and legs intricate design.', price: 11000, features: ['Organic Henna', 'Intricate Details'] },
  { id: 'p5', artistId: 'a5', title: 'South Indian Draping', description: 'Authentic Kanjeevaram draping and floral braid.', price: 15000, features: ['Draping', 'Poolajada Setting'] },
  { id: 'p6', artistId: 'a6', title: 'Hollywood Waves', description: 'Premium hair styling for Reception.', price: 8000, features: ['Hair extensions', 'Styling'] },
  { id: 'p7', artistId: 'a7', title: 'Bridal Nail Extensions', description: 'Acrylics with custom 3D art.', price: 4000, features: ['Extensions', 'Gel Polish', '3D Art'] },
  { id: 'p8', artistId: 'a8', title: 'Sangeet Soft Glam', description: 'Dance-proof makeup for the Sangeet.', price: 18000, features: ['Waterproof Makeup', 'Light Hair'] },
  { id: 'p9', artistId: 'a9', title: 'Classic Bengali Bride', description: 'Chandan art and traditional draping.', price: 20000, features: ['Chandan Art', 'Draping'] },
  { id: 'p10', artistId: 'a10', title: '1-Month Pre-Bridal', description: 'Weekly facials and body polishing.', price: 35000, features: ['Facials', 'Body Polish', 'Spa'] }
];

export const initMockData = () => {
  const users = localStorage.getItem('users');
  if (!users) {
    const defaultBride = {
      id: 'b1', role: 'BRIDE', name: 'Simran Kaur', email: 'bride@example.com', password: 'password123', phone: '9876543210'
    };
    localStorage.setItem('users', JSON.stringify([defaultBride, ...MOCK_ARTISTS]));
    localStorage.setItem('packages', JSON.stringify(MOCK_PACKAGES));
  } else {
    // Overwrite artists to ensure proper images load for hackathon
    const parsedUsers = JSON.parse(users);
    const bridesAndNewArtists = parsedUsers.filter(u => u.role === 'BRIDE' || (u.role === 'ARTIST' && !u.id.startsWith('a')));
    localStorage.setItem('users', JSON.stringify([...bridesAndNewArtists, ...MOCK_ARTISTS]));
    
    // Ensure packages exist
    if (!localStorage.getItem('packages')) {
      localStorage.setItem('packages', JSON.stringify(MOCK_PACKAGES));
    }
  }
  
  if (!localStorage.getItem('bookings')) {
    localStorage.setItem('bookings', JSON.stringify([]));
  }
};

export const getFromStorage = (key) => JSON.parse(localStorage.getItem(key) || '[]');
export const saveToStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const registerUser = (userData) => {
  const users = getFromStorage('users');
  if (users.find(u => u.email === userData.email)) {
    return { success: false, message: 'Email already registered.' };
  }
  const newUser = {
    ...userData,
    id: userData.role === 'BRIDE' ? 'b_' + Date.now() : 'new_a_' + Date.now(),
    profileImage: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userData.name) + '&background=1a1a1a&color=d4af37&size=400',
    average_rating: 5.0, // New artists get default 5 star rating
    reviews_count: 0,
    specialty: 'Salon & Bridal Makeup', // Default specialty
    location: 'Delhi NCR',
    experience_years: 1,
    bio: 'Professional artist ready to make your day special.',
    portfolio: [],
    blockedDates: [],
    instagram: '',
    isVerified: false
  };
  users.push(newUser);
  saveToStorage('users', users);
  
  const safeUser = { ...newUser };
  delete safeUser.password;
  saveToStorage('currentUser', safeUser);
  return { success: true, user: safeUser };
};

export const loginUser = (email, password) => {
  const users = getFromStorage('users');
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const safeUser = { ...user };
    delete safeUser.password;
    saveToStorage('currentUser', safeUser);
    return safeUser;
  }
  return null;
};

export const logoutUser = () => {
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const updateUser = (userId, updatedData) => {
  const users = getFromStorage('users');
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    const updatedUser = { ...users[index], ...updatedData };
    users[index] = updatedUser;
    saveToStorage('users', users);
    
    // If the updated user is the currently logged-in user, update currentUser too
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const safeUser = { ...updatedUser };
      delete safeUser.password;
      saveToStorage('currentUser', safeUser);
    }
    return true;
  }
  return false;
};

// --- PACKAGES ---
export const addPackage = (packageData) => {
  const packages = getFromStorage('packages');
  const newPackage = {
    ...packageData,
    id: 'pkg_' + Date.now()
  };
  packages.push(newPackage);
  saveToStorage('packages', packages);
  return newPackage;
};

// --- BOOKINGS ---
export const createBooking = (bookingData) => {
  const bookings = getFromStorage('bookings');
  const newBooking = {
    ...bookingData,
    id: 'bk_' + Date.now(),
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };
  bookings.push(newBooking);
  saveToStorage('bookings', bookings);
  return newBooking;
};

export const getBookingsForUser = (userId, role) => {
  const bookings = getFromStorage('bookings');
  if (role === 'BRIDE') return bookings.filter(b => b.brideId === userId);
  else if (role === 'ARTIST') return bookings.filter(b => b.artistId === userId);
  return [];
};

export const updateBookingStatus = (bookingId, status) => {
  const bookings = getFromStorage('bookings');
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index !== -1) {
    bookings[index].status = status;
    saveToStorage('bookings', bookings);
  }
};
