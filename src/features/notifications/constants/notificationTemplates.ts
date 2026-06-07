export const notificationTemplates = {
  // 12-Hour Local Reminder
  reminder12h: {
    title: 'Đã lâu rồi bạn chưa đăng gì! 📸',
    body: 'Đã 12 tiếng rồi bạn chưa chia sẻ khoảnh khắc nào. Chụp một bức ảnh hoặc quay video ngay đi!',
  },

  // Push Notification for Friends Posting
  friendPosted: (friendName: string) => ({
    title: 'Khoảnh khắc mới! ✨',
    body: `${friendName} vừa chia sẻ một khoảnh khắc mới! Vào xem ngay nào.`,
  }),

  // Streak Recovery Prompt (Optional notification if we want to remind them to recover)
  streakAtRisk: (friendName: string) => ({
    title: 'Cẩn thận mất chuỗi! 🔥',
    body: `Chuỗi của bạn và ${friendName} đang gặp nguy hiểm. Hãy vào app và khôi phục ngay!`,
  }),
};
