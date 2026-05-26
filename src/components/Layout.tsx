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
import { Monster } from '../types';

export const Layout = () => {
  const { state } = useGame();
  const [activeTab, setActiveTab] = useState('Status');
  const [battleEnemy, setBattleEnemy] = useState<{ monster: Monster, portalIsRed: boolean } | null>(null);

  if (battleEnemy) {
    return <Battle enemy={battleEnemy.monster} portalIsRed={battleEnemy.portalIsRed} onLeave={() => setBattleEnemy(null)} />;
  }

  const TABS = ['Status', 'Inventário', 'Portais', 'Classes', 'Loja', 'Melhorias'];

  const renderTab = () => {
    switch (activeTab) {
      case 'Status': return <Status />;
      case 'Inventário': return <Inventory />;
      case 'Portais': return <Portals onEnterPortal={(m, red) => setBattleEnemy({ monster: m, portalIsRed: red })} />;
      case 'Classes': return <ClassRoll />;
      case 'Loja': return <Shop />;
      case 'Melhorias': return <Upgrades />;
      default: return <Status />;
    }
  };

  return (
    <div className="flex flex-row h-[100dvh] w-full bg-[#111115] text-[#d0d0c0] font-mono select-none overflow-hidden" 
         style={{ backgroundImage: 'radial-gradient(circle at center, #1a1a24 0%, #0a0a0f 100%)' }}>
      
      {/* Sidebar Navigation */}
      <div className="flex-none flex flex-col w-[140px] sm:w-[180px] md:w-[220px] bg-[#0a0a0f] border-r-4 border-[#2b2b36] shadow-md shadow-black z-10">
         <div className="p-2 border-b-4 border-[#2b2b36] flex flex-col gap-2 shrink-0">
            <div className="flex gap-2 items-center">
                <div className="w-10 h-10 bg-[#1a1a24] border-2 border-[#4b4b56] flex items-center justify-center font-bold text-sm text-purple-400 shrink-0"
                     style={{ boxShadow: 'inset 2px 2px 0px rgba(255,255,255,0.1), inset -2px -2px 0px rgba(0,0,0,0.5)' }}>
                   {state.level}
                </div>
                <div className="overflow-hidden">
                   <h1 className="text-[10px] font-bold uppercase tracking-wide text-red-500 truncate">
                     Rank {state.rank}
                   </h1>
                   <div className="text-[8px] text-gray-400 truncate">
                     {state.playerClass ? state.playerClass.name : 'Sem Classe'}
                   </div>
                </div>
            </div>
            <div className="flex flex-col text-[8px] sm:text-[10px] gap-1">
               <span className="text-yellow-500 font-bold flex items-center gap-1"><Gem size={10}/>{state.gold}</span>
               <span className="text-cyan-400 font-bold flex items-center gap-1"><Hexagon size={10}/>{state.manaCrystals}</span>
            </div>
         </div>
         
         <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col">
             {TABS.map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`p-3 text-left border-l-4 transition-colors text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider
                            ${activeTab === tab ? 'bg-[#2b2b36] text-white border-purple-500' : 'border-transparent text-gray-500 hover:bg-[#1a1a24] hover:text-gray-300'}`}
               >
                 {tab}
               </button>
             ))}
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto p-2 sm:p-4 custom-scrollbar relative z-0">
          <div className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay"
               style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }}>
          </div>
          <div className="h-full relative z-10 w-full max-w-5xl mx-auto flex flex-col">
              {renderTab()}
          </div>
      </div>
    </div>
  );
};
