import { useState } from 'react';
import { Button } from '../ui/button';
import { Loader2, Calendar, Coffee, Target, AlertTriangle } from 'lucide-react';

interface SprintPlanningModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStartSprint: () => void;
    sprintName: string;
}

export const SprintPlanningModal = ({ isOpen, onClose, onStartSprint, sprintName }: SprintPlanningModalProps) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleNext = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep(step + 1);
        }, 1500);
    };

    const handleStart = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onStartSprint();
            onClose();
            setStep(1);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card p-6 rounded-lg shadow-lg max-w-lg w-full border">
                <h3 className="text-xl font-bold mb-2">Sprint Planning: {sprintName}</h3>
                <div className="w-full bg-secondary h-2 rounded-full mb-6">
                    <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(step / 4) * 100}%` }}
                    ></div>
                </div>

                {step === 1 && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4 text-primary">
                            <Coffee className="h-8 w-8" />
                            <h4 className="text-lg font-semibold">Step 1: Caffeinate & Procrastinate</h4>
                        </div>
                        <p className="text-muted-foreground">
                            Before we begin, have you had enough coffee to deal with the overwhelming realization of how much work you haven't done?
                        </p>
                        <div className="bg-muted p-4 rounded-md text-sm italic">
                            "The best time to plant a tree was 20 years ago. The best time to start this sprint was last week."
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button variant="enterprise" onClick={handleNext} disabled={isLoading}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'I am ready (I think)'}
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4 text-orange-500">
                            <Target className="h-8 w-8" />
                            <h4 className="text-lg font-semibold">Step 2: Set Unrealistic Goals</h4>
                        </div>
                        <p className="text-muted-foreground">
                            Select the issues you definitely won't complete this sprint. Be ambitious!
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" checked readOnly className="h-4 w-4" />
                                <span className="text-sm">Fix the leaking faucet (Story Points: 13)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" checked readOnly className="h-4 w-4" />
                                <span className="text-sm">Clean the garage (Story Points: 100)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" checked readOnly className="h-4 w-4" />
                                <span className="text-sm">Learn French (Story Points: ∞)</span>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button variant="enterprise" onClick={handleNext} disabled={isLoading}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Commit to Failure'}
                            </Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4 text-blue-500">
                            <Calendar className="h-8 w-8" />
                            <h4 className="text-lg font-semibold">Step 3: Schedule the Pain</h4>
                        </div>
                        <p className="text-muted-foreground">
                            When should this sprint end? (Note: It will likely drag on forever regardless).
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="border p-3 rounded-md text-center cursor-pointer hover:bg-muted">
                                <div className="font-bold">2 Weeks</div>
                                <div className="text-xs text-muted-foreground">Standard Agile Lie</div>
                            </div>
                            <div className="border p-3 rounded-md text-center cursor-pointer hover:bg-muted">
                                <div className="font-bold">1 Month</div>
                                <div className="text-xs text-muted-foreground">Realistic Optimism</div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button variant="enterprise" onClick={handleNext} disabled={isLoading}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Set Date'}
                            </Button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4 text-red-500">
                            <AlertTriangle className="h-8 w-8" />
                            <h4 className="text-lg font-semibold">Step 4: Final Warning</h4>
                        </div>
                        <p className="text-muted-foreground">
                            Are you sure you want to start this sprint? Once started, the guilt trip notifications will begin.
                        </p>
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-sm text-red-800 dark:text-red-200">
                            <strong>Warning:</strong> Your free time is about to be deprecated.
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="ghost" onClick={onClose}>Run Away</Button>
                            <Button variant="enterprise" onClick={handleStart} disabled={isLoading}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Start Sprint'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
