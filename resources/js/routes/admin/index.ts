import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import users from './users'
import settings from './settings'
import roles from './roles'
import activityLog from './activity-log'
import notifications from './notifications'
import posts from './posts'
/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
* @see app/Http/Controllers/Admin/DashboardController.php:20
* @route '/admin/dashboard'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
* @see app/Http/Controllers/Admin/DashboardController.php:20
* @route '/admin/dashboard'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
* @see app/Http/Controllers/Admin/DashboardController.php:20
* @route '/admin/dashboard'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
* @see app/Http/Controllers/Admin/DashboardController.php:20
* @route '/admin/dashboard'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

const admin = {
    dashboard: Object.assign(dashboard, dashboard),
    users: Object.assign(users, users),
    settings: Object.assign(settings, settings),
    roles: Object.assign(roles, roles),
    activityLog: Object.assign(activityLog, activityLog),
    notifications: Object.assign(notifications, notifications),
    posts: Object.assign(posts, posts),
}

export default admin