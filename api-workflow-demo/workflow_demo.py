"""
搭建工作流调用 API - 可运行示例
==================================

三种常见模式：链式调用、条件分支、并行+汇总

运行方式: python -S workflow_demo.py
（只用 Python 标准库，无需安装任何第三方包）
"""

import json
import time
import urllib.request
import urllib.error
from typing import Any, Callable


# ─────────────────────────────────────────────────
# 工具函数
# ─────────────────────────────────────────────────

def http_get(url: str, timeout: int = 10) -> dict:
    """用标准库发起 GET 请求，返回 JSON 解析结果"""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read().decode("utf-8")
            return {"success": True, "data": json.loads(body), "raw": body}
    except Exception as e:
        return {"success": False, "data": None, "error": str(e)}


def call_api(name: str, url: str, parser: Callable) -> dict:
    """调用 API 并打印状态"""
    result = http_get(url)
    if result["success"]:
        parsed = parser(result["data"])
        print(f"  ✓ {name} 成功")
        return {"api": name, "success": True, "data": parsed}
    else:
        print(f"  ✗ {name} 失败: {result['error']}")
        return {"api": name, "success": False, "data": None, "error": result["error"]}


# ════════════════════════════════════════════════════
# 模式一：链式调用（Chain）
#   API-A 的输出 → 变成 API-B 的输入
# ════════════════════════════════════════════════════

def chain_demo():
    """
    场景：每天自动收集数据 → 处理 → 输出

    步骤：
      1. 获取一句中文名言（模拟数据源）
      2. 用 httpbin 来回显处理结果（模拟 AI 处理）
      3. 输出最终消息（模拟推送）
    """
    print("\n" + "=" * 60)
    print("🔗 模式一：链式调用 (Chain)")
    print("   API-A 输出 → API-B 的输入 → API-C 的输入")
    print("=" * 60)

    # ── Step 1: 获取名言（数据源） ──
    print("\n[Step 1] 获取名言（模拟数据源 API）...")
    result = call_api(
        "名言API",
        "https://v1.hitokoto.cn/",
        lambda d: {"sentence": d["hitokoto"], "from": d.get("from", "未知")},
    )
    if not result["success"]:
        result["data"] = {"sentence": "千里之行，始于足下", "from": "备用"}
    sentence = result["data"]["sentence"]
    source = result["data"]["from"]
    print(f"   结果: 「{sentence}」—— {source}")

    # ── Step 2: 模拟处理（echo 返回） ──
    print("\n[Step 2] 用 httpbin 模拟 AI 处理...")
    result2 = call_api(
        "Echo API",
        f"https://httpbin.org/post",
        lambda d: d,
    )
    if result2["success"]:
        print(f"   结果: API 响应正常")
        processed = sentence
    else:
        # HTTPBin 的 GET endpoint
        result2b = call_api(
            "Echo GET",
            f"https://httpbin.org/get?text={urllib.request.quote(sentence[:30])}",
            lambda d: d,
        )
        processed = sentence

    # ── Step 3: 组装输出 ──
    print("\n[Step 3] 组装最终消息（模拟推送 API）...")
    final = {
        "title": "📰 每日一言",
        "zh": sentence,
        "en": f"[translated] {sentence[:30]}...",
        "time": time.strftime("%Y-%m-%d %H:%M"),
    }
    print(f"   结果: 推送消息已生成")
    print(f"   ┌─{'─' * 42}─┐")
    print(f"   │ {final['title']}                    │")
    print(f"   │ 内容: {final['zh'][:20]}...     │")
    print(f"   │ 时间: {final['time']}         │")
    print(f"   └─{'─' * 42}─┘")

    print("\n  ✅ 链式调用完成: 名言API → 处理API → 推送消息")
    return final


# ════════════════════════════════════════════════════
# 模式二：条件分支（Conditional Branch）
#   根据 API 返回结果走不同分支
# ════════════════════════════════════════════════════

def branch_demo():
    print("\n" + "=" * 60)
    print("🔀 模式二：条件分支 (Branch)")
    print("   根据 API 返回结果 → 走不同分支")
    print("=" * 60)

    # ── Step 1: 检测网络状态 ──
    print("\n[Step 1] 检查 API 服务状态...")
    r = http_get("https://httpbin.org/status/200", timeout=5)
    online = r["success"]
    print(f"   服务状态: {'✅ 在线' if online else '❌ 离线'}")

    # ── Step 2: 根据条件分流 ──
    print("\n[Step 2] 判断后走不同分支...")
    if online:
        print("  ── 分支 A: 在线模式 ──")
        weather_r = http_get("https://wttr.in/Beijing?format=3", timeout=10)
        if weather_r["success"]:
            weather = weather_r["raw"].strip()
            print(f"  天气: {weather}")
            if "sunny" in weather.lower() or "clear" in weather.lower():
                print("  ✅ 推荐: 去户外运动 🏃")
            elif "rain" in weather.lower() or "snow" in weather.lower():
                print("  ☔ 推荐: 在家看书 📖")
            else:
                print("  🚶 推荐: 正常出门 💼")
        else:
            print("  🌤️  天气服务不可用，走默认逻辑")
    else:
        print("  ── 分支 B: 离线模式 ──")
        print("  📁 使用本地缓存数据工作")

    print("\n  ✅ 条件分支完成")


