import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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

const PostApiController = { index, show }

export default PostApiController