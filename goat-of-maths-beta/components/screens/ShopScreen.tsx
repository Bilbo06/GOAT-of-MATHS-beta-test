import React, { useState, useEffect } from 'react';
import { ShopItem, UserData, ShopItemType } from '../../types';
import { SHOP_ITEMS } from '../../constants';

interface ShopScreenProps {
  userData: UserData;
  onBuyItem: (itemId: string, price: number) => void;
  onEquipAvatar: (avatarId: string) => void;
  onEquipTheme: (themeId: string) => void;
  onEquipAvatarFrame: (frameId: string) => void;
  onEquipProfileBanner: (bannerId: string) => void;
  onPreviewTheme: (themeId: string | null) => void;
}

const itemTypeStyles: Record<ShopItemType, { bg: string; text: string }> = {
  Avatar: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-600 dark:text-blue-300' },
  Boost: { bg: 'bg-violet-100 dark:bg-violet-900/50', text: 'text-violet-600 dark:text-violet-300' },
  Décoration: { bg: 'bg-pink-100 dark:bg-pink-900/50', text: 'text-pink-600 dark:text-pink-300' },
  Theme: { bg: 'bg-teal-100 dark:bg-teal-900/50', text: 'text-teal-600 dark:text-teal-300' },
  AvatarFrame: { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-600 dark:text-amber-300' },
  ProfileBanner: { bg: 'bg-indigo-100 dark:bg-indigo-900/50', text: 'text-indigo-600 dark:text-indigo-300' },
};

const ShopItemCard: React.FC<{ 
  item: ShopItem; 
  userData: UserData; 
  onBuy: () => void; 
  onEquip: () => void;
  onEquipTheme: (themeId: string) => void;
  onEquipAvatarFrame: (frameId: string) => void;
  onEquipProfileBanner: (bannerId: string) => void;
  onPreviewTheme: (themeId: string | null) => void;
}> = ({ item, userData, onBuy, onEquip, onEquipTheme, onEquipAvatarFrame, onEquipProfileBanner, onPreviewTheme }) => {
  const hasPurchased = userData.ownedItems.includes(item.id);
  const canAfford = userData.coins >= item.price;
  
  const getButton = () => {
    if (hasPurchased) {
      if (item.type === 'Avatar') {
        if (userData.avatarId === item.id) {
          return (
            <button disabled className="w-full mt-auto px-4 py-3 rounded-lg font-bold transition-colors bg-green-500 text-white cursor-not-allowed">
              ✓ Équipé
            </button>
          );
        }
        return (
          <button onClick={onEquip} className="w-full mt-auto px-4 py-3 rounded-lg text-white font-bold transition-colors bg-primary hover:bg-primary-hover">
            Équiper
          </button>
        );
      }
      if (item.type === 'AvatarFrame') {
        if (userData.equippedAvatarFrameId === item.id) {
            return <button disabled className="w-full mt-auto px-4 py-3 rounded-lg font-bold bg-green-500 text-white cursor-not-allowed">✓ Équipé</button>;
        }
        return <button onClick={() => onEquipAvatarFrame(item.id)} className="w-full mt-auto px-4 py-3 rounded-lg text-white font-bold bg-primary hover:bg-primary-hover">Équiper</button>;
      }
      if (item.type === 'ProfileBanner') {
        if (userData.equippedProfileBannerId === item.id) {
            return <button disabled className="w-full mt-auto px-4 py-3 rounded-lg font-bold bg-green-500 text-white cursor-not-allowed">✓ Équipé</button>;
        }
        return <button onClick={() => onEquipProfileBanner(item.id)} className="w-full mt-auto px-4 py-3 rounded-lg text-white font-bold bg-primary hover:bg-primary-hover">Équiper</button>;
      }
      return (
        <button disabled className="w-full mt-auto px-4 py-3 rounded-lg font-bold transition-colors text-primary bg-primary/10 cursor-not-allowed">
          ✓ Possédé
        </button>
      );
    }
    if (canAfford) {
      return (
        <button onClick={onBuy} className="w-full mt-auto px-4 py-3 rounded-lg text-white font-bold transition-colors bg-green-500 hover:bg-green-600">
          Acheter
        </button>
      );
    }
    return (
        <button disabled className="w-full mt-auto px-4 py-3 rounded-lg font-bold transition-colors text-text-muted-light dark:text-text-muted-dark bg-slate-200 dark:bg-slate-700 cursor-not-allowed">
          Trop cher
        </button>
    );
  };

  const getButtonsForTheme = () => {
    if (hasPurchased) {
        if (userData.equippedThemeId === item.themeId) {
            return (
                <button disabled className="w-full mt-auto px-4 py-3 rounded-lg font-bold bg-green-500 text-white cursor-not-allowed">
                    ✓ Appliqué
                </button>
            );
        }
        return (
            <button onClick={() => item.themeId && onEquipTheme(item.themeId)} className="w-full mt-auto px-4 py-3 rounded-lg text-white font-bold bg-primary hover:bg-primary-hover">
                Appliquer
            </button>
        );
    }
    return (
        <div className="flex gap-2 mt-auto">
            <button onClick={() => item.themeId && onPreviewTheme(item.themeId)} className="w-full px-4 py-3 rounded-lg font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300">
                Aperçu
            </button>
            <button onClick={onBuy} disabled={!canAfford} className="w-full px-4 py-3 rounded-lg text-white font-bold bg-green-500 hover:bg-green-600 disabled:bg-slate-400">
                Acheter
            </button>
        </div>
    );
  };


  const priceColor = canAfford ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400';
  const typeStyle = itemTypeStyles[item.type];

  return (
    <div className="relative bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl shadow-sm p-5 flex flex-col text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className={`absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded-full ${typeStyle.bg} ${typeStyle.text}`}>
        {item.type}
      </div>
      <div className="text-7xl my-4 flex-shrink-0">{item.icon}</div>
      <div className="flex flex-col flex-grow">
          <h3 className="font-bold text-lg text-text-light dark:text-text-dark">{item.name}</h3>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark flex-grow my-2">{item.description}</p>
          <p className={`text-2xl font-extrabold my-4 ${priceColor}`}>
            🪙 {item.price}
          </p>
          {item.type === 'Theme' ? getButtonsForTheme() : getButton()}
      </div>
    </div>
  );
};

const filterCategories: { name: string, type: ShopItemType | 'Tous' }[] = [
    { name: 'Tous', type: 'Tous' },
    { name: 'Avatars', type: 'Avatar' },
    { name: 'Bannières', type: 'ProfileBanner' },
    { name: 'Cadres', type: 'AvatarFrame' },
    { name: 'Thèmes', type: 'Theme' },
    { name: 'Boosts', type: 'Boost' },
];

export const ShopScreen: React.FC<ShopScreenProps> = ({ userData, onBuyItem, onEquipAvatar, onEquipTheme, onEquipAvatarFrame, onEquipProfileBanner, onPreviewTheme }) => {
  const [activeFilter, setActiveFilter] = useState<ShopItemType | 'Tous'>('Tous');
  
  const handleBuy = (item: ShopItem) => {
    if (window.confirm(`Voulez-vous vraiment acheter "${item.name}" pour 🪙 ${item.price} ?`)) {
      onBuyItem(item.id, item.price);
    }
  };
  
  useEffect(() => {
    return () => {
      onPreviewTheme(null);
    }
  }, [onPreviewTheme]);

  const filteredItems = activeFilter === 'Tous'
    ? SHOP_ITEMS
    : SHOP_ITEMS.filter(item => item.type === activeFilter);

  return (
    <div className="p-4 md:p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-text-light dark:text-text-dark">🛒 Boutique</h2>
        <p className="text-md text-text-muted-light dark:text-text-muted-dark mt-1">Dépense tes MathCoins !</p>
        <div className="inline-block mt-4 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold text-lg">
          Ton solde : 🪙 {userData.coins}
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {filterCategories.map(({name, type}) => (
          <button 
            key={type}
            onClick={() => setActiveFilter(type)}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                activeFilter === type
                ? 'bg-primary text-white'
                : 'bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredItems.map((item) => (
          <ShopItemCard
            key={item.id}
            item={item}
            userData={userData}
            onBuy={() => handleBuy(item)}
            onEquip={() => onEquipAvatar(item.id)}
            onEquipTheme={onEquipTheme}
            onEquipAvatarFrame={onEquipAvatarFrame}
            onEquipProfileBanner={onEquipProfileBanner}
            onPreviewTheme={onPreviewTheme}
          />
        ))}
      </div>
    </div>
  );
};
