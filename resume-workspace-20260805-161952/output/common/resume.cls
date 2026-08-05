\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{common/resume}[2026/08/03 Resume Class]

\LoadClass[11pt]{article}

% Packages
\RequirePackage[margin=0.6in]{geometry}
\RequirePackage{enumitem}
\RequirePackage{hyperref}
\RequirePackage{fontspec}
\RequirePackage{titlesec}
\RequirePackage{xcolor}
\RequirePackage{xeCJK}
\RequirePackage{fontawesome5}

% CJK fonts
\setCJKmainfont{SimSun}[BoldFont=SimHei]
\setCJKsansfont{SimHei}
\setCJKmonofont{FangSong}

% English font
\setmainfont{Latin Modern Roman}

% Colors
\definecolor{linkcolor}{RGB}{0,102,153}
\definecolor{sectioncolor}{RGB}{0,51,102}
\definecolor{graytext}{RGB}{100,100,100}

% Hyperref setup
\hypersetup{
  colorlinks=true,
  linkcolor=linkcolor,
  urlcolor=linkcolor,
  pdftitle={简历}
}

% Remove page numbers
\pagestyle{empty}

% Section formatting
\titleformat{\section}
  {\Large\bfseries\color{sectioncolor}}
  {}{0em}
  {}[\titlerule]

\titlespacing*{\section}{0pt}{10pt}{4pt}

% List formatting
\setlist{nosep,leftmargin=1em}
\setlist[itemize]{label=--}

% Header command
\newcommand{\resumeheader}[4]{
  \begin{center}
    {\Huge\bfseries #1}\\[4pt]
    #2 $|$ #3 $|$ \href{#4}{github.com/#3}
  \end{center}
  \vspace{-6pt}
}

% Entry command: \entry{title}{subtitle}{dates}{location}
\newcommand{\entry}[4]{
  \noindent\textbf{#1} \hfill \textit{#3}\\
  \noindent{#2} \hfill #4
}

% Project entry
\newcommand{\projectentry}[3]{
  \noindent\textbf{#1} \hfill \textit{#2}\\
  \noindent\textcolor{graytext}{工具:} #3
}
