import { useEffect, useState } from "react";

export const useWs = () => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    
    useEffect(() => {
        let ws = new WebSocket("ws://localhost:3001/ws");
        ws.onerror = (e) => {
            console.error(e);
            ws = new WebSocket("ws://localhost:3001/ws");
        }
        
        setWs(ws);
    
        return () => {
            ws.close();
        };
    }, []);
    
    return ws;
    };
