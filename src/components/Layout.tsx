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
    <div className="flex flex-row h-[100dvh] w-full bg-[#010915] text-[#c9e0ff] font-sans select-none overflow-hidden" 
         style={{ backgroundImage: 'radial-gradient(circle at center, #021124 0%, #010915 100%)' }}>
      
      {/* Sidebar Navigation */}
      <div className="flex-none flex flex-col w-[140px] sm:w-[180px] md:w-[220px] bg-[#020d1a]/80 backdrop-blur-md border-r border-[#004080] shadow-[0_0_20px_rgba(0,10,20,0.5)] z-10">
         <div className="p-3 border-b border-[#004080] flex flex-col gap-2 shrink-0 bg-gradient-to-b from-[#001732] to-transparent">
            <div className="flex gap-2 items-center">
                <div className="w-10 h-10 bg-[#001c3d] border border-cyan-500/50 flex items-center justify-center font-bold text-sm text-cyan-300 shrink-0 shadow-[0_0_10px_rgba(3,219,252,0.3)] transform -skew-x-6">
                   {state.level}
                </div>
                <div className="overflow-hidden">
                   <h1 className="text-[11px] font-black uppercase tracking-widest text-[#03dbfc] truncate drop-shadow-[0_0_5px_rgba(3,219,252,0.8)]">
                     Rank {state.rank}
                   </h1>
                   <div className="text-[9px] text-blue-200/70 truncate uppercase tracking-widest mt-0.5">
                     {state.playerClass ? state.playerClass.name : 'SEM CLASSE'}
                   </div>
                </div>
            </div>
            <div className="flex flex-col text-[10px] gap-1 mt-1">
               <span className="text-yellow-400 font-bold flex items-center gap-1 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]"><Gem size={10}/>{state.gold}</span>
               <span className="text-[#03dbfc] font-bold flex items-center gap-1 drop-shadow-[0_0_5px_rgba(3,219,252,0.5)]"><Hexagon size={10}/>{state.manaCrystals}</span>
            </div>
         </div>
         
         <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col p-2 gap-1">
             {TABS.map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`relative p-3 text-left transition-all text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider transform -skew-x-6 origin-left
                            ${activeTab === tab ? 'bg-gradient-to-r from-cyan-900/40 to-transparent text-[#03dbfc] border-l-2 border-[#03dbfc] shadow-[inset_0_0_15px_rgba(3,219,252,0.1)]' : 'border-l-2 border-transparent text-blue-300/50 hover:bg-cyan-900/10 hover:text-cyan-100 hover:border-[#004080]'}`}
               >
                 <span className="transform skew-x-6 block">{tab}</span>
               </button>
             ))}
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto p-2 sm:p-4 custom-scrollbar relative z-0">
          <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-overlay"
               style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #03dbfc 2px, #03dbfc 3px)', backgroundSize: '100% 4px' }}>
          </div>
          <div className="h-full relative z-10 w-full max-w-5xl mx-auto flex flex-col">
              {renderTab()}
          </div>
      </div>
    </div>
  );
};
