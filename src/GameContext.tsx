import { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from 'react';
import { PlayerState } from './types';
import { loadGameState, gameReducer, GameAction, saveGameState } from './lib/engine';
import { calculatePlayerStats } from './lib/gameData';

interface GameContextType {
  state: PlayerState;
  dispatch: Dispatch<GameAction>;
  combatStats: ReturnType<typeof calculatePlayerStats>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadGameState);

  useEffect(() => {
    saveGameState(state);
  }, [state]);

  const combatStats = calculatePlayerStats(state);

  return (
    <GameContext.Provider value={{ state, dispatch, combatStats }}>
        {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
