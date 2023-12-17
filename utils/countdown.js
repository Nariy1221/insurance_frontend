export default {
  data() {
    return {
      countdown: 359, // 初始倒计时秒数
      countdownInterval: null, // 用于存储定时器的变量
    };
  },
  methods: {
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${String(minutes).padStart(2, '0')}分${String(remainingSeconds).padStart(2, '0')}秒`;
    },
    startCountdown() {
      this.countdownInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
          const formattedTime = this.formatTime(this.countdown);
          console.log(`剩余时间：${formattedTime}`);
          // 触发自定义事件，并传递实时时间
          this.$emit('countdown-updated', formattedTime);
        } else {
          clearInterval(this.countdownInterval); // 清除倒计时
          this.countdownInterval = null; // 设置为null以避免后续执行
        }
      }, 1000); // 每秒减少1秒
    },
    stopCountdown() {
      if (this.countdownInterval !== null) {
        clearInterval(this.countdownInterval); // 清除倒计时
        this.countdownInterval = null; // 设置为null以避免后续执行
      }
    },
  },
};
