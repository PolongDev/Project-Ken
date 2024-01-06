const fs = require("fs");
const path = require("path");

async function sysCommand(event, api) {
    const filePath = path.join(__dirname, "..", "json", "userpanel.json");
    const items = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const vips = items.userpanel.VIPS;
    const senderID = event.senderID;

    if (!vips.includes(senderID)) {
        api.sendMessage("🚫 Access Denied. You lack the necessary permissions to utilize this command.", event.threadID);
        return;
    }

    const input = event.body.toLowerCase().split(" ");
    const action = input[1];

    if (!action || action === "-help") {
        api.sendMessage("Command Usage:\n\n✅ sys -on: Activates the system.\n✅ sys -off: Deactivates the system.\n\n⚠️ Warning: Only VIP users are authorized to use this command.", event.threadID);
        return;
    }

    const settingsFilePath = path.join(__dirname, "..", "json", "settings.json");
    const settings = JSON.parse(fs.readFileSync(settingsFilePath, "utf8"));

    if (action === "-on") {
        settings[0].sys = true;
        fs.writeFileSync(settingsFilePath, JSON.stringify(settings), "utf8");
        api.sendMessage("✅ System Status Update: \n\nThe system has been successfully activated.", event.threadID);
    } else if (action === "-off") {
        settings[0].sys = false;
        fs.writeFileSync(settingsFilePath, JSON.stringify(settings), "utf8");
        api.sendMessage("⛔ System Status Update: \n\nThe system has been successfully deactivated.", event.threadID);
    } else {
        api.sendMessage('❌ Error: Invalid action. Please use "sys -help" for a list of valid commands.', event.threadID);
    }
}

module.exports = sysCommand;
