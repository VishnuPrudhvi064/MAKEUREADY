import React from 'react';

export const Avatar = ({ user, size = 42, style = {} }) => {
  if (!user) return null;

  const hasRealImage = user.profileImage && !user.profileImage.includes('ui-avatars.com');

  if (hasRealImage) {
    return (
      <img 
        src={user.profileImage} 
        alt={user.name} 
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid var(--primary-color)',
          flexShrink: 0,
          ...style
        }} 
      />
    );
  }

  const name = user.name || 'User';
  const initials = name
    .split(' ')
    .filter(n => n.length > 0)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: 'var(--accent-secondary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--primary-color)',
      fontWeight: 'bold',
      fontSize: `${size * 0.4}px`,
      border: '2px solid var(--primary-color)',
      flexShrink: 0,
      ...style
    }}>
      {initials}
    </div>
  );
};
