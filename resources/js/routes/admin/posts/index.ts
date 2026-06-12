import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Modules\Posts\Controllers\PostController::index
* @see app/Modules/Posts/Controllers/PostController.php:31
* @route '/admin/posts'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/posts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Posts\Controllers\PostController::index
* @see app/Modules/Posts/Controllers/PostController.php:31
* @route '/admin/posts'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Posts\Controllers\PostController::index
* @see app/Modules/Posts/Controllers/PostController.php:31
* @route '/admin/posts'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Modules\Posts\Controllers\PostController::index
* @see app/Modules/Posts/Controllers/PostController.php:31
* @route '/admin/posts'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Modules\Posts\Controllers\PostController::create
* @see app/Modules/Posts/Controllers/PostController.php:44
* @route '/admin/posts/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/posts/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Posts\Controllers\PostController::create
* @see app/Modules/Posts/Controllers/PostController.php:44
* @route '/admin/posts/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Posts\Controllers\PostController::create
* @see app/Modules/Posts/Controllers/PostController.php:44
* @route '/admin/posts/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Modules\Posts\Controllers\PostController::create
* @see app/Modules/Posts/Controllers/PostController.php:44
* @route '/admin/posts/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Modules\Posts\Controllers\PostController::store
* @see app/Modules/Posts/Controllers/PostController.php:52
* @route '/admin/posts'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/posts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Posts\Controllers\PostController::store
* @see app/Modules/Posts/Controllers/PostController.php:52
* @route '/admin/posts'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Posts\Controllers\PostController::store
* @see app/Modules/Posts/Controllers/PostController.php:52
* @route '/admin/posts'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Modules\Posts\Controllers\PostController::edit
* @see app/Modules/Posts/Controllers/PostController.php:63
* @route '/admin/posts/{post}/edit'
*/
export const edit = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/posts/{post}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Posts\Controllers\PostController::edit
* @see app/Modules/Posts/Controllers/PostController.php:63
* @route '/admin/posts/{post}/edit'
*/
edit.url = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { post: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            post: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post: typeof args.post === 'object'
        ? args.post.id
        : args.post,
    }

    return edit.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Posts\Controllers\PostController::edit
* @see app/Modules/Posts/Controllers/PostController.php:63
* @route '/admin/posts/{post}/edit'
*/
edit.get = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Modules\Posts\Controllers\PostController::edit
* @see app/Modules/Posts/Controllers/PostController.php:63
* @route '/admin/posts/{post}/edit'
*/
edit.head = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Modules\Posts\Controllers\PostController::update
* @see app/Modules/Posts/Controllers/PostController.php:74
* @route '/admin/posts/{post}'
*/
export const update = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/posts/{post}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Modules\Posts\Controllers\PostController::update
* @see app/Modules/Posts/Controllers/PostController.php:74
* @route '/admin/posts/{post}'
*/
update.url = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { post: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            post: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post: typeof args.post === 'object'
        ? args.post.id
        : args.post,
    }

    return update.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Posts\Controllers\PostController::update
* @see app/Modules/Posts/Controllers/PostController.php:74
* @route '/admin/posts/{post}'
*/
update.put = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Modules\Posts\Controllers\PostController::destroy
* @see app/Modules/Posts/Controllers/PostController.php:85
* @route '/admin/posts/{post}'
*/
export const destroy = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/posts/{post}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Modules\Posts\Controllers\PostController::destroy
* @see app/Modules/Posts/Controllers/PostController.php:85
* @route '/admin/posts/{post}'
*/
destroy.url = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { post: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            post: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post: typeof args.post === 'object'
        ? args.post.id
        : args.post,
    }

    return destroy.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Posts\Controllers\PostController::destroy
