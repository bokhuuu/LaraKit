import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SystemHealthController::clear
* @see app/Http/Controllers/Admin/SystemHealthController.php:46
* @route '/admin/system-health/cache'
*/
export const clear = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clear.url(options),
    method: 'post',
})

clear.definition = {
    methods: ["post"],
    url: '/admin/system-health/cache',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::clear
* @see app/Http/Controllers/Admin/SystemHealthController.php:46
* @route '/admin/system-health/cache'
*/
clear.url = (options?: RouteQueryOptions) => {
    return clear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::clear
* @see app/Http/Controllers/Admin/SystemHealthController.php:46
* @route '/admin/system-health/cache'
*/
clear.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clear.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::clear
* @see app/Http/Controllers/Admin/SystemHealthController.php:46
* @route '/admin/system-health/cache'
*/
const clearForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clear.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::clear
* @see app/Http/Controllers/Admin/SystemHealthController.php:46
* @route '/admin/system-health/cache'
*/
clearForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clear.url(options),
    method: 'post',
})

clear.form = clearForm

const cache = {
    clear: Object.assign(clear, clear),
}

export default cache