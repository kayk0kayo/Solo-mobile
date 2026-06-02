import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { Sword, Compass, Shield, Hexagon, ShoppingCart, Target, HeartOff, Gem, Skull, Crown } from 'lucide-react';
import { Status } from './Status';
import { Inventory } from './Inventory';
import { Shop } from './Shop';
import { Upgrades } from './Upgrades';
import { ClassRoll } from './ClassRoll';
import { Portals } from './Portals';
import { Battle } from './Battle';
import { Training } from './Training';
import { Monster } from '../types';

export const Layout = () => {
  const { state } = useGame();
  const [activeTab, setActiveTab] = useState('Status');
  const [battleEnemy, setBattleEnemy] = useState<{ monster: Monster, portalIsRed: boolean, isTraining?: boolean } | null>(null);

  if (battleEnemy) {
    return <Battle enemy={battleEnemy.monster} portalIsRed={battleEnemy.portalIsRed} isTraining={battleEnemy.isTraining} onLeave={() => setBattleEnemy(null)} />;
  }

  const TABS = ['Status', 'Inventário', 'Treinamento', 'Portais', 'Classes', 'Loja', 'Melhorias'];

  const renderTab = () => {
    switch (activeTab) {
      case 'Status': return <Status />;
      case 'Inventário': return <Inventory />;
      case 'Treinamento': return <Training onEnterBattle={(m, red) => setBattleEnemy({ monster: m, portalIsRed: red, isTraining: true })} />;
      case 'Portais': return <Portals onEnterPortal={(m, red) => setBattleEnemy({ monster: m, portalIsRed: red })} />;
      case 'Classes': return <ClassRoll />;
      case 'Loja': return <Shop />;
      case 'Melhorias': return <Upgrades />;
      default: return <Status />;
    }
  };

  return (
    <div className="flex flex-row h-[100dvh] w-full bg-black text-white font-sans select-none overflow-hidden image-pixelated">
      
      {/* Sidebar Navigation */}
      <div className="flex-none flex flex-col w-[140px] sm:w-[180px] md:w-[220px] bg-[#111] border-r-4 border-[#333] z-10 pixel-box">
          <div className="p-3 border-b-4 border-white flex flex-col gap-2 shrink-0 bg-black">
            <div className="flex gap-2 items-center">
                <div className="w-10 h-10 bg-black border-4 border-white flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-[2px_2px_0_rgba(255,255,255,1)]">
                   {state.level}
                </div>
                <div className="overflow-hidden">
                   <h1 className="text-[11px] font-black uppercase tracking-widest text-white truncate drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                     Rank {state.rank}
                   </h1>
                   <div className="text-[9px] text-gray-400 truncate uppercase tracking-widest mt-0.5">
                     {state.playerClass ? state.playerClass.name : 'SEM CLASSE'}
                   </div>
                </div>
            </div>
            <div className="flex flex-col text-[10px] gap-1 mt-1 font-mono">
               <span className="text-yellow-500 font-bold flex items-center gap-1"><Gem size={10}/>{state.gold}</span>
               <span className="text-blue-400 font-bold flex items-center gap-1"><Hexagon size={10}/>{state.manaCrystals}</span>
            </div>
         </div>
         
         <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col p-2 gap-1 font-mono">
             {TABS.map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`relative p-3 text-left transition-none text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider
                            ${activeTab === tab ? 'bg-white text-black border-4 border-white pixel-box text-glow-active' : 'border-4 border-transparent text-gray-500 hover:bg-[#222] hover:text-white hover:border-gray-600'}`}
               >
                 <span className="block">{tab}</span>
               </button>
             ))}
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto p-2 sm:p-4 custom-scrollbar relative z-0 bg-[#0a0a0a]">
          <div className="h-full relative z-10 w-full max-w-5xl mx-auto flex flex-col">
              {renderTab()}
          </div>
      </div>
    </div>
  );
};