* @see app/Modules/Posts/Controllers/PostController.php:85
* @route '/admin/posts/{post}'
*/
destroy.delete = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Modules\Posts\Controllers\PostController::trash
* @see app/Modules/Posts/Controllers/PostController.php:96
* @route '/admin/posts/trash'
*/
export const trash = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: trash.url(options),
    method: 'get',
})

trash.definition = {
    methods: ["get","head"],
    url: '/admin/posts/trash',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Posts\Controllers\PostController::trash
* @see app/Modules/Posts/Controllers/PostController.php:96
* @route '/admin/posts/trash'
*/
trash.url = (options?: RouteQueryOptions) => {
    return trash.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Posts\Controllers\PostController::trash
* @see app/Modules/Posts/Controllers/PostController.php:96
* @route '/admin/posts/trash'
*/
trash.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: trash.url(options),
    method: 'get',
})

/**
* @see \App\Modules\Posts\Controllers\PostController::trash
* @see app/Modules/Posts/Controllers/PostController.php:96
* @route '/admin/posts/trash'
*/
trash.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: trash.url(options),
    method: 'head',
})

/**
* @see \App\Modules\Posts\Controllers\PostController::restore
* @see app/Modules/Posts/Controllers/PostController.php:106
* @route '/admin/posts/{id}/restore'
*/
export const restore = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

restore.definition = {
    methods: ["post"],
    url: '/admin/posts/{id}/restore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Posts\Controllers\PostController::restore
* @see app/Modules/Posts/Controllers/PostController.php:106
* @route '/admin/posts/{id}/restore'
*/
restore.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return restore.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Posts\Controllers\PostController::restore
* @see app/Modules/Posts/Controllers/PostController.php:106
* @route '/admin/posts/{id}/restore'
*/
restore.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

/**
* @see \App\Modules\Posts\Controllers\PostController::forceDelete
* @see app/Modules/Posts/Controllers/PostController.php:117
* @route '/admin/posts/{id}/force-delete'
*/
export const forceDelete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: forceDelete.url(args, options),
    method: 'delete',
})

forceDelete.definition = {
    methods: ["delete"],
    url: '/admin/posts/{id}/force-delete',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Modules\Posts\Controllers\PostController::forceDelete
* @see app/Modules/Posts/Controllers/PostController.php:117
* @route '/admin/posts/{id}/force-delete'
*/
forceDelete.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return forceDelete.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Posts\Controllers\PostController::forceDelete
* @see app/Modules/Posts/Controllers/PostController.php:117
* @route '/admin/posts/{id}/force-delete'
*/
forceDelete.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: forceDelete.url(args, options),
    method: 'delete',
})

/**
* @see \App\Modules\Posts\Controllers\PostController::exportPdf
* @see app/Modules/Posts/Controllers/PostController.php:128
* @route '/admin/posts/{post}/pdf'
*/
export const exportPdf = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportPdf.url(args, options),
    method: 'get',
})

exportPdf.definition = {
    methods: ["get","head"],
    url: '/admin/posts/{post}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Posts\Controllers\PostController::exportPdf
* @see app/Modules/Posts/Controllers/PostController.php:128
* @route '/admin/posts/{post}/pdf'
*/
exportPdf.url = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { post: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            post: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post: typeof args.post === 'object'
        ? args.post.id
        : args.post,
    }

    return exportPdf.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Posts\Controllers\PostController::exportPdf
* @see app/Modules/Posts/Controllers/PostController.php:128
* @route '/admin/posts/{post}/pdf'
*/
exportPdf.get = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportPdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Modules\Posts\Controllers\PostController::exportPdf
* @see app/Modules/Posts/Controllers/PostController.php:128
* @route '/admin/posts/{post}/pdf'
*/
exportPdf.head = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportPdf.url(args, options),
    method: 'head',
})

const posts = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    trash: Object.assign(trash, trash),
    restore: Object.assign(restore, restore),
    forceDelete: Object.assign(forceDelete, forceDelete),
    exportPdf: Object.assign(exportPdf, exportPdf),
}

export default posts