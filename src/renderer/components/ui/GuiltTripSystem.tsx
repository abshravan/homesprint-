import { useEffect } from 'react';
import { useToast } from './use-toast';

const GUILT_MESSAGES = [
    "You haven't moved a ticket in 2 hours. Just saying.",
    "Your velocity is looking a bit... stationary.",
    "Did you really need that coffee break?",
    "The backlog is growing. It's watching you.",
    "Remember: 'Done' is better than 'Perfect', but you have neither.",
    "Is this what 'agile' looks like?",
    "Your burndown chart is actually a burnup chart.",
    "Stakeholders are asking about the 'Clean Garage' ticket.",
    "Time is money. You are wasting both.",
    "Have you updated your timesheet? (Just kidding, we know you haven't)."
];

export const GuiltTripSystem = () => {
    const { toast } = useToast();

    useEffect(() => {
        const interval = setInterval(() => {
            // 30% chance to trigger a notification every check
            if (Math.random() > 0.7) {
                const message = GUILT_MESSAGES[Math.floor(Math.random() * GUILT_MESSAGES.length)];

                toast({
                    title: "Friendly Reminder",
                    description: message,
                    variant: "destructive", // Make it look urgent/scary
                    duration: 5000,
                });
            }
        }, 60000); // Check every minute (aggressive!)

        return () => clearInterval(interval);
    }, [toast]);

    return null; // Headless component
};