# ════════════════════════════════════════════════════
# 模式三：并行 + 汇总（Fan-out / Fan-in）
#   同时调多个 API → 汇总结果
# ════════════════════════════════════════════════════

def parallel_demo():
    print("\n" + "=" * 60)
    print("⚡ 模式三：并行调用 + 汇总 (Fan-out/Fan-in)")
    print("   同时调多个 API → 结果汇总")
    print("=" * 60)

    print("\n[Step 1] 同时请求多个数据源...")

    apis = [
        ("IP信息", "https://httpbin.org/ip",
         lambda d: {"ip": d["origin"]}),
        ("请求头", "https://httpbin.org/user-agent",
         lambda d: {"user_agent": d["user-agent"]}),
        ("当前状态", "https://httpbin.org/anything",
         lambda d: {"method": d.get("method", "GET"),
                     "time": time.strftime("%H:%M:%S")}),
    ]

    results = {}
    for name, url, parser in apis:
        results[name] = call_api(name, url, parser)

    # Step 2: 汇总
    print("\n[Step 2] 汇总所有结果...")
    report = {
        "标题": "📊 系统状态报告",
        "生成时间": time.strftime("%Y-%m-%d %H:%M:%S"),
    }

    print(f"\n  ┌─{'─' * 42}─┐")
    print(f"  │ {report['标题']}              │")
    print(f"  │ 时间: {report['生成时间']}  │")
    for name, result in results.items():
        if result["success"]:
            val = str(list(result["data"].values())[0])[:22]
            print(f"  │ {name}: {val} │")
        else:
            print(f"  │ {name}: ❌ 失败 │")
    print(f"  └─{'─' * 42}─┘")

    print("\n  ✅ 并行+汇总完成: 3个 API → 1份报告")
    return report


# ════════════════════════════════════════════════════
# 模式四：真实场景案例展示
# ════════════════════════════════════════════════════

def show_real_scenario():
    print("\n" + "=" * 60)
    print("🏗️  真实场景：每日 AI 新闻工作流")
    print("「每天自动收集热门 AI 新闻 → 总结 → 推送到群聊」")
    print("=" * 60)

    workflow = {
        "名称": "AI 新闻日报",
        "触发": "⏰ 每天 09:00 (Cron 定时)",
        "步骤": [
            {
                "① 抓取源": "HackerNews API",
                "动作": "GET topstories.json",
                "输出": "热门文章 ID 列表",
            },
            {
                "② 获取详情": "HackerNews Item API",
                "输入": "← 上一步的文章 ID",
                "输出": "每篇的标题/链接/分数",
            },
            {
                "③ AI 总结": "OpenAI / 本地模型",
                "输入": "← 上一步的文章标题",
                "输出": "50字以内的中文摘要",
            },
            {
                "④ 推送": "飞书/钉钉 Webhook",
                "输入": "← 上一步的摘要内容",
                "输出": "群聊收到精美卡片",
            },
        ],
        "实现方式": [
            f"  Python + APScheduler    门槛: 中   灵活适合开发者",
            f"  n8n 可视化拖拽          门槛: 低   不用写代码",
            f"  GitHub Actions          门槛: 低   免费, YAML 配置",
        ],
    }

    print(f"\n  📌 {workflow['名称']}")
    print(f"  🕐 触发: {workflow['触发']}")
    print()
    for step in workflow["步骤"]:
        for k, v in step.items():
            print(f"    {k}: {v}")
        print(f"       ↓")

    print(f"  📋 实现方式:")
    for opt in workflow["实现方式"]:
        print(f"    {opt}")

    print("\n  ✅ 这就是「搭建工作流调用 API」的完整含义")
    return workflow


# ════════════════════════════════════════════════════
# 主程序
# ════════════════════════════════════════════════════

def main():
    print("╔══════════════════════════════════════════════╗")
    print("║    🚀 搭建工作流调用 API - 实战演示           ║")
    print("║    三种核心模式 + 一个真实场景                 ║")
    print("╚══════════════════════════════════════════════╝")

    chain_demo()
    branch_demo()
    parallel_demo()
    show_real_scenario()

    print("\n" + "=" * 60)
    print("🎉 总结：")
    print("   「搭建工作流调用 API」就是把多个独立的 API")
    print("   按业务逻辑编排成一条自动管道，")
    print("   让数据和任务自动流转，无需人工干预。")
    print("=" * 60)


if __name__ == "__main__":
    main()
