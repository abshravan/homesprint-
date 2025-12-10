import { useState } from 'react';
import { Button } from '../ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';

interface TransitionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    toStatus: string;
}

export const TransitionDialog = ({ isOpen, onClose, onConfirm, toStatus }: TransitionDialogProps) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleNext = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep(step + 1);
        }, 1000);
    };

    const handleConfirm = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onConfirm();
            onClose();
            setStep(1);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full border">
                <h3 className="text-lg font-bold mb-4">Transition Issue</h3>

                {step === 1 && (
                    <div className="space-y-4">
                        <p>Are you sure you want to move this issue to <strong>{toStatus.replace('_', ' ').toUpperCase()}</strong>?</p>
                        <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded text-sm text-yellow-800 dark:text-yellow-200 flex items-start">
                            <AlertTriangle className="h-4 w-4 mr-2 mt-0.5" />
                            <span>Warning: This action will trigger 3 email notifications and update the burndown chart (incorrectly).</span>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button variant="enterprise" onClick={handleNext} disabled={isLoading}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Proceed'}
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <p>Please confirm that you have updated the documentation (which doesn't exist).</p>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="docs" className="h-4 w-4" />
                            <label htmlFor="docs" className="text-sm">I have updated the non-existent docs</label>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button variant="enterprise" onClick={handleNext} disabled={isLoading}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm'}
                            </Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <p>Final check: Did you ask your spouse/roommate/cat for approval?</p>
                        <div className="flex justify-end space-x-2">
                            <Button variant="ghost" onClick={onClose}>No</Button>
                            <Button variant="enterprise" onClick={handleConfirm} disabled={isLoading}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Yes, Move it!'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
