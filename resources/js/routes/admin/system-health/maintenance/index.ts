import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SystemHealthController::toggle
* @see app/Http/Controllers/Admin/SystemHealthController.php:67
* @route '/admin/system-health/maintenance'
*/
export const toggle = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(options),
    method: 'post',
})

toggle.definition = {
    methods: ["post"],
    url: '/admin/system-health/maintenance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::toggle
* @see app/Http/Controllers/Admin/SystemHealthController.php:67
* @route '/admin/system-health/maintenance'
*/
toggle.url = (options?: RouteQueryOptions) => {
    return toggle.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::toggle
* @see app/Http/Controllers/Admin/SystemHealthController.php:67
* @route '/admin/system-health/maintenance'
*/
toggle.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::toggle
* @see app/Http/Controllers/Admin/SystemHealthController.php:67
* @route '/admin/system-health/maintenance'
*/
const toggleForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SystemHealthController::toggle
* @see app/Http/Controllers/Admin/SystemHealthController.php:67
* @route '/admin/system-health/maintenance'
*/
toggleForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(options),
    method: 'post',
})

toggle.form = toggleForm

const maintenance = {
    toggle: Object.assign(toggle, toggle),
}

export default maintenance