---
permalink: /
title: "Homepage"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<div style="float:right; margin-top:-2.8em; margin-bottom:0.5em;"><a href="/zh/" style="display:inline-block; border:1.5px solid var(--global-text-color,#333); border-radius:4px; padding:4px 12px; font-weight:bold; font-size:0.9em; color:inherit; text-decoration:none;">中</a></div>

Hi, I'm **WU, Jinjun (吴金骏)**, a Year 2 undergraduate in the **B.Eng in Computer Science (COMP)** program at the **[Department of Computer Science and Engineering](https://cse.hkust.edu.hk/)**, School of Engineering, **[The Hong Kong University of Science and Technology (HKUST)](https://hkust.edu.hk/)**. My MBTI is **ISTP**. In my spare time, I enjoy watching variety shows, going out for good food, playing games (Genshin Impact, Tiào Yī Tiào, Monument Valley), and building random (mostly useless) things with vibe coding. :)

<span style="display:inline-block; border: 2px solid var(--global-border-color, #ccc); border-radius: 20px; padding: 6px 16px; margin: 4px 8px; font-size:0.95em; color: var(--global-text-color, #333);">Cybersecurity</span>
<span style="display:inline-block; border: 2px solid var(--global-border-color, #ccc); border-radius: 20px; padding: 6px 16px; margin: 4px 8px; font-size:0.95em; color: var(--global-text-color, #333);">Computer Architecture / Network</span>
<span style="display:inline-block; border: 2px solid var(--global-border-color, #ccc); border-radius: 20px; padding: 6px 16px; margin: 4px 8px; font-size:0.95em; color: var(--global-text-color, #333);">Artificial Intelligence</span>

## Education

**B.Eng in Computer Science** (transferred from B.Eng in Microelectronics and Integrated Circuits in June 2026)  
<span style="display:flex; justify-content:space-between;"><span>*The Hong Kong University of Science and Technology (HKUST)*</span><span>September 2025 – Present</span></span>
CGPA: **3.99/4.3** (top 2% in HKUST)  
Major CGPA: **4.195/4.3**

## Experience

### IELTS Teaching Assistant — QULEDA
*July 2026 – August 2026*

- Responsible for grading student assignments and providing detailed feedback
- Conducted one-on-one oral English tutoring sessions
- Produced listening comprehension audio materials

## Projects & Competitions

### EdgeHealth-ML: On-Device Multimodal Activity Recognition
*June 2026*  
**Tools:** Python, PyTorch, torchvision, Claude Code

- Designed a dual-branch multimodal fusion architecture: Vision branch uses MobileNetV3-Small for STFT spectrogram features; IMU branch uses a 3-layer 1D-CNN to process raw 6-channel accelerometer + gyroscope signals. Features are fused via concatenation + 2-layer MLP with dropout.
- Evaluated on the UCI HAR Dataset (30 subjects, 6 activities: walking, walking upstairs/downstairs, sitting, standing, laying), achieving 87.6% test accuracy of dynamic activities (walking 100%, stair-climbing 96%).

### Kaggle Competition: Stellar Class Classification
*May 2026*  
**Tools:** Python, NumPy, Pandas, Scikit-Learn, Matplotlib

- Participated in a classification competition to predict galaxy and star types from 12-dimensional photometric data $$\mathbf{x} = \langle x_1, x_2, \ldots, x_{12} \rangle$$ (redshift, spectral features, galaxy population, etc.). Performed data preprocessing including categorical variable encoding and min-max normalization to [0, 1].
- Implemented multiple models: Decision Stump (from scratch), KNN and K-means (via Scikit-Learn). Evaluated model performance through confusion matrix, Precision, Recall, and F1 scores; identified limitations in separating overlapping galaxy and star clusters. Achieved 94% classification accuracy on the test set using KNN.

### [Agent Breaker](https://play.lakera.ai/) — Lakera
*July 2026*  
**Score: 1787 · Leaderboard: top 200 (top 2%)**

- Participated in the Agent Breaker challenge — a GenAI security competition where the goal is to hack real-world AI agents across multiple levels using prompt injection attacks that bypass defenses and manipulate underlying LLMs
- Attacked diverse GenAI applications to steal sensitive data, extract system instructions, and manipulate LLM behavior; scored 1787 points, ranking among top 200 globally (top 2%)

### Skill Writer Skill
**Tools:** PowerShell

A Claude Code skill to help write other skills — meta-tooling for skill authoring workflows.

## WIP / Ideas

These are projects I plan to work on (some may be perpetually under construction):

- **QULEDA 错题自动批改系统** — Automated error grading system for QULEDA (currently on hold / abandoned)
- **满满情绪价值系统** — A system that provides abundant emotional value

## Honors & Awards

- **SENG Dean's List**, HKUST — 2025-26 Fall, 2025-26 Spring
- **University's Scholarship Scheme** for Continuing Undergraduate Students (HKD 40,000, Pending)
