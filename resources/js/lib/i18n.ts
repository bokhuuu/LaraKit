import { usePage } from '@inertiajs/react';

export function useTranslations() {
    const { translations, locale } = usePage().props;

    function __(
        key: string,
        replacements: Record<string, string> = {},
    ): string {
        const [file, ...rest] = key.split('.');
        const keyPath = rest.join('.');

        const translation = translations?.[file]?.[keyPath] ?? key;

        return Object.entries(replacements).reduce(
            (str, [search, replace]) => str.replace(`:${search}`, replace),
            translation,
        );
    }

    return { __, locale };
}
