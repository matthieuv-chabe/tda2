import { createContext, useContext } from "react";

export type UserSelectionContextType = {
    selectedMission: number | null;
    hasUserMovedMap: boolean;
    textfilter: string;
    setSelectedMission: (missionId: number | null) => void;
    setHasUserMovedMap: (hasUserMovedMap: boolean) => void;
};

const UserSelectionContext = createContext<UserSelectionContextType | null>(null);

export const useUserSelectionContext = () => {
    const context = useContext(UserSelectionContext);
    if (!context) {
        throw new Error("UserSelectionContext must be used within a UserSelectionContext.Provider");
    }
    return context;
}

export default UserSelectionContext;

