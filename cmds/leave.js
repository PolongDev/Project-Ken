const path = require("path");
const fs = require("fs");

async function leave(event, api) {
    const filePath = path.join(__dirname, "..", "json", "userpanel.json");
    const items = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const vips = items.userpanel.VIPS;
    const senderID = event.senderID;
    const input = event.body.toLowerCase().split(" ");

    if (!vips.includes(senderID)) {
        api.sendMessage("🚫 Access Denied. You lack the necessary permissions to utilize this command.", event.threadID);
        return;
    }

    if (input.length === 1) {
        api.sendMessage("✈️ Departure process initiated. Hexa is leaving the group. Farewell!", event.threadID, () => {
            setTimeout(() => {
                api.removeUserFromGroup(api.getCurrentUserID(), event.threadID, (err) => {
                    if (err) {
                        api.sendMessage("⚠️ An error occurred while leaving the group. Please try again.", event.threadID);
                    }
                });
            }, 3000);
        });
    } else if (input[1] === "-all") {
        const countdown = 10;

        api.getThreadList(10, null, [], (err, threads) => {
            if (!err) {
                threads.forEach((thread) => {
                    if (thread.isGroup) {
                        api.sendMessage("[INFO] Initiating departure sequence. Hexa will leave all groups in a few seconds. Farewell!", thread.threadID);
                    }
                });
            }
        });

        setTimeout(() => {
            api.getThreadList(10, null, [], (err, threads) => {
                if (!err) {
                    threads.forEach((thread) => {
                        if (thread.isGroup) {
                            api.removeUserFromGroup(api.getCurrentUserID(), thread.threadID);
                        }
                    });
                }
            });
        }, countdown * 1000);

        api.sendMessage("✈️ Departure process initiated. Hexa is leaving all groups. Farewell!", event.threadID);
    } else {
        api.sendMessage('⚠️ Invalid command format. Use "leave" to leave the current group or "leave -all" to leave all groups.', event.threadID);
    }
}

module.exports = leave;
