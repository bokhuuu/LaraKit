import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ActivityLogController::index
* @see app/Http/Controllers/Admin/ActivityLogController.php:26
* @route '/admin/activity-log'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/activity-log',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ActivityLogController::index
* @see app/Http/Controllers/Admin/ActivityLogController.php:26
* @route '/admin/activity-log'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ActivityLogController::index
* @see app/Http/Controllers/Admin/ActivityLogController.php:26
* @route '/admin/activity-log'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ActivityLogController::index
* @see app/Http/Controllers/Admin/ActivityLogController.php:26
* @route '/admin/activity-log'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const ActivityLogController = { index }

export default ActivityLogController