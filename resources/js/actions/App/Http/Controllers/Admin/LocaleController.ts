import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\LocaleController::update
* @see app/Http/Controllers/Admin/LocaleController.php:19
* @route '/admin/locale'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/admin/locale',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\LocaleController::update
* @see app/Http/Controllers/Admin/LocaleController.php:19
* @route '/admin/locale'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LocaleController::update
* @see app/Http/Controllers/Admin/LocaleController.php:19
* @route '/admin/locale'
*/
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LocaleController::update
* @see app/Http/Controllers/Admin/LocaleController.php:19
* @route '/admin/locale'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LocaleController::update
* @see app/Http/Controllers/Admin/LocaleController.php:19
* @route '/admin/locale'
*/
updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

update.form = updateForm

const LocaleController = { update }

export default LocaleController