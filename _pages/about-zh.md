---
permalink: /zh/
title: "主页"
author_profile: true
---

<div style="float:right; margin-top:-2.8em; margin-bottom:0.5em;"><a href="/" style="display:inline-block; border:1.5px solid var(--global-text-color,#333); border-radius:4px; padding:4px 12px; font-weight:bold; font-size:0.9em; color:inherit; text-decoration:none;">EN</a></div>

你好，我是 **WU, Jinjun (吴金骏)**，目前就读于 **[香港科技大学 (HKUST)](https://hkust.edu.hk/)** 工学院 **[计算机科学及工程学系](https://cse.hkust.edu.hk/)** 的 **计算机科学专业 B.Eng (COMP)** 大二年级。MBTI 是 **ISTP**。课余时间喜欢看综艺、干饭、打游戏（原神、跳一跳、纪念碑谷），以及用 vibe coding 做一些（没什么用的）东西。:)

<span style="display:inline-block; border: 2px solid var(--global-border-color, #ccc); border-radius: 20px; padding: 6px 16px; margin: 4px 8px; font-size:0.95em; color: var(--global-text-color, #333);">网络安全</span>
<span style="display:inline-block; border: 2px solid var(--global-border-color, #ccc); border-radius: 20px; padding: 6px 16px; margin: 4px 8px; font-size:0.95em; color: var(--global-text-color, #333);">计算机体系结构 / 网络</span>
<span style="display:inline-block; border: 2px solid var(--global-border-color, #ccc); border-radius: 20px; padding: 6px 16px; margin: 4px 8px; font-size:0.95em; color: var(--global-text-color, #333);">人工智能</span>

## 教育背景

**计算机科学 B.Eng**（2026年6月从微电子与集成电路专业转入）  
<span style="display:flex; justify-content:space-between;"><span>*香港科技大学 (HKUST)*</span><span>2025年9月 – 至今</span></span>
CGPA: **3.99/4.3**（HKUST 前 2%）

## 实习经历

### 雅思助教 — QULEDA
*2026年7月 – 2026年8月*

- 负责批改学生作业并提供详细反馈
- 一对一英语口语辅导
- 制作听力练习音频材料

## 项目 & 比赛

### EdgeHealth-ML: 设备端多模态活动识别
*2026年6月*  
**工具:** Python, PyTorch, torchvision, Claude Code

- 设计了双分支多模态融合架构：视觉分支使用 MobileNetV3-Small 提取 STFT 频谱特征；IMU 分支使用 3层 1D-CNN 处理原始 6 通道加速度计+陀螺仪信号。特征通过拼接 + 2层 MLP（含 Dropout）进行融合
- 在 UCI HAR 数据集（30位受试者，6种活动）上评估，动态活动测试准确率达 87.6%（步行 100%，上下楼梯 96%）

### Kaggle 比赛: 恒星分类
*2026年5月*  
**工具:** Python, NumPy, Pandas, Scikit-Learn, Matplotlib

- 参与分类比赛，从 12 维光度数据预测星系和恒星类型，进行了分类变量编码和 min-max 归一化至 [0, 1] 的预处理
- 实现了多种模型：Decision Stump（从零编写）、KNN 和 K-means（通过 Scikit-Learn）。使用 KNN 在测试集上达到 94% 的分类准确率

### [Agent Breaker](https://play.lakera.ai/) — Lakera
*2026年7月*  
**分数: 1782 · 排行榜: #170（前 2%）**

- 参加了 Agent Breaker 挑战赛——一个 GenAI 安全竞赛，目标是通过 prompt injection 攻击绕过防御并操控底层 LLM，跨多个级别黑掉真实世界的 AI 智能体
- 攻击各类 GenAI 应用以窃取敏感数据、提取系统指令并操控 LLM 行为；获得 1782 分，全球排名 #170（参赛者前 2%）

### Skill Writer Skill
**工具:** PowerShell

一个用于编写其他 Claude Code 技能的元工具 — 服务于技能编写工作流

## 计划中的项目

这些是我打算做的项目（有些可能长期烂尾）：

- **QULEDA 错题自动批改系统** — 自动化错题批改系统（目前搁置中）
- **满满情绪价值系统** — 提供满满情绪价值的系统
- **预测前途一片光明/一片黯淡系统** — 预测前途的算命系统

## 荣誉与奖项

- **SENG 院长嘉许名单**，HKUST — 2025-26 秋季、2025-26 春季
- **大学持续本科生奖学金计划**（HKD 40,000，待定）
