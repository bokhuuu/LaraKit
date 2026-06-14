import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SystemHealthController::index
* @see app/Http/Controllers/Admin/SystemHealthController.php:28
* @route '/admin/system-health'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/system-health',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::index
* @see app/Http/Controllers/Admin/SystemHealthController.php:28
* @route '/admin/system-health'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::index
* @see app/Http/Controllers/Admin/SystemHealthController.php:28
* @route '/admin/system-health'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::index
* @see app/Http/Controllers/Admin/SystemHealthController.php:28
* @route '/admin/system-health'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::index
* @see app/Http/Controllers/Admin/SystemHealthController.php:28
* @route '/admin/system-health'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::index
* @see app/Http/Controllers/Admin/SystemHealthController.php:28
* @route '/admin/system-health'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::index
* @see app/Http/Controllers/Admin/SystemHealthController.php:28
* @route '/admin/system-health'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::clearCache
* @see app/Http/Controllers/Admin/SystemHealthController.php:46
* @route '/admin/system-health/cache'
*/
export const clearCache = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clearCache.url(options),
    method: 'post',
})

clearCache.definition = {
    methods: ["post"],
    url: '/admin/system-health/cache',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::clearCache
* @see app/Http/Controllers/Admin/SystemHealthController.php:46
* @route '/admin/system-health/cache'
*/
clearCache.url = (options?: RouteQueryOptions) => {
    return clearCache.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::clearCache
* @see app/Http/Controllers/Admin/SystemHealthController.php:46
* @route '/admin/system-health/cache'
*/
clearCache.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clearCache.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::clearCache
* @see app/Http/Controllers/Admin/SystemHealthController.php:46
* @route '/admin/system-health/cache'
*/
const clearCacheForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clearCache.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::clearCache
* @see app/Http/Controllers/Admin/SystemHealthController.php:46
* @route '/admin/system-health/cache'
*/
clearCacheForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clearCache.url(options),
    method: 'post',
})

clearCache.form = clearCacheForm

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::toggleMaintenance
* @see app/Http/Controllers/Admin/SystemHealthController.php:67
* @route '/admin/system-health/maintenance'
*/
export const toggleMaintenance = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleMaintenance.url(options),
    method: 'post',
})

toggleMaintenance.definition = {
    methods: ["post"],
    url: '/admin/system-health/maintenance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::toggleMaintenance
* @see app/Http/Controllers/Admin/SystemHealthController.php:67
* @route '/admin/system-health/maintenance'
*/
toggleMaintenance.url = (options?: RouteQueryOptions) => {
    return toggleMaintenance.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::toggleMaintenance
* @see app/Http/Controllers/Admin/SystemHealthController.php:67
* @route '/admin/system-health/maintenance'
*/
toggleMaintenance.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleMaintenance.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::toggleMaintenance
* @see app/Http/Controllers/Admin/SystemHealthController.php:67
* @route '/admin/system-health/maintenance'
*/
const toggleMaintenanceForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleMaintenance.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::toggleMaintenance
* @see app/Http/Controllers/Admin/SystemHealthController.php:67
* @route '/admin/system-health/maintenance'
*/
toggleMaintenanceForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleMaintenance.url(options),
    method: 'post',
})

toggleMaintenance.form = toggleMaintenanceForm

const SystemHealthController = { index, clearCache, toggleMaintenance }

export default SystemHealthController