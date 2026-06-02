// ──────────────────────────────────────
// Daily Forge — 自动化测试脚本
// 使用 miniprogram-automator 进行功能测试
// 前提：需要先打开微信开发者工具并加载本项目
// ──────────────────────────────────────

const automator = require('miniprogram-automator');

// 测试配置
const CONFIG = {
  projectPath: 'f:/【99】training code/daily-forge-miniapp',
  // 微信开发者工具 CLI 路径（默认安装位置）
  cliPath: 'F:/微信web开发者工具/cli.bat',
};

async function main() {
  console.log('🚀 启动 Daily Forge 自动化测试...\n');

  let miniProgram;
  try {
    // 启动小程序
    miniProgram = await automator.launch({
      projectPath: CONFIG.projectPath,
      cliPath: CONFIG.cliPath,
    });

    console.log('✅ 小程序已启动');

    // 获取当前页面
    const page = await miniProgram.currentPage();
    console.log(`📄 当前页面: ${page.path}`);

    // 测试 1: 验证页面元素
    console.log('\n--- 测试 1: 验证页面结构 ---');
    await page.waitFor(1000);

    // 检查导航栏
    const navTitle = await page.$('.nav-title');
    if (navTitle) {
      const titleText = await navTitle.text();
      console.log(`📱 导航标题: ${titleText.trim()}`);
    }

    // 检查统计卡片
    const statCards = await page.$$('.stat-card');
    console.log(`📊 统计卡片数量: ${statCards.length}`);

    // 检查任务卡片
    const taskCards = await page.$$('.task-card');
    console.log(`📋 任务卡片数量: ${taskCards.length}`);

    // 测试 2: 主题切换
    console.log('\n--- 测试 2: 主题切换 ---');
    const themeToggle = await page.$('.theme-toggle');
    if (themeToggle) {
      await themeToggle.tap();
      await page.waitFor(500);
      console.log('🌓 主题切换按钮已点击');
    }

    // 测试 3: 视图切换
    console.log('\n--- 测试 3: 视图切换 ---');
    const historyBtn = await page.$$('.nav-btn');
    if (historyBtn.length > 1) {
      await historyBtn[1].tap();
      await page.waitFor(500);
      console.log('📜 已切换到记录视图');
    }

    // 切回今日视图
    if (historyBtn.length > 0) {
      await historyBtn[0].tap();
      await page.waitFor(500);
      console.log('⚒️ 已切回今日视图');
    }

    // 测试 4: 数据持久化
    console.log('\n--- 测试 4: 数据持久化 ---');
    const storageData = await miniProgram.evaluate(() => {
      return new Promise((resolve) => {
        wx.getStorage({
          key: 'daily_forge_v1',
          success(res) { resolve(res.data); },
          fail() { resolve(null); },
        });
      });
    });
    if (storageData) {
      console.log('💾 存储数据:');
      console.log(`   XP: ${storageData.xp}`);
      console.log(`   连续天数: ${storageData.streak}`);
      console.log(`   记录天数: ${Object.keys(storageData.daily || {}).length}`);
    } else {
      console.log('💾 存储为空（首次运行）');
    }

    // 测试 5: 动画状态
    console.log('\n--- 测试 5: 动画验证 ---');
    const animatedElements = await page.$$('.card-enter, .stats-enter, .xp-enter, .identity-enter');
    console.log(`✨ 动画元素数量: ${animatedElements.length}`);

    // 测试 6: 点击完成任务
    console.log('\n--- 测试 6: 完成任务测试 ---');
    const completeBtns = await page.$$('.btn-complete');
    if (completeBtns.length > 0) {
      await completeBtns[0].tap();
      await page.waitFor(800);
      const toast = await page.$('.toast');
      if (toast) {
        const toastText = await toast.text();
        console.log(`🔔 Toast 提示: ${toastText.trim()}`);
      }
    }

    console.log('\n✅ 所有测试完成！');

    // 清理
    await miniProgram.close();

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.log('\n💡 提示:');
    console.log('   1. 确保微信开发者工具已安装');
    console.log('   2. 打开微信开发者工具，导入本项目');
    console.log('   3. 在设置 > 安全设置中开启服务端口');
    console.log(`   4. CLI 路径: ${CONFIG.cliPath}`);

    if (miniProgram) {
      await miniProgram.close().catch(() => {});
    }
  }
}

main();
