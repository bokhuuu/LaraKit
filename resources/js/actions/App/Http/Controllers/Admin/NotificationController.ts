import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\NotificationController::markAsRead
* @see app/Http/Controllers/Admin/NotificationController.php:11
* @route '/admin/notifications/{id}/read'
*/
export const markAsRead = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsRead.url(args, options),
    method: 'post',
})

markAsRead.definition = {
    methods: ["post"],
    url: '/admin/notifications/{id}/read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\NotificationController::markAsRead
* @see app/Http/Controllers/Admin/NotificationController.php:11
* @route '/admin/notifications/{id}/read'
*/
markAsRead.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return markAsRead.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificationController::markAsRead
* @see app/Http/Controllers/Admin/NotificationController.php:11
* @route '/admin/notifications/{id}/read'
*/
markAsRead.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsRead.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::markAsRead
* @see app/Http/Controllers/Admin/NotificationController.php:11
* @route '/admin/notifications/{id}/read'
*/
const markAsReadForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: markAsRead.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::markAsRead
* @see app/Http/Controllers/Admin/NotificationController.php:11
* @route '/admin/notifications/{id}/read'
*/
markAsReadForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: markAsRead.url(args, options),
    method: 'post',
})

markAsRead.form = markAsReadForm

/**
* @see \App\Http\Controllers\Admin\NotificationController::markAllAsRead
* @see app/Http/Controllers/Admin/NotificationController.php:22
* @route '/admin/notifications/read-all'
*/
export const markAllAsRead = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllAsRead.url(options),
    method: 'post',
})

markAllAsRead.definition = {
    methods: ["post"],
    url: '/admin/notifications/read-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\NotificationController::markAllAsRead
* @see app/Http/Controllers/Admin/NotificationController.php:22
* @route '/admin/notifications/read-all'
*/
markAllAsRead.url = (options?: RouteQueryOptions) => {
    return markAllAsRead.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificationController::markAllAsRead
* @see app/Http/Controllers/Admin/NotificationController.php:22
* @route '/admin/notifications/read-all'
*/
markAllAsRead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllAsRead.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::markAllAsRead
* @see app/Http/Controllers/Admin/NotificationController.php:22
* @route '/admin/notifications/read-all'
*/
const markAllAsReadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: markAllAsRead.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::markAllAsRead
* @see app/Http/Controllers/Admin/NotificationController.php:22
* @route '/admin/notifications/read-all'
*/
markAllAsReadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: markAllAsRead.url(options),
    method: 'post',
})

markAllAsRead.form = markAllAsReadForm

const NotificationController = { markAsRead, markAllAsRead }

export default NotificationController