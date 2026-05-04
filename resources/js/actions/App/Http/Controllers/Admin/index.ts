import DashboardController from './DashboardController'
import UserController from './UserController'
import SettingController from './SettingController'
import ActivityLogController from './ActivityLogController'

const Admin = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    UserController: Object.assign(UserController, UserController),
    SettingController: Object.assign(SettingController, SettingController),
    ActivityLogController: Object.assign(ActivityLogController, ActivityLogController),
}

export default Admin