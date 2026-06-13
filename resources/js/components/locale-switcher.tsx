import { router } from '@inertiajs/react';
import LocaleController from '@/actions/App/Http/Controllers/Admin/LocaleController';
import { useTranslations } from '@/lib/i18n';

export function LocaleSwitcher() {
    const { locale } = useTranslations();
    const available = ['en', 'ka'];

    function switchLocale(newLocale: string) {
        router.post(LocaleController.update.url(), { locale: newLocale });
    }

    return (
        <div className="flex items-center gap-1">
            {available.map((lang) => (
                <button
                    key={lang}
                    onClick={() => switchLocale(lang)}
                    className={`cursor-pointer rounded px-2 py-1 text-xs font-medium uppercase transition-colors ${
                        locale === lang
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    {lang}
                </button>
            ))}
        </div>
    );
}
