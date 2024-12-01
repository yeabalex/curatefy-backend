const User = require("../../models/spotify-user-model");
const redisClient = require("../../config/redis.config");

class UserService {
  /**
   * Update a specific field for a user
   * @param {string} userId - The ID of the user to update
   * @param {string} field - The field to update
   * @param {Object} updateData - The data to update
   * @returns {Object|null} Updated user document or null if update fails
   */
  static async updateUserField(userId, field, updateData, spotifyId) {
    try {
      if (field === "followers" || field === "following") {
        return await this.handleFollowOperation(userId, updateData);
      }

      if (field === "preferences") {
        const redisUserData = await redisClient.get(spotifyId);

        if (redisUserData) {
          console.log(redisUserData);
          const parsedUserData = JSON.parse(redisUserData);

          parsedUserData.has_completed_registration = true;

          await redisClient.set(spotifyId, JSON.stringify(parsedUserData));
        }
      }

      const updateOperation = { $set: { [field]: updateData } };
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateOperation,
        { new: true, runValidators: true }
      );
      return updatedUser;
    } catch (error) {
      console.error(`Error updating ${field} for user ${userId}:`, error);
      return null;
    }
  }

  /**
   * Handle follow/unfollow operations
   * @param {string} currentUserId - The ID of the user performing the action
   * @param {string} field - Either 'followers' or 'following'
   * @param {Object} followData - Object containing targetUserId and action (add/remove)
   * @returns {Object|null} Updated user document or null if operation fails
   */
  static async handleFollowOperation(currentUserId, followData) {
    const { targetUserId, action } = followData;
    if (!targetUserId || !["add", "remove"].includes(action)) {
      throw new Error("Invalid follow operation parameters");
    }

    try {
      if (action === "add") {
        await User.findByIdAndUpdate(
          targetUserId,
          { $addToSet: { "followers.users": currentUserId } },
          { new: true, runValidators: true }
        );

        return await User.findByIdAndUpdate(
          currentUserId,
          { $addToSet: { "following.users": targetUserId } },
          { new: true, runValidators: true }
        );
      } else if (action === "remove") {
        await User.findByIdAndUpdate(
          targetUserId,
          { $pull: { "followers.users": currentUserId } },
          { new: true, runValidators: true }
        );

        return await User.findByIdAndUpdate(
          currentUserId,
          { $pull: { "following.users": targetUserId } },
          { new: true, runValidators: true }
        );
      }
    } catch (error) {
      console.error(
        `Error in follow operation for user ${currentUserId}:`,
        error
      );
      return null;
    }
  }
}

module.exports = UserService;
