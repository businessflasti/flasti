'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface EmailLog {
  email_type: string;
  sent_at: string;
}

interface EmailRecoveryBadgeProps {
  userId: string;
  userEmail: string;
  userName?: string;
}

export default function EmailRecoveryBadge({ userId, userEmail, userName }: EmailRecoveryBadgeProps) {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [sending, setSending] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmailLogs();
  }, [userId]);

  const loadEmailLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('user_email_logs')
        .select('email_type, sent_at')
        .eq('user_id', userId)
        .order('sent_at', { ascending: false });

      if (!error && data) {
        setEmailLogs(data);
      }
    } catch (error) {
      console.error('Error loading email logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async (emailType: 'recovery_1' | 'recovery_2' | 'welcome') => {
    setSending(emailType);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('No hay sesión activa');
        return;
      }

      const response = await fetch('/api/admin/send-recovery-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          user_id: userId,
          email_type: emailType,
          user_email: userEmail,
          user_name: userName || userEmail.split('@')[0]
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Correo enviado exitosamente');
        loadEmailLogs();
      } else {
        toast.error(result.error || 'Error al enviar correo');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al enviar correo');
    } finally {
      setSending(null);
    }
  };

  const getEmailLog = (emailType: string) => {
    return emailLogs.find(log => log.email_type === emailType);
  };

  const getDaysSince = (dateString: string) => {
    const sentDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - sentDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const EmailButton = ({ 
    emailType, 
    label, 
    number 
  }: { 
    emailType: 'recovery_1' | 'recovery_2' | 'welcome'; 
    label: string; 
    number: string | React.ReactNode;
  }) => {
    const log = getEmailLog(emailType);
    const isSent = !!log;
    const daysSince = log ? getDaysSince(log.sent_at) : 0;
    const isWelcome = emailType === 'welcome';

    return (
      <div className="flex flex-col items-center gap-1">
        <Button
          size="sm"
          onClick={() => sendEmail(emailType)}
          disabled={isSent || sending === emailType}
          className={`h-8 w-8 p-0 rounded-lg transition-all duration-200 ${
            isSent 
              ? 'bg-gray-500/10 text-gray-500 border border-gray-500/30 cursor-not-allowed opacity-60' 
              : isWelcome
                ? 'bg-[#3c66cd] text-white border border-[#3c66cd] hover:bg-[#2d4fa3] hover:scale-105 shadow-lg'
                : 'bg-white text-black border border-white hover:bg-white/90 hover:scale-105 shadow-lg'
          }`}
          title={isSent ? `Enviado hace ${daysSince} días` : label}
        >
          {sending === emailType ? (
            <span className="animate-spin text-sm">⟳</span>
          ) : (
            <span className="font-bold text-sm">{number}</span>
          )}
        </Button>
        {isSent && (
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Clock className="w-2 h-2" />
            <span>{daysSince}d</span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex gap-1">
        <div className="w-7 h-7 bg-gray-500/20 rounded animate-pulse"></div>
        <div className="w-7 h-7 bg-gray-500/20 rounded animate-pulse"></div>
        <div className="w-7 h-7 bg-gray-500/20 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-1.5 items-start">
      <EmailButton emailType="recovery_1" label="Correo 1" number="1" />
      <EmailButton emailType="recovery_2" label="Correo 2" number="2" />
      <EmailButton 
        emailType="welcome" 
        label="Bienvenida" 
        number={<CheckCircle className="w-4 h-4" />} 
      />
    </div>
  );
}
