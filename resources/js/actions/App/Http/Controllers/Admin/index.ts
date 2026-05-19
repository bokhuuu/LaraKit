import DashboardController from './DashboardController'
import UserController from './UserController'
import SettingController from './SettingController'
import RoleController from './RoleController'
import ActivityLogController from './ActivityLogController'
import NotificationController from './NotificationController'

const Admin = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    UserController: Object.assign(UserController, UserController),
    SettingController: Object.assign(SettingController, SettingController),
    RoleController: Object.assign(RoleController, RoleController),
    ActivityLogController: Object.assign(ActivityLogController, ActivityLogController),
    NotificationController: Object.assign(NotificationController, NotificationController),
}

export default Admin