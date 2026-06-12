import { Head, router, useForm } from '@inertiajs/react';
import { Copy, KeyRound, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Token {
    id: number;
    name: string;
    last_used: string | null;
    created_at: string;
}

interface Props {
    tokens: Token[];
    newToken: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'API Tokens', href: '/admin/tokens' },
];

export default function TokensIndex({ tokens, newToken }: Props) {
    const [tokenToRevoke, setTokenToRevoke] = useState<Token | null>(null);
    const [copied, setCopied] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    function handleCreate() {
        post('/admin/tokens', {
            onSuccess: () => reset(),
        });
    }

    function handleCopy() {
        if (!newToken) {
            return;
        }

        navigator.clipboard.writeText(newToken);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="API Tokens" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">API Tokens</h1>
                </div>

                {/* New token alert */}
                {newToken && (
                    <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                        <p className="mb-2 text-sm font-medium text-green-800 dark:text-green-200">
                            Token created - copy it now. It will not be shown
                            again.
                        </p>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 rounded border bg-white px-3 py-2 text-xs break-all text-green-900 dark:bg-green-900 dark:text-green-100">
                                {newToken}
                            </code>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1 rounded-md border px-3 py-2 text-xs hover:bg-muted"
                            >
                                <Copy className="h-3 w-3" />
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Create token form */}
                <div className="mb-6 rounded-lg border p-4">
                    <p className="mb-3 text-sm font-medium">Create New Token</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Token name (e.g. Mobile App)"
                            className="flex-1 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleCreate();
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleCreate}
                            disabled={processing || !data.name}
                            className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                            <Plus className="h-4 w-4" />
                            Create
                        </button>
                    </div>
                    {errors.name && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Tokens list */}
                {tokens.length === 0 ? (
                    <div className="rounded-lg border p-12 text-center text-muted-foreground">
                        <KeyRound className="mx-auto mb-2 h-8 w-8 opacity-40" />
                        No tokens yet. Create one above.
                    </div>
                ) : (
                    <div className="rounded-lg border">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="px-4 py-3 text-left font-medium">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Last Used
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Created
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tokens.map((token) => (
                                    <tr
                                        key={token.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {token.name}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {token.last_used ?? 'Never'}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {token.created_at}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() =>
                                                    setTokenToRevoke(token)
                                                }
                                                className="text-red-400 hover:text-red-600"
                                                title="Revoke"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <AlertDialog
                open={tokenToRevoke !== null}
                onOpenChange={() => setTokenToRevoke(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Revoke Token</AlertDialogTitle>
                        <AlertDialogDescription>
                            "{tokenToRevoke?.name}" will be permanently revoked.
                            Any app using it will lose access immediately.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (tokenToRevoke) {
                                    router.delete(
                                        `/admin/tokens/${tokenToRevoke.id}`,
                                    );
                                    setTokenToRevoke(null);
                                }
                            }}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Revoke
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
