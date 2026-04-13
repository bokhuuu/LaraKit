import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Flash {
    success?: string;
    error?: string;
    timestamp?: number;
}

interface PageProps {
    [key: string]: unknown;
    flash: Flash;
}

export default function FlashMessage() {
    const { flash } = usePage<PageProps>().props;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (flash.success || flash.error) {
            setVisible(true);

            const timer = setTimeout(() => {
                setVisible(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flash.timestamp]);

    if (!visible) {
        return null;
    }

    return (
        <div
            className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
                flash.success
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
            }`}
        >
            {flash.success ?? flash.error}
        </div>
    );
}
