import React, { Component, ErrorInfo, ReactNode } from 'react';
import { NeoCard } from '../ui/NeoCard';
import { NeoButton } from '../ui/NeoButton';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('DriveForge AI Uncaught Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#121417] flex items-center justify-center p-6 text-center">
          <NeoCard variant="panel" radius="28" className="max-w-md p-8 space-y-6">
            <div className="w-16 h-16 rounded-2xl neo-inset flex items-center justify-center text-[#EF4444] mx-auto">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white font-sans">SYSTEM TELEMETRY FAULT</h1>
              <p className="text-xs font-mono text-gray-400">
                {this.state.error?.message || 'An unexpected engineering exception occurred.'}
              </p>
            </div>

            <NeoButton
              variant="primary"
              fullWidth
              onClick={() => window.location.reload()}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Reboot Telemetry System
            </NeoButton>
          </NeoCard>
        </div>
      );
    }

    return this.props.children;
  }
}
