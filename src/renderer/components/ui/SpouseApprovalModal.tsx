import { useState } from 'react';
import { Button } from '../ui/button';
import { Loader2, PenTool, CheckCircle2 } from 'lucide-react';

interface SpouseApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApprove: () => void;
}

export const SpouseApprovalModal = ({ isOpen, onClose, onApprove }: SpouseApprovalModalProps) => {
    const [isSigning, setIsSigning] = useState(false);
    const [signature, setSignature] = useState<string>('');
    const [step, setStep] = useState(1);

    if (!isOpen) return null;

    const handleSign = () => {
        setIsSigning(true);
        // Simulate complex digital signature processing
        setTimeout(() => {
            setIsSigning(false);
            setSignature('Signed by The Boss');
            setStep(2);
        }, 2000);
    };

    const handleFinalApprove = () => {
        onApprove();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full border">
                <h3 className="text-xl font-bold mb-4">Spouse Approval Required</h3>

                {step === 1 && (
                    <div className="space-y-4">
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md text-sm text-amber-800 dark:text-amber-200">
                            <strong>Notice:</strong> This task involves significant changes to the household environment.
                            Executive approval is mandated by the Homeowners Association (Your Spouse).
                        </div>

                        <div className="border-2 border-dashed h-32 rounded-md flex items-center justify-center bg-muted/20">
                            {signature ? (
                                <span className="font-script text-2xl text-blue-600">{signature}</span>
                            ) : (
                                <span className="text-muted-foreground text-sm">Digital Signature Pad (Imagine signing here)</span>
                            )}
                        </div>

                        <div className="flex justify-end space-x-2 pt-2">
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button variant="enterprise" onClick={handleSign} disabled={isSigning}>
                                {isSigning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <PenTool className="h-4 w-4 mr-2" />}
                                {isSigning ? 'Validating Biometrics...' : 'Sign & Approve'}
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 text-center">
                        <div className="flex justify-center text-green-500 mb-2">
                            <CheckCircle2 className="h-12 w-12" />
                        </div>
                        <h4 className="text-lg font-semibold">Approval Granted</h4>
                        <p className="text-muted-foreground text-sm">
                            The changes have been authorized. You may proceed, but remember:
                            <em>"I told you so"</em> rights are reserved in perpetuity.
                        </p>
                        <div className="flex justify-center pt-4">
                            <Button variant="default" onClick={handleFinalApprove}>
                                Proceed
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
