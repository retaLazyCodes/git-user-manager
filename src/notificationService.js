const { Notification } = require("electron")

const notifyCreatedUser = async () => {
    new Notification({
        title: "Git User Manager",
        body: "New User Created Successfully",
    }).show();
}

const notifyUpdatedUser = async () => {
    new Notification({
        title: "Git User Manager",
        body: "User data Updated Successfully",
    }).show();
}

const notifyDeletedUser = async () => {
    new Notification({
        title: "Git User Manager",
        body: "User Deleted Successfully",
    }).show();
}

const notifySeletedUser = async (name) => {
    new Notification({
        title: "Git User Manager",
        body: `The User "${name}" is now active`,
    }).show();
}

module.exports = {
    notifyCreatedUser,
    notifyUpdatedUser,
    notifyDeletedUser,
    notifySeletedUser
};