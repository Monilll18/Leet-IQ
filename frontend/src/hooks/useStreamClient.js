import { useUser } from '@clerk/clerk-react';
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';

const API_KEY = import.meta.env.VITE_STREAM_API_KEY || 'demo-api-key';

const useStreamClient = () => {
    const { user } = useUser();
    const [client, setClient] = useState(null);

    useEffect(() => {
        if (!user) return;

        const userId = user.id;
        const userName = user.fullName || user.username || 'Anonymous';

        // Create Stream client
        const streamClient = new StreamVideoClient({
            apiKey: API_KEY,
            user: {
                id: userId,
                name: userName,
                image: user.imageUrl,
            },
            // For demo purposes, using a simple token
            // In production, get this from your backend
            token: 'demo-token',
        });

        setClient(streamClient);

        return () => {
            streamClient?.disconnectUser();
            setClient(null);
        };
    }, [user]);

    return client;
};

export default useStreamClient;
