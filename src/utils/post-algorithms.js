class PostAlgorithms {
  static W_shared_interest = 0.5;
  static W_popularity = 0.3;
  static W_following = 0.2;

  constructor() {}

  getCommonInterests(user1, user2) {
    const tempHash = new Map();
    const commonSet = new Set();
    for (const interest of user1) {
      tempHash.set(interest, 1);
    }

    for (const interest of user2) {
      if (tempHash.has(interest)) {
        commonSet.add(interest);
      }
    }

    return Array.from(commonSet);
  }
}

module.exports = PostAlgorithms;
