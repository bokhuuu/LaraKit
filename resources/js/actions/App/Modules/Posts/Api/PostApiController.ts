import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Modules\Posts\Api\PostApiController::index
* @see app/Modules/Posts/Api/PostApiController.php:21
* @route '/api/v1/posts'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/posts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Posts\Api\PostApiController::index
* @see app/Modules/Posts/Api/PostApiController.php:21
* @route '/api/v1/posts'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Posts\Api\PostApiController::index
* @see app/Modules/Posts/Api/PostApiController.php:21
* @route '/api/v1/posts'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Modules\Posts\Api\PostApiController::index
* @see app/Modules/Posts/Api/PostApiController.php:21
* @route '/api/v1/posts'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Modules\Posts\Api\PostApiController::index
* @see app/Modules/Posts/Api/PostApiController.php:21
* @route '/api/v1/posts'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Modules\Posts\Api\PostApiController::index
* @see app/Modules/Posts/Api/PostApiController.php:21
* @route '/api/v1/posts'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Modules\Posts\Api\PostApiController::index
* @see app/Modules/Posts/Api/PostApiController.php:21
* @route '/api/v1/posts'
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
* @see \App\Modules\Posts\Api\PostApiController::show
* @see app/Modules/Posts/Api/PostApiController.php:37
* @route '/api/v1/posts/{slug}'
*/
export const show = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/posts/{slug}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Posts\Api\PostApiController::show
* @see app/Modules/Posts/Api/PostApiController.php:37
* @route '/api/v1/posts/{slug}'
*/
show.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slug: args }
    }

    if (Array.isArray(args)) {
        args = {
            slug: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
    }

    return show.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Posts\Api\PostApiController::show
* @see app/Modules/Posts/Api/PostApiController.php:37
* @route '/api/v1/posts/{slug}'
*/
show.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Modules\Posts\Api\PostApiController::show
* @see app/Modules/Posts/Api/PostApiController.php:37
* @route '/api/v1/posts/{slug}'
*/
show.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Modules\Posts\Api\PostApiController::show
* @see app/Modules/Posts/Api/PostApiController.php:37
* @route '/api/v1/posts/{slug}'
*/
const showForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Modules\Posts\Api\PostApiController::show
* @see app/Modules/Posts/Api/PostApiController.php:37
* @route '/api/v1/posts/{slug}'
*/
showForm.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Modules\Posts\Api\PostApiController::show
* @see app/Modules/Posts/Api/PostApiController.php:37
* @route '/api/v1/posts/{slug}'
*/
showForm.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const PostApiController = { index, show }

export default PostApiController