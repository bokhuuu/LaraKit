import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Setting {
    id: number;
    key: string;
    value: string | null;
    group: string;
    type: string;
    label: string;
    description: string | null;
    order: number;
}

interface Props {
    settings: Record<string, Setting[]>;
    groups: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Settings', href: '/admin/settings' },
];

function formatGroup(group: string): string {
    return group.charAt(0).toUpperCase() + group.slice(1);
}

export default function SettingsIndex({ settings, groups }: Props) {
    const initialData = Object.values(settings)
        .flat()
        .reduce(
            (acc, setting) => {
                acc[setting.key] = setting.value ?? '';

                return acc;
            },
            {} as Record<string, string>,
        );

    const { data, setData, put, processing } = useForm({
        settings: initialData,
    });

    const [activeGroup, setActiveGroup] = useState(groups[0] ?? 'general');

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        put('/admin/settings');
    }

    function updateSetting(key: string, value: string) {
        setData('settings', { ...data.settings, [key]: value });
    }

    function renderInput(setting: Setting) {
        const value = data.settings[setting.key] ?? '';
        const inputClass =
            'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring';

        switch (setting.type) {
            case 'textarea':
                return (
                    <textarea
                        value={value}
                        onChange={(e) =>
                            updateSetting(setting.key, e.target.value)
                        }
                        className={`${inputClass} min-h-20`}
                        rows={3}
                    />
                );

            case 'boolean':
                return (
                    <input
                        type="checkbox"
                        checked={value === '1'}
                        onChange={(e) =>
                            updateSetting(
                                setting.key,
                                e.target.checked ? '1' : '0',
                            )
                        }
                        className="h-4 w-4 rounded border"
                    />
                );

            case 'color':
                return (
                    <input
                        type="color"
                        value={value || '#000000'}
                        onChange={(e) =>
                            updateSetting(setting.key, e.target.value)
                        }
                        className="h-10 w-20 cursor-pointer rounded-md border p-1"
                    />
                );

            case 'file':
                return (
                    <div className="rounded-md border border-dashed px-4 py-3 text-sm text-muted-foreground">
                        File upload available after Media Library setup.
                        {value && (
                            <p className="mt-1 text-xs text-foreground">
                                Current: {value}
                            </p>
                        )}
                    </div>
                );

            default:
                return (
                    <input
                        type={
                            setting.type === 'email'
                                ? 'email'
                                : setting.type === 'url'
                                  ? 'url'
                                  : 'text'
                        }
                        value={value}
                        onChange={(e) =>
                            updateSetting(setting.key, e.target.value)
                        }
                        className={inputClass}
                    />
                );
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Settings" />
            <div className="flex justify-center p-6">
                <div className="w-full max-w-2xl">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold">
                            Site Settings
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your site configuration.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6 flex gap-1 border-b">
                            {groups.map((group) => (
                                <button
                                    key={group}
                                    type="button"
                                    onClick={() => setActiveGroup(group)}
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                                        activeGroup === group
                                            ? 'border-b-2 border-primary text-primary'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {formatGroup(group)}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-5">
                            {(settings[activeGroup] ?? []).map((setting) => (
                                <div key={setting.key}>
                                    <label className="mb-1 block text-sm font-medium">
                                        {setting.label}
                                    </label>
                                    {renderInput(setting)}
                                    {setting.description && (
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {setting.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
